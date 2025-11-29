'use client';

import { useState, useMemo, useEffect } from "react";
import { AreaChart, CustomTooltipProps } from "@tremor/react";
import { DashboardCard } from "@/app/components/utils/DashboardCard";
import { CustomTooltip } from "@/app/components/charts/ChartTooltip";
import useTableData from "@/app/hooks/charts/useTableData";
import { TableDataParams } from "@/app/services/charts/tableData";
import { dateFormatter, compactValueFormatter, standardValueFormatter } from "@/app/lib/utils";
import { CHART_COLOR_PALETTE as COLOR_PALETTE, HEX_COLORS, CHART_INDEX_KEY as INDEX_KEY } from "@/app/lib/consts";
import Button from "@/app/components/utils/Button";
import { toFixedNumber } from "@react-stately/utils";
import useAllTablesMetadata from "@/app/hooks/charts/useAllTablesMetadata";
import DatabaseIcon from "@/app/components/icons/DatabaseIcon";
import StatBox from "@/app/components/utils/StatBox";

type ChartProps = TableDataParams & {
    title: string;
    addTotalCategory: boolean;
    summaries: {
        average: boolean;
        total: boolean;
        current: boolean;
        max: boolean;
    };
}

export function Chart(props: ChartProps) {
    const { title, tableId, addTotalCategory, summaries: { average, total, current, max } } = props;
    const { data, isLoading, isError } = useTableData(props);
    const { data: allMetadata } = useAllTablesMetadata();

    const formattedData = useMemo(() => {
        if (!data) return [];
        return data.map((item) => {
            return {
                ...item,
                total: addTotalCategory && Object.keys(item).reduce((sum, key) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        return key !== INDEX_KEY ? sum + item[key] : sum; },
                    0
                ),
                [INDEX_KEY]: dateFormatter(item[INDEX_KEY]),
            };
        });
    }, [addTotalCategory, data]);

    const allCategories = useMemo(() => {
        if (!formattedData || formattedData.length === 0) return [];
        return Object.keys(formattedData[0]).filter(key => key !== INDEX_KEY);
    }, [formattedData]);

    const metadata = useMemo(() => {
        if (!allMetadata) return null;
        return allMetadata.find(meta => meta.tableId == tableId);
    }, [allMetadata, tableId]);

    const [activeCategories, setActiveCategories] = useState<string[]>(allCategories);

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

    const lastValue = formattedData?.length ? formattedData[formattedData.length - 1].total : null;
    const firstValue = formattedData?.length ? formattedData[0].total : null;
    const changeOverPeriod = (lastValue && firstValue) ? toFixedNumber(((lastValue - firstValue) / firstValue) * 100, 2) : null;
    const averageValue = formattedData?.length ? standardValueFormatter(formattedData.reduce((sum, item) => item.total ? sum + item.total : sum, 0) / formattedData.length) : '–';
    const totalValue = formattedData?.length ? standardValueFormatter(formattedData.reduce((sum, item) => item.total ? sum + item.total : sum, 0)) : '–';
    const maxValue = formattedData?.length ? standardValueFormatter(formattedData.reduce((max, item) => item.total ? Math.max(max, item.total) : max, 0)) : '–';

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setActiveCategories(allCategories), [data]);

    return (
        <DashboardCard variant="default">
            <DashboardCard.Header
                title={title}
                action={
                    <Button
                        variant="ghost"
                        size="xs"
                        className="text-slate-500 hover:text-slate-300 px-1.5"
                        title={`Zdroj dat: ${metadata?.sourceDomain || 'N/A'}`}
                        onClick={() => window.open(metadata?.sourceDomain, "_blank")}
                    >
                        <DatabaseIcon className="w-3.5 h-3.5" />
                    </Button>
                }
            />

            <DashboardCard.Content isLoading={isLoading} isError={isError}>
                <div className="w-full flex flex-row flex-nowrap items-center justify-start gap-3 overflow-x-auto py-2 mb-2 px-1 scrollbar-hide">
                    {current && changeOverPeriod !== null && (
                        <StatBox label="Poslední Období" value={lastValue ? standardValueFormatter(lastValue) : '–'} trend={changeOverPeriod} />
                    )}
                    {average && <StatBox label="Průměr" value={averageValue} />}
                    {total && <StatBox label="Celkem" value={totalValue} />}
                    {max && <StatBox label="Maximum" value={maxValue} />}
                </div>

                <AreaChart
                    className="h-80 w-full"
                    data={formattedData}
                    index={INDEX_KEY}
                    categories={activeCategories}
                    colors={activeCategories.map(cat => getCategoryColorName(cat))}
                    valueFormatter={compactValueFormatter}
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
                />
            </DashboardCard.Content>

            <DashboardCard.Footer>
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
            </DashboardCard.Footer>

        </DashboardCard>
    );
}