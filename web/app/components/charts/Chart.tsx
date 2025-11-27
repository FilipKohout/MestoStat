'use client';

import { useState, useMemo, useEffect } from "react";
import { AreaChart, CustomTooltipProps } from "@tremor/react";
import { DashboardCard } from "@/app/components/utils/DashboardCard";
import { CustomTooltip } from "@/app/components/charts/ChartTooltip";
import useChartData from "@/app/hooks/charts/useChartData";
import { ChartDataParams } from "@/app/services/charts/chartData";
import { dateFormatter, valueFormatter } from "@/app/lib/utils";
import { CHART_COLOR_PALETTE as COLOR_PALETTE, HEX_COLORS, CHART_INDEX_KEY as INDEX_KEY } from "@/app/lib/consts";
import { LoadingSpinner } from "@/app/components/utils/LoadingSpinner";
import Button from "@/app/components/utils/Button";

type ChartProps = ChartDataParams & {
    title: string;
    addTotalCategory: boolean;
}

export function Chart(props: ChartProps) {
    const { title } = props;
    const { data, isLoading, isError } = useChartData(props);

    const allCategories = useMemo(() => {
        if (!data || data.length === 0) return [];

        return Object.keys(data[0]).filter(key => key !== INDEX_KEY);
    }, [data]);

    const [activeCategories, setActiveCategories] = useState<string[]>(allCategories);

    const formattedData = useMemo(() => {
        if (!data) return [];

        return data.map((item) => {
            return { ...item, [INDEX_KEY]: dateFormatter(item[INDEX_KEY]) };
        });
    }, [data]);

    const toggleCategory = (category: string) =>
        setActiveCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );

    const getCategoryColorName = (category: string) => {
        const index = allCategories.indexOf(category);
        return COLOR_PALETTE[index % COLOR_PALETTE.length];
    };

    const getCategoryColorHex = (category: string) => {
        const colorName = getCategoryColorName(category);
        return HEX_COLORS[colorName] || "#cbd5e1";
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setActiveCategories(allCategories), [data]);

    return (
        <DashboardCard>
            <div className="flex flex-row justify-between mb-3 gap-4">
                <div className="flex items-center gap-0.5">
                    <h2 className="text-base font-semibold text-white shrink-0">
                        {title}
                    </h2>

                    <Button
                        variant="ghost"
                        size="xs"
                        className="text-slate-500 hover:text-slate-300 px-1.5" // Menší padding pro ikonu
                        title="Zdroj dat: ČSÚ" // Tooltip prohlížeče
                        onClick={() => window.open("...", "_blank")}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                            <ellipse cx="12" cy="5" rx="9" ry="3" />
                            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                        </svg>
                    </Button>
                </div>

                <div className="flex flex-wrap gap-3 justify-end">
                    {allCategories.map((category) => {
                        const isActive = activeCategories.includes(category);
                        const hexColor = getCategoryColorHex(category);

                        return (
                            <Button
                                key={category}
                                onClick={() => toggleCategory(category)}
                                variant={isActive ? "active" : "ghost"}
                                size="xs"
                            >
                                <span
                                    className="h-2 w-2 rounded-full transition-all duration-300"
                                    style={{
                                        backgroundColor: isActive ? hexColor : '#475569',
                                        boxShadow: isActive ? `0 0 8px ${hexColor}80` : 'none'
                                    }}
                                />
                                {category}
                            </Button>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col items-center justify-center h-80 relative gap-3">
                <div className="w-full flex flex-row items-center justify-start gap-2">
                    <div className="flex flex-col items-center rounded-lg border border-slate-700 text-xl font-semibold bg-slate-900/80 backdrop-blur-xl px-3 py-1 shadow-xl">
                        <p className="mb-1 text-xs font-medium text-slate-400">Aktuální</p>

                        <div className="flex flex-row items-center gap-2">
                            <p className="">
                                {data && data.length > 0 ? Intl.NumberFormat("cs-CZ", { notation: "standard" }).format(data[data.length - 1][activeCategories[0]]).toString() : '–'}
                            </p>
                            <span className={`text-xs font-medium bg-black/30 px-1.5 py-0.5 rounded border border-white/5`}>
                                +5%
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center rounded-lg border border-slate-700 text-xl font-semibold bg-slate-900/80 backdrop-blur-xl px-3 py-1 shadow-xl">
                        <p className="mb-1 text-xs font-medium text-slate-400">Průměrný</p>
                        <p className="">
                            {data && data.length > 0 ? Intl.NumberFormat("cs-CZ", { notation: "standard" }).format(data[data.length - 1][activeCategories[0]]).toString() : '–'}
                        </p>
                    </div>
                </div>

                {isLoading && <LoadingSpinner className="absolute h-12 w-12 text-blue-500" />}
                {!isLoading && <AreaChart
                    className="h-80 w-full border-none"
                    data={formattedData}
                    index={INDEX_KEY}
                    categories={activeCategories}
                    colors={activeCategories.map(cat => getCategoryColorName(cat))}
                    valueFormatter={valueFormatter}
                    yAxisWidth={55}
                    showLegend={false}
                    showGridLines={true}
                    showYAxis={true}
                    showXAxis={true}
                    curveType="monotone"
                    showAnimation={true}
                    stack={false}
                    animationDuration={500}
                    customTooltip={CustomTooltip! as (props: CustomTooltipProps) => never}
                    noDataText="Žádná data"
                />}
                {isError && !isLoading && (<div className="text-white text-sm rounded-xl p-4 px-12 bg-rose-600">Chyba při načítání dat</div>)}
            </div>
        </DashboardCard>
    );
}