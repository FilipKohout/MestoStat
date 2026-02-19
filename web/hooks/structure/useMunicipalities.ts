import { useQuery } from "@tanstack/react-query";
import { getMunicipalities, getMunicipality } from "@/services/structure/municipalityStructure";

export default function useMunicipalities() {
    return useQuery({
        queryKey: ["municipalities"],
        queryFn: async () => getMunicipalities(),
    });
}