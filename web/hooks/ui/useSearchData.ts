import useMunicipalities from "@/hooks/structure/useMunicipalities";
import useRegions from "@/hooks/structure/useRegions";
import useDistricts from "@/hooks/structure/useDistricts";
import { SearchItem } from "@/components/utils/SearchBar";

export default function useSearchData() {
    const { data: municipalities } = useMunicipalities();
    const { data: districts } = useDistricts();
    const { data: regions } = useRegions();

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

    return { searchData: municipalitiesFormatted.concat(districtsFormatted, regionsFormatted) };
}