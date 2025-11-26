'use client';

import { useState, useMemo } from "react";
import { AreaChart } from "@tremor/react";
import { DashboardCard } from "@/app/components/utils/DashboardCard";
import { CustomTooltip } from "@/app/components/charts/ChartTooltip";

const COLOR_PALETTE = ["blue", "emerald", "violet", "amber", "rose", "indigo", "fuchsia", "cyan"];

const HEX_COLORS: { [key: string]: string } = {
    blue: "#3b82f6",
    cyan: "#06b6d4",
    emerald: "#10b981",
    violet: "#8b5cf6",
    amber: "#f59e0b",
    rose: "#f43f5e",
    indigo: "#6366f1",
    fuchsia: "#d946ef"
};

type UniversalChartProps = {
    title: string;
    data: any[];
    indexKey?: string;
}

const dataFormatter = (number: number) =>
    Intl.NumberFormat("cs-CZ", { notation: "compact" }).format(number).toString();

export function Chart({ title, data, indexKey = "start_period" }: UniversalChartProps) {
    const allCategories = useMemo(() => {
        if (!data || data.length === 0) return [];
        return Object.keys(data[0]).filter(key => key !== indexKey);
    }, [data, indexKey]);

    const [activeCategories, setActiveCategories] = useState<string[]>(allCategories);

    const formattedData = useMemo(() => {
        if (!data) return [];

        return data.map((item) => {
            const rawDate = item[indexKey];
            let niceDate = rawDate;

            try {
                const dateObj = new Date(rawDate);
                if (!isNaN(dateObj.getTime())) {
                    niceDate = new Intl.DateTimeFormat("cs-CZ", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric"
                    }).format(dateObj);
                }
            } catch (e) {}
            return { ...item, [indexKey]: niceDate };
        });
    }, [data, indexKey]);

    const toggleCategory = (category: string) => {
        setActiveCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const getCategoryColorName = (category: string) => {
        const index = allCategories.indexOf(category);
        return COLOR_PALETTE[index % COLOR_PALETTE.length];
    };

    const getCategoryColorHex = (category: string) => {
        const colorName = getCategoryColorName(category);
        return HEX_COLORS[colorName] || "#cbd5e1";
    };

    return (
        <DashboardCard>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-base font-semibold text-white shrink-0">{title}</h2>

                <div className="flex flex-wrap gap-3 justify-end">
                    {allCategories.map((category) => {
                        const isActive = activeCategories.includes(category);
                        const hexColor = getCategoryColorHex(category);

                        return (
                            <button
                                key={category}
                                onClick={() => toggleCategory(category)}
                                className={`
                                    flex items-center gap-2 text-xs font-medium transition-all px-2 py-1 rounded-md border
                                    ${isActive
                                    ? "text-slate-200 border-slate-700 bg-slate-800/50"
                                    : "text-slate-500 border-transparent opacity-60 hover:opacity-100"
                                }
                                `}
                            >
                                <span
                                    className="h-2 w-2 rounded-full transition-all duration-300"
                                    style={{
                                        backgroundColor: isActive ? hexColor : '#475569',
                                        boxShadow: isActive ? `0 0 8px ${hexColor}80` : 'none'
                                    }}
                                />
                                {category}
                            </button>
                        );
                    })}
                </div>
            </div>

            {data ?
                <AreaChart
                    className="h-80 w-full"
                    data={formattedData}
                    index={indexKey}
                    categories={activeCategories}
                    colors={activeCategories.map(cat => getCategoryColorName(cat))}
                    valueFormatter={dataFormatter}
                    yAxisWidth={50}
                    showLegend={false}
                    showGridLines={true}
                    showYAxis={true}
                    showXAxis={true}
                    curveType="monotone"
                    showAnimation={true}
                    animationDuration={500}
                    customTooltip={CustomTooltip}
                    noDataText="Žádná data k zobrazení"
                />
                :
                <p>No Data</p>
            }
        </DashboardCard>
    );
}