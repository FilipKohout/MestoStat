import { getAPIUrl } from "@/app/lib/utils";
import { QueryClient } from "@tanstack/query-core";
import QuickMunicipalityData from "@/app/types/data/quickMunicipalityData";

export async function getQuickMunicipalityData(municipalityId: number) {
    const res = await fetch(getAPIUrl(`stats/data/municipality/${municipalityId}`), {
        cache: "force-cache",
        next: { revalidate: 60 * 60 * 24 },
    });

    if (!res.ok)
        throw new Error(res.statusText);

    const data = await res.json();

    if (!data || !data.population)
        throw new Error("No quick data found");

    return data as QuickMunicipalityData;
}

export async function fetchQuickMunicipalityDataQuery(queryClient: QueryClient, municipalityId: number) {
    return await queryClient.fetchQuery({
        queryKey: ["quickMunicipalityData", municipalityId],
        queryFn: async () => getQuickMunicipalityData(municipalityId),
    });
}