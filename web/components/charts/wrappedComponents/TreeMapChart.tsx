import { useMemo, useRef, useState, useEffect } from "react";
import * as d3 from "d3";
import { ChartProps } from "@/components/charts/ChartWrapper";
import { getCategoryColorHex, getCategoryColorName, percentValueFormatter } from "@/lib/utils";
import { CustomTooltip } from "@/components/charts/ChartTooltip";
import { HierarchyNode } from "d3";

type TreeLeaf = {
    type: 'leaf';
    name: string;
    value: number;
};

type TreeNode = {
    type: 'node';
    name: string;
    value: number;
    children: TreeLeaf[];
};

type TreeMapChartProps = {
    aggregation?: "SUM" | "AVG" | "ACT";
    lastPeriod?: boolean;
} & ChartProps;

export default function TreeMapChart(props: TreeMapChartProps) {
    const { data: rawData, activeCategories, allCategories, valueFormatter, aggregation = "AVG", lastPeriod } = props;
    const data = (lastPeriod && rawData) ? rawData.slice(-1) : rawData;

    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const [tooltipData, setTooltipData] = useState<{
        x: number;
        y: number;
        title: string;
        value: number;
        colorName: string;
        visible: boolean;
    } | null>(null);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const hierarchyData = useMemo<TreeNode | null>(() => {
        if (!data || data.length === 0 || activeCategories.length === 0) return null;

        const leaves: TreeLeaf[] = activeCategories.map((category) => {
            const sum = data.reduce((acc, item) => acc + (Number(item[category]) || 0), 0);

            let finalValue = sum;

            if (aggregation === "AVG")
                finalValue = sum / data.length;
            else if (aggregation === "ACT")
                finalValue = data.length > 0 ? (Number(data[data.length - 1][category]) ?? 0) : 0;

            return {
                type: "leaf",
                name: category,
                value: finalValue
            } as TreeLeaf;
        }).filter(leaf => leaf.value > 0);

        if (leaves.length === 0) return null;

        return {
            type: 'node',
            name: "root",
            value: 0,
            children: leaves
        };
    }, [data, activeCategories, aggregation]);

    const root = useMemo(() => {
        if (!hierarchyData || dimensions.width === 0 || dimensions.height === 0) return null;

        const hierarchy = d3.hierarchy(hierarchyData)
            .sum((d) => d.value)
            .sort((a, b) => (b.value || 0) - (a.value || 0));

        const treeGenerator = d3.treemap<TreeNode | TreeLeaf>()
            .size([dimensions.width, dimensions.height])
            .padding(4)
            .paddingOuter(0)
            .round(true);

        return treeGenerator(hierarchy as HierarchyNode<TreeNode | TreeLeaf>);
    }, [hierarchyData, dimensions]);

    const sum = useMemo(() => {
        if (!hierarchyData) return 0;
        return hierarchyData.children.reduce((acc, child) => acc + child.value, 0);
    }, [hierarchyData]);

    const handleMouseMove = (e: React.MouseEvent, name: string, value: number, colorName: string) => {
        setTooltipData({
            x: e.clientX + 15,
            y: e.clientY + 15,
            title: name,
            value: value,
            colorName: colorName,
            visible: true
        });
    };

    const handleMouseLeave = () => setTooltipData(null);

    if (!root)
        return (
            <div ref={containerRef} className="h-80 w-full flex items-center justify-center text-slate-500 text-sm">
                {!data || data.length === 0 ? "Žádná data" : "Načítání..."}
            </div>
        );

    return (
        <div ref={containerRef} className="h-80 w-full relative group">
            <svg width={dimensions.width} height={dimensions.height} className="shape-rendering-crispEdges font-sans">
                {root.leaves().map((leaf, i) => {
                    const categoryName = (leaf.data as TreeLeaf).name;
                    const leafValue = leaf.value as number;

                    const fillColor = getCategoryColorHex(allCategories, categoryName);
                    const colorName = getCategoryColorName(allCategories, categoryName);

                    const width = leaf.x1 - leaf.x0;
                    const height = leaf.y1 - leaf.y0;

                    const isTiny = width < 35 || height < 35;
                    const isSmall = width < 60 || height < 50;
                    const isLarge = width > 120 && height > 100;

                    const titleFontSize = Math.min(Math.max(width / 8, 12), 24);

                    return (
                        <g
                            key={leaf.id || i}
                            transform={`translate(${leaf.x0},${leaf.y0})`}
                            className="transition-opacity duration-200 hover:opacity-90 cursor-default"
                            onMouseMove={(e) => handleMouseMove(e, categoryName, leafValue, colorName)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <rect
                                width={width}
                                height={height}
                                fill={fillColor}
                                rx={6}
                                ry={6}
                                className="stroke-slate-900 stroke-2"
                            />

                            {!isTiny && (
                                <foreignObject x={0} y={0} width={width} height={height} className="pointer-events-none">
                                    <div className="h-full w-full flex flex-col items-center justify-center p-1 text-center text-white overflow-hidden leading-tight">

                                        <span
                                            className="font-bold drop-shadow-md line-clamp-2 w-full break-words"
                                            style={{ fontSize: `${titleFontSize}px` }}
                                        >
                                            {categoryName}
                                        </span>

                                        {!isSmall && (
                                            <div className="mt-1 flex flex-col items-center opacity-90 drop-shadow-md">
                                                <span className="text-xs font-medium">
                                                    {valueFormatter(leafValue)}
                                                </span>

                                                {isLarge && (
                                                    <span className="text-[30px] font-black mt-0.5">
                                                        {percentValueFormatter(leafValue / sum * 100)}%
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </foreignObject>
                            )}
                        </g>
                    );
                })}
            </svg>

            {tooltipData && tooltipData.visible && (
                <div
                    className="fixed z-50 pointer-events-none"
                    style={{
                        left: tooltipData.x,
                        top: tooltipData.y,
                    }}
                >
                    <CustomTooltip
                        active={true}
                        label={tooltipData.title == "total" ? "Celkem" : tooltipData.title}
                        valueFormatter={valueFormatter as (value: number | null | undefined) => string}
                        payload={[{
                            name: tooltipData.title,
                            value: tooltipData.value,
                            color: tooltipData.colorName
                        }]}
                    />
                </div>
            )}
        </div>
    );
}