import { getAPIUrl } from "@/lib/utils";
import { QueryClient } from "@tanstack/query-core";
import Municipality from "@/types/structure/municipality";
import Region from "@/types/structure/region";

export async function getRegions() {
    const res = await fetch(getAPIUrl(`structure/regions`));

    if (!res.ok)
        throw new Error(res.statusText);

    const data = await res.json();

    if (!data || !data.regions)
        throw new Error("No regions found");

    return data.regions as Region[];
}

export async function fetchRegionsQuery(queryClient: QueryClient) {
    return await queryClient.fetchQuery({
        queryKey: ["regions"],
        queryFn: async () => getRegions(),
    });
}

export async function getRegion(regionId: number) {
    console.log(getAPIUrl(`structure/regions/${regionId}`));

    const res = await fetch(getAPIUrl(`structure/regions/${regionId}`));

    if (!res.ok)
        throw new Error(res.statusText);

    const data = await res.json();

    if (!data || !data.regions)
        throw new Error("No regions found");

    return data.regions as Region;
}

export async function fetchRegionQuery(queryClient: QueryClient, regionId: number) {
    return await queryClient.fetchQuery({
        queryKey: ["region", regionId],
        queryFn: async () => getRegion(regionId),
    });
}