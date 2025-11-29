import { getAPIUrl } from "@/app/lib/utils";
import TableMetadata from "@/app/types/data/tableMetadata";
import { QueryClient } from "@tanstack/query-core";
import { PeriodicityDefinition } from "@/app/types/data/periodicityDefinition";

export async function getTablePeriodicities() {
    const res = await fetch(getAPIUrl(`stats/definitions/periodicities`), {
        cache: "default",
        next: { revalidate: 60 * 60 * 24 },
    });

    if (!res.ok)
        throw new Error(res.statusText);

    const data = await res.json();

    if (!data || !data.periodicities)
        throw new Error("No periodicities found");

    return Array.from(data.periodicities) as PeriodicityDefinition[];
}

export async function prefetchTablePeriodicities(queryClient: QueryClient) {
    return await queryClient.prefetchQuery({
        queryKey: ["tablePeriodicities"],
        queryFn: async () => getTablePeriodicities(),
    });
}