import { useQuery } from "@tanstack/react-query";
import { getMunicipalities, getMunicipality } from "@/app/services/structure/municipalityStructure";

export default function useMunicipalities() {
    return useQuery({
        queryKey: ["municipalities"],
        queryFn: async () => getMunicipalities(),
    });
}