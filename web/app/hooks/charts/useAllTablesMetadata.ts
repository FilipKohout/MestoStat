import { useQuery } from "@tanstack/react-query";
import { getAllTablesMetadata } from "@/app/services/charts/tableMetadata";

export default function useAllTablesMetadata() {
    return useQuery({
        queryKey: ["allTablesMetadata"],
        queryFn: async () => getAllTablesMetadata(),
    });
}