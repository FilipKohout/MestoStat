import { getDistrict } from "@/services/structure/districtStructure";

import { useQuery } from "@tanstack/react-query";
import { getMunicipality } from "@/services/structure/municipalityStructure";

export default function useDistrict(districtId: number) {
    return useQuery({
        queryKey: ["district", districtId],
        queryFn: async () => getDistrict(districtId),
    });
}