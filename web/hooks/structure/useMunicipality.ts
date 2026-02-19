import { useQuery } from "@tanstack/react-query";
import { getMunicipality } from "@/services/structure/municipalityStructure";

export default function useMunicipality(municipalityId: number) {
    return useQuery({
        queryKey: ["municipality", municipalityId],
        queryFn: async () => getMunicipality(municipalityId),
    });
}