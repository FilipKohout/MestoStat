'use client';

import { useState, useMemo, useEffect } from "react";
import { AreaChart, CustomTooltipProps } from "@tremor/react";
import { DashboardCard } from "@/app/components/utils/DashboardCard";
import { CustomTooltip } from "@/app/components/charts/ChartTooltip";
import useTableData from "@/app/hooks/charts/useTableData";
import { TableDataParams } from "@/app/services/charts/tableData";
import { dateFormatter, compactValueFormatter, standardValueFormatter, cnTailwind } from "@/app/lib/utils";
import { CHART_COLOR_PALETTE as COLOR_PALETTE, HEX_COLORS, CHART_INDEX_KEY as INDEX_KEY } from "@/app/lib/consts";
import { LoadingSpinner } from "@/app/components/utils/LoadingSpinner";
import Button from "@/app/components/utils/Button";
import { toFixedNumber } from "@react-stately/utils";
import useAllTablesMetadata from "@/app/hooks/charts/useAllTablesMetadata";

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

    console.log(allMetadata);

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

    const lastValue = formattedData && formattedData.length > 0
        ? formattedData[formattedData.length - 1].total
        : null;
    const firstValue = formattedData && formattedData.length > 0
        ? formattedData[0].total
        : null;
    const changeOverPeriod = (lastValue && firstValue)
        ? toFixedNumber(((lastValue - firstValue) / firstValue) * 100, 2)
        : null;

    const averageValue = (formattedData && formattedData.length > 0)
        ? standardValueFormatter(
            formattedData.reduce((sum, item) => item.total ? sum + item.total : sum, 0)
            / formattedData.length
        )
        : '–'

    const totalValue = (formattedData && formattedData.length > 0)
        ? standardValueFormatter(
            formattedData.reduce((sum, item) => item.total ? sum + item.total : sum, 0)
        )
        : '–'

    const maxValue = (formattedData && formattedData.length > 0)
        ? standardValueFormatter(
            formattedData.reduce((max, item) => item.total ? Math.max(max, item.total) : max, 0)
        )
        : '–'

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setActiveCategories(allCategories), [data]);
    
    return (
        <DashboardCard className="flex flex-col gap-3">
            <div className="flex items-center gap-0.5">
                <h2 className="text-base font-semibold text-white shrink-0">
                    {title}
                </h2>

                <Button
                    variant="ghost"
                    size="xs"
                    className="text-slate-500 hover:text-slate-300 px-1.5"
                    title={`Zdroj dat ${metadata?.sourceDomain || 'N/A'}`}
                    onClick={() => window.open(metadata?.sourceDomain, "_blank")}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                        <ellipse cx="12" cy="5" rx="9" ry="3" />
                        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    </svg>
                </Button>
            </div>

            <div className="flex flex-col items-center justify-center h-80 relative gap-3">
                {isLoading && <LoadingSpinner className="absolute h-12 w-12 text-blue-500" />}
                {!isLoading &&
                    <>
                        <div className="w-full flex flex-row items-center justify-start gap-2 overflow-x-auto scrollbar-hide py-2">
                            {current && changeOverPeriod &&
                                <div className="flex flex-col items-center rounded-lg border border-slate-700 text-xl font-semibold bg-slate-900/80 backdrop-blur-xl px-3 py-1 shadow-xl">
                                    <p className="mb-1 text-xs font-medium text-slate-400">Poslední Období</p>

                                    <div className="flex flex-row items-center gap-2">
                                        <p className="">
                                            {lastValue ? standardValueFormatter(lastValue) : '–'}
                                        </p>
                                        <span className={cnTailwind(`text-xs font-medium bg-black/30 px-1.5 py-0.5 rounded border border-white/5`, changeOverPeriod > 0 ? "text-green-300" : "text-rose-300")}>
                                            {(changeOverPeriod >= 0 ? "+" : "") + changeOverPeriod.toString()}%
                                        </span>
                                    </div>
                                </div>
                            }

                            {average &&
                                <div className="flex flex-col items-center rounded-lg border border-slate-700 text-xl font-semibold bg-slate-900/80 backdrop-blur-xl px-3 py-1 shadow-xl">
                                    <p className="mb-1 text-xs font-medium text-slate-400">Průměr</p>
                                    <p className="">
                                        {averageValue}
                                    </p>
                                </div>
                            }

                            {total &&
                                <div className="flex flex-col items-center rounded-lg border border-slate-700 text-xl font-semibold bg-slate-900/80 backdrop-blur-xl px-3 py-1 shadow-xl">
                                    <p className="mb-1 text-xs font-medium text-slate-400">Celkem</p>
                                    <p className="">
                                        {totalValue}
                                    </p>
                                </div>
                            }

                            {max &&
                                <div className="flex flex-col items-center rounded-lg border border-slate-700 text-xl font-semibold bg-slate-900/80 backdrop-blur-xl px-3 py-1 shadow-xl">
                                    <p className="mb-1 text-xs font-medium text-slate-400">Maximum</p>
                                    <p className="">
                                        {maxValue}
                                    </p>
                                </div>
                            }
                        </div>
                        <AreaChart
                            className="h-80 w-full border-none"
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
                    </>
                }
                {isError && !isLoading && (<div className="text-white text-sm rounded-xl p-4 px-12 bg-rose-600">Chyba při načítání dat</div>)}
            </div>

            <div className="w-full overflow-x-auto scrollbar-hide py-2">
                <div className="flex min-w-full w-max justify-center gap-3 px-2">
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
        </DashboardCard>
    );
}