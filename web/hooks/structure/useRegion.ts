import { useQuery } from "@tanstack/react-query";
import { getMunicipality } from "@/services/structure/municipalityStructure";
import { getRegion } from "@/services/structure/regionStructure";

export default function useRegion(regionId: number) {
    return useQuery({
        queryKey: ["region", regionId],
        queryFn: async () => getRegion(regionId),
    });
}