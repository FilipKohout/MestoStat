import { useQuery } from "@tanstack/react-query";
import { getTablePeriodicities, getTableStructureLevels } from "@/services/charts/tableDefinitions";

export default function useTableStructureLevels() {
    return useQuery({
        queryKey: ["tableStructureLevels"],
        queryFn: async () => getTableStructureLevels(),
    });
}