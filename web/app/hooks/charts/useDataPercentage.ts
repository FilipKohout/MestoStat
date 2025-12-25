import { useMemo } from "react";
import { ChartDataItem } from "@/app/components/charts/ChartWrapper";

export default function useDataPercentage(data: ChartDataItem[], aggregationMethod: "SUM" | "AVG") {
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
    }, [data]);

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

    return { percentageData };
}