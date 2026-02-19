import { useMemo, useCallback } from "react";
import { ChartDataItem } from "@/components/charts/ChartWrapper";

export default function useSummaries(data: ChartDataItem[], valueFormatter: (value: number) => string) {
    const totalsOnly = useMemo(() => {
        if (!data || data.length === 0) return [];
        return data
            .map(item => item.total)
            .filter((val): val is number => typeof val === "number");
    }, [data]);

    const calculateSummary = useCallback((
        summaryFunction: (values: number[]) => number,
        defaultValue: string = '–'
    ) => {
        if (totalsOnly.length === 0) return defaultValue;
        const result = summaryFunction(totalsOnly);
        return [valueFormatter(result), result];
    }, [totalsOnly, valueFormatter]);

    const currentSummary = useMemo(() => {
        const lastValue = totalsOnly.length > 0 ? totalsOnly[totalsOnly.length - 1] : null;
        const firstValue = totalsOnly.length > 0 ? totalsOnly[0] : null;

        let changeOverPeriod: number | null = null;

        if (lastValue !== null && firstValue !== null) {
            if (firstValue !== 0) {
                changeOverPeriod = (lastValue - firstValue) / firstValue * 100;
            } else if (lastValue !== 0) {
                changeOverPeriod = 100;
            } else {
                changeOverPeriod = 0;
            }
        }

        return {
            value: lastValue !== null ? valueFormatter(lastValue) : '–',
            trend: changeOverPeriod,
        };
    }, [totalsOnly, valueFormatter]);

    const averageValue = useMemo(() => calculateSummary(
        (values) => values.reduce((sum, val) => sum + val, 0) / values.length
    ), [calculateSummary]);

    const totalValue = useMemo(() => calculateSummary(
        (values) => values.reduce((sum, val) => sum + val, 0)
    ), [calculateSummary]);

    const maxValue = useMemo(() => calculateSummary(
        (values) => Math.max(...values)
    ), [calculateSummary]);

    return {
        averageValue: averageValue[0],
        totalValue: totalValue[0],
        currentSummary,
        maxValue: maxValue[0],
        maxValueNumber: maxValue[1]
    };
}