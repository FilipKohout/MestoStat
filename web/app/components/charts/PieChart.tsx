"use client";

import { DashboardCard } from "@/app/components/utils/DashboardCard";
import Button from "@/app/components/utils/Button";
import DatabaseIcon from "@/app/components/icons/DatabaseIcon";
import { TableDataParams } from "@/app/services/charts/tableData";
import useTableMetadata from "@/app/hooks/charts/useTableMetadata";
import useTableData from "@/app/hooks/charts/useTableData";
import { useMemo, useState, useCallback } from "react"; // Přidán useCallback
import {
    compactValueFormatter,
    getCategoryColorName,
    percentValueFormatter,
    standardValueFormatter, // Nově importován standardValueFormatter
} from "@/app/lib/utils";
import StatBox from "@/app/components/utils/StatBox";
import { DonutChart, CustomTooltipProps } from "@tremor/react"; // Importován CustomTooltipProps pro typování
import { CustomTooltip } from "@/app/components/charts/ChartTooltip";
import Dropdown, { DropdownOption } from "@/app/components/utils/Dropdown";
import { TableVariant } from "@/app/types/charts/TableVariant";

type PieChartProps = {
    variants: TableVariant[];

    startDate: Date,
    endDate: Date,
    identifierId: number;
    periodicityId: number;

    title: string;
}

export default function PieChart(props: PieChartProps) {
    const { title, variants } = props;

    const [selectedVariant, setSelectedVariant] = useState<TableVariant>(variants[0]);
    const { id: tableId, digits = 2, aggregationMethod, dataAfix = "%" } = selectedVariant;

    const effectiveDigits = digits ?? 0;
    const effectiveDataAfix = dataAfix ?? "";

    const { metadata } = useTableMetadata(tableId);
    const { data, isLoading, isError } = useTableData({
        tableId: tableId,
        startDate: props.startDate,
        endDate: props.endDate,
        identifierId: props.identifierId,
        periodicityId: props.periodicityId,
    } as TableDataParams);

    const filteredData = useMemo<{ name: string, value: number }[]>(() => {
        if (!data || data.length === 0) return [];

        return Object.keys(data[0]).filter(val => val !== "periodStart").map(key => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const sum = data.reduce((sum, val) => sum + (val[key] ?? 0), 0);
            let val = 0;

            if (aggregationMethod === "SUM")
                val = sum;
            else if (aggregationMethod === "AVG")
                val = sum / data.length;

            return {
                name: key,
                value: val
            };
        });
    }, [data, aggregationMethod]);

    const sumData = useMemo(() => filteredData.reduce((sum, val) => sum + val.value, 0), [filteredData]);

    const percentageData = useMemo<{ name: string, value: number, rawValue: number }[]>(() => {
        if (sumData === 0)
            return filteredData.map(item => ({ ...item, rawValue: item.value, value: 0 }));

        return filteredData.map(item => ({
            name: item.name,
            value: (item.value / sumData) * 100,
            rawValue: item.value
        }));
    }, [filteredData, sumData]);

    const allCategories = useMemo(() => {
        if (!data || data.length === 0) return [];
        return Object.keys(data[0]).filter(val => val !== "periodStart");
    }, [data]);

    const chartValueFormatter = useCallback((value: number) =>
        percentValueFormatter(value, 0) + "%", []
    );

    const customPieChartTooltip = useCallback((args: CustomTooltipProps) => (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        <CustomTooltip
            {...args}
            valueFormatter={(value) => {
                return standardValueFormatter(value, effectiveDigits, effectiveDataAfix);
            }}
        />
    ), [percentageData, effectiveDigits, effectiveDataAfix]);

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
                    {allCategories.map((category) => {
                        const percentageValue = percentageData?.find(val => val.name === category)?.value || 0;
                        return (
                            <StatBox
                                className="min-w-[90px]"
                                key={category}
                                label={category}
                                value={percentValueFormatter(percentageValue, 2) + "%"}
                            />
                        );
                    })}
                </div>

                <DonutChart
                    className="h-80 w-full chart"
                    data={percentageData}
                    variant="pie"
                    colors={allCategories.map(cat => getCategoryColorName(allCategories, cat))}
                    valueFormatter={chartValueFormatter}
                    showAnimation={true}
                    animationDuration={500}
                    customTooltip={customPieChartTooltip as (props: CustomTooltipProps) => never}
                    noDataText="Žádná data"
                />
            </DashboardCard.Content>
        </DashboardCard>
    );
}