import { useQuery } from "@tanstack/react-query";
import { getTablePeriodicities } from "@/services/charts/tableDefinitions";

export default function useTablePeriodicities() {
    return useQuery({
        queryKey: ["tablePeriodicities"],
        queryFn: async () => getTablePeriodicities(),
    });
}