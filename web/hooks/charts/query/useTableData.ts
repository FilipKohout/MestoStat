import { useQuery } from "@tanstack/react-query";
import { TableDataParams, getTableData } from "@/services/charts/tableData";

export default function useTableData(params: TableDataParams) {
    return useQuery({
        queryKey: ["chartData", { ...params }],
        queryFn: async () => getTableData(params),
    });
}