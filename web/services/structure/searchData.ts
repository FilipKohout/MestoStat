import { SearchItem } from "@/components/utils/SearchBar";
import { fetchDistrictsQuery } from "@/services/structure/districtStructure";
import { fetchMunicipalitiesQuery } from "@/services/structure/municipalityStructure";
import { fetchRegionsQuery } from "@/services/structure/regionStructure";
import { QueryClient } from "@tanstack/query-core";

export default async function getSearchData(client: QueryClient) {
    const municipalities = await fetchMunicipalitiesQuery(client);
    const districts = await fetchDistrictsQuery(client);
    const regions = await fetchRegionsQuery(client);

    const municipalitiesFormatted = municipalities?.map(mun => ({
        id: mun.id,
        name: mun.name,
        type: mun.status,
        path: "/municipality/" + mun.id,
        location: "Okres " + mun.districtName
    } as SearchItem)) || [];

    const districtsFormatted = districts?.map(dist => ({
        id: dist.id,
        name: dist.name,
        type: "Okres",
        path: "/district/" + dist.id,
        location: dist.regionName
    } as SearchItem)) || [];

    const regionsFormatted = regions?.map(reg => ({
        id: reg.id,
        name: reg.name,
        path: "/region/" + reg.id,
        type: "Kraj",
    } as SearchItem)) || [];

    return municipalitiesFormatted.concat(districtsFormatted, regionsFormatted);
}