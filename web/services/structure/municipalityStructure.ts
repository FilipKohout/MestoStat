import { getAPIUrl } from "@/lib/utils";
import { QueryClient } from "@tanstack/query-core";
import Municipality from "@/types/structure/municipality";

export async function getMunicipalities() {
    const res = await fetch(getAPIUrl(`structure/municipalities`));

    if (!res.ok)
        throw new Error(res.statusText);

    const data = await res.json();

    if (!data || !data.municipalities)
        throw new Error("No municipalities found");

    return data.municipalities as Municipality[];
}

export async function fetchMunicipalitiesQuery(queryClient: QueryClient) {
    return await queryClient.fetchQuery({
        queryKey: ["municipalities"],
        queryFn: async () => getMunicipalities(),
    });
}

export async function getMunicipality(municipalityId: number) {
    console.log(getAPIUrl(`structure/municipalities/${municipalityId}`));

    const res = await fetch(getAPIUrl(`structure/municipalities/${municipalityId}`));

    if (!res.ok)
        throw new Error(res.statusText);

    const data = await res.json();

    if (!data || !data.municipality)
        throw new Error("No municipalities found");

    return data.municipality as Municipality;
}

export async function fetchMunicipalityQuery(queryClient: QueryClient, municipalityId: number) {
    return await queryClient.fetchQuery({
        queryKey: ["municipality", municipalityId],
        queryFn: async () => getMunicipality(municipalityId),
    });
}