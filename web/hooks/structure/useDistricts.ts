import { useQuery } from "@tanstack/react-query";
import { getMunicipalities, getMunicipality } from "@/services/structure/municipalityStructure";
import { getDistricts } from "@/services/structure/districtStructure";

export default function useDistricts() {
    return useQuery({
        queryKey: ["districts"],
        queryFn: async () => getDistricts(),
    });
}