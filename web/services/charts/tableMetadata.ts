import { getAPIUrl } from "@/lib/utils";
import TableMetadata from "@/types/data/tableMetadata";
import { QueryClient } from "@tanstack/query-core";

export async function getAllTablesMetadata() {
    const res = await fetch(getAPIUrl(`stats/definitions/tables`), {
        cache: "default",
        next: { revalidate: 60 * 60 * 24 },
    });

    if (!res.ok)
        throw new Error(res.statusText);

    const data = await res.json();

    if (!data || !data.tables)
        throw new Error("No tables found");

    return Array.from(data.tables) as TableMetadata[];
}

export async function prefetchAllTablesMetadata(queryClient: QueryClient) {
    return await queryClient.prefetchQuery({
        queryKey: ["allTablesMetadata"],
        queryFn: async () => getAllTablesMetadata(),
    });
}