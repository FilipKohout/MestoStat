import { useQuery } from "@tanstack/react-query";
import { getQuickMunicipalityData } from "@/app/services/charts/quickMunicipalityData";

export default function useQuickMunicipalityData(municipalityId: number) {
    return useQuery({
        queryKey: ["quickMunicipalityData", municipalityId],
        queryFn: async () => getQuickMunicipalityData(municipalityId),
    });
}