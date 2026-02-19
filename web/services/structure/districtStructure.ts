import { getAPIUrl } from "@/lib/utils";
import { QueryClient } from "@tanstack/query-core";
import Municipality from "@/types/structure/municipality";
import District from "@/types/structure/district";

export async function getDistricts() {
    const res = await fetch(getAPIUrl(`structure/districts`));

    if (!res.ok)
        throw new Error(res.statusText);

    const data = await res.json();

    if (!data || !data.districts)
        throw new Error("No districts found");

    return data.districts as District[];
}

export async function fetchDistrictsQuery(queryClient: QueryClient) {
    return await queryClient.fetchQuery({
        queryKey: ["districts"],
        queryFn: async () => getDistricts(),
    });
}

export async function getDistrict(districtId: number) {
    console.log(getAPIUrl(`structure/districts/${districtId}`));

    const res = await fetch(getAPIUrl(`structure/districts/${districtId}`));

    if (!res.ok)
        throw new Error(res.statusText);

    const data = await res.json();

    if (!data || !data.district)
        throw new Error("No districts found");

    return data.district as District;
}

export async function fetchDistrictQuery(queryClient: QueryClient, districtId: number) {
    return await queryClient.fetchQuery({
        queryKey: ["districts", districtId],
        queryFn: async () => getDistrict(districtId),
    });
}