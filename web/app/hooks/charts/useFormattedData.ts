import { useMemo } from "react";
import { CHART_INDEX_KEY as INDEX_KEY } from "@/app/lib/consts";
import { dateFormatter } from "@/app/lib/utils";
import { ChartDataItem } from "@/app/components/charts/ChartWrapper";

export default function useFormattedData(data: never[]) {
    const formattedData = useMemo(() => {
        if (!data) return [];

        return data.map((item) => {
            const rowTotal = Object.keys(item).reduce((sum, key) => {
                return key !== INDEX_KEY ? sum + (item[key] ?? 0) : sum;
            }, 0);

            return {
                total: rowTotal,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                ...item,
                [INDEX_KEY]: dateFormatter(item[INDEX_KEY]),
            };
        });
    }, [data]);

    const dataWithoutTotal = useMemo(() => {
        if (!formattedData) return [];
        return formattedData.map(({ total, ...rest }) => rest);
    }, [formattedData]);
    
    return { formattedData, dataWithoutTotal };
}