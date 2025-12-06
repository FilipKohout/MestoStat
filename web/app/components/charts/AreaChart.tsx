"use client";

import { useState, useMemo, useEffect, useCallback } from "react"; // Přidáno useCallback
import { AreaChart as TremorAreaChart, CustomTooltipProps } from "@tremor/react";
import { DashboardCard } from "@/app/components/utils/DashboardCard";
import { CustomTooltip } from "@/app/components/charts/ChartTooltip";
import useTableData from "@/app/hooks/charts/useTableData";
import { TableDataParams } from "@/app/services/charts/tableData";
import {
    dateFormatter,
    compactValueFormatter,
    standardValueFormatter,
    getCategoryColorName,
    getCategoryColorHex
} from "@/app/lib/utils";
import { CHART_INDEX_KEY as INDEX_KEY } from "@/app/lib/consts"; // Odstranil jsem COLOR_PALETTE a HEX_COLORS, protože se používají přes getCategoryColorName/Hex
import Button from "@/app/components/utils/Button";
import DatabaseIcon from "@/app/components/icons/DatabaseIcon";
import StatBox from "@/app/components/utils/StatBox";
import Dropdown, { DropdownOption } from "@/app/components/utils/Dropdown";
import useTableMetadata from "@/app/hooks/charts/useTableMetadata";
import { TableVariant } from "@/app/types/charts/TableVariant";

type AreaChartProps = {
    variants: TableVariant[];

    startDate: Date,
    endDate: Date,
    identifierId: number;
    periodicityId: number;

    title: string;
    addTotalCategory?: boolean;
    summaries: {
        average: boolean;
        total: boolean;
        current: boolean;
        max: boolean;
    };
}

export function AreaChart(props: AreaChartProps) {
    const { variants, title, addTotalCategory, summaries: { average, total, current, max } } = props;

    const [selectedVariant, setSelectedVariant] = useState<TableVariant>(variants[0]);
    const { id: tableId, label, digits = 0, aggregationMethod, dataAfix = "" } = selectedVariant;

    const { data, isLoading, isError } = useTableData({
        tableId: tableId,
        startDate: props.startDate,
        endDate: props.endDate,
        identifierId: props.identifierId,
        periodicityId: props.periodicityId,
    } as TableDataParams);
    const { metadata } = useTableMetadata(tableId);

    const formattedData = useMemo(() => {
        if (!data) return [];
        return data.map((item) => {
            const rowTotal = Object.keys(item).reduce((sum, key) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                return key !== INDEX_KEY ? sum + (item[key] ?? 0) : sum;
            }, 0);

            return {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                total: rowTotal,
                ...item,
                [INDEX_KEY]: dateFormatter(item[INDEX_KEY]),
            };
        });
    }, [data]);

    const dataWithoutTotal = useMemo(() => {
        if (!formattedData) return [];
        return formattedData.map(({ total, ...rest }) => rest);
    }, [formattedData]);

    const allCategories = useMemo(() => {
        if (!formattedData || formattedData.length === 0) return [];
        return Object.keys(formattedData[0]).filter(key => key !== INDEX_KEY);
    }, [formattedData]);

    const [activeCategories, setActiveCategories] = useState<string[]>(allCategories);

    const toggleCategory = useCallback((category: string) =>
        setActiveCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        ), []);

    useEffect(() => {
        setActiveCategories(allCategories);
    }, [allCategories]);

    const totalsOnly = useMemo(() => {
        return formattedData.map(item => item.total).filter(val => typeof val === 'number');
    }, [formattedData]);

    const calculateSummary = useCallback((
        summaryFunction: (values: number[]) => number,
        formatter: (value: number | null | undefined, digits: number, afix: string) => string,
        defaultValue: string = '–'
    ) => {
        if (totalsOnly.length === 0) return defaultValue;
        return formatter(summaryFunction(totalsOnly), digits, dataAfix);
    }, [totalsOnly, digits, dataAfix]);

    const currentSummary = useMemo(() => {
        const lastValue = totalsOnly.length > 0 ? totalsOnly[totalsOnly.length - 1] : null;
        const firstValue = totalsOnly.length > 0 ? totalsOnly[0] : null;

        let changeOverPeriod: number | null = null;
        if (lastValue !== null && firstValue !== null && firstValue !== 0) {
            changeOverPeriod = parseFloat(((lastValue - firstValue) / firstValue * 100).toFixed(2));
        } else if (lastValue !== null && firstValue === 0 && lastValue !== 0) {
            changeOverPeriod = 100;
        } else if (lastValue !== null && firstValue === 0 && lastValue === 0) {
            changeOverPeriod = 0;
        }

        return {
            value: standardValueFormatter(lastValue, digits, dataAfix),
            trend: changeOverPeriod,
        };
    }, [totalsOnly, digits, dataAfix]);

    const averageValue = useMemo(() => calculateSummary(
        (values) => values.reduce((sum, val) => sum + val, 0) / values.length,
        standardValueFormatter
    ), [calculateSummary]);

    const totalValue = useMemo(() => calculateSummary(
        (values) => values.reduce((sum, val) => sum + val, 0),
        standardValueFormatter
    ), [calculateSummary]);

    const maxValue = useMemo(() => calculateSummary(
        (values) => Math.max(...values),
        standardValueFormatter
    ), [calculateSummary]);

    const chartValueFormatter = useCallback((value: number) =>
            compactValueFormatter(value, digits, dataAfix),
        [digits, dataAfix]
    );

    const customAreaChartTooltip = useCallback((args: CustomTooltipProps) => (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        <CustomTooltip
            {...args}
            valueFormatter={(value) => standardValueFormatter(value, digits, dataAfix)}
        />
    ), [digits, dataAfix]);


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
            >
                <Dropdown options={variants.map(v => ({ label: v.label, value: v.id } as DropdownOption))} value={tableId} onChange={val => setSelectedVariant(variants.find(v => v.id === val)!)} />
            </DashboardCard.Header>

            <DashboardCard.Content isLoading={isLoading} isError={isError}>
                <div className="w-full flex flex-row flex-nowrap items-center justify-start gap-3 overflow-x-auto py-2 mb-2 px-1 scrollbar-hide">
                    {current && currentSummary.trend !== null && (
                        <StatBox label="Změna za Období" value={currentSummary.value} trend={currentSummary.trend} />
                    )}
                    {average && <StatBox label="Průměr" value={averageValue} />}
                    {total && <StatBox label="Celkem" value={totalValue} />}
                    {max && <StatBox label="Maximum" value={maxValue} />}
                </div>

                <TremorAreaChart
                    className="h-80 w-full chart"
                    data={addTotalCategory ? formattedData : dataWithoutTotal}
                    index={INDEX_KEY}
                    categories={activeCategories}
                    colors={activeCategories.map(cat => getCategoryColorName(allCategories, cat))}
                    valueFormatter={chartValueFormatter}
                    yAxisWidth={55}
                    showLegend={false}
                    showGridLines={true}
                    showYAxis={true}
                    showXAxis={true}
                    curveType="monotone"
                    showAnimation={true}
                    stack={false}
                    animationDuration={500}
                    customTooltip={customAreaChartTooltip as (props: CustomTooltipProps) => never}
                    noDataText="Žádná data"
                />
            </DashboardCard.Content>

            <DashboardCard.Footer>
                {allCategories.map((category) => {
                    const isActive = activeCategories.includes(category);
                    const hexColor = getCategoryColorHex(allCategories, category);

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
                            {category === "total" ? "celkem" : category}
                        </Button>
                    );
                })}
            </DashboardCard.Footer>
        </DashboardCard>
    );
}