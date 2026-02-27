import { useQuery } from "@tanstack/react-query";
import { getMunicipalities, getMunicipality } from "@/services/structure/municipalityStructure";
import { getRegions } from "@/services/structure/regionStructure";

export default function useRegions() {
    return useQuery({
        queryKey: ["regions"],
        queryFn: async () => getRegions(),
    });
}