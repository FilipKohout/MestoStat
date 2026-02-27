import { getAPIUrl } from "@/lib/utils";
import TableMetadata from "@/types/data/tableMetadata";
import { QueryClient } from "@tanstack/query-core";
import { PeriodicityDefinition } from "@/types/data/periodicityDefinition";
import { StructureLevelDefinition } from "@/types/data/structureLevelDefinition";

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

export async function getTableStructureLevels() {
    const res = await fetch(getAPIUrl(`stats/definitions/structure_levels`), {
        cache: "default",
        next: { revalidate: 60 * 60 * 24 },
    });

    if (!res.ok)
        throw new Error(res.statusText);

    const data = await res.json();

    if (!data || !data.structureLevels)
        throw new Error("No structure levels found");

    return Array.from(data.structureLevels) as StructureLevelDefinition[];
}

export async function prefetchTableStructureLevels(queryClient: QueryClient) {
    return await queryClient.prefetchQuery({
        queryKey: ["tableStructureLevels"],
        queryFn: async () => getTableStructureLevels(),
    });
}