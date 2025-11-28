import { getAPIUrl } from "@/app/lib/utils";
import UniversalTableData from "@/app/types/data/universalTableData";

export interface TableDataParams {
    tableId: number;
    startDate: Date,
    endDate: Date,
    identifierId: number;
    periodicityId: number;
}

export async function getTableData(params: TableDataParams) {
    const res = await fetch(getAPIUrl(`stats/data/${params.tableId}`), {
        cache: "force-cache",
        next: { revalidate: 60 * 60 * 24 },
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params)
    });

    if (!res.ok)
        throw new Error(res.statusText);

    const data = await res.json();

    if (!data || !data.data)
        throw new Error("No data found");

    return Array.from(data.data) as UniversalTableData[];
}