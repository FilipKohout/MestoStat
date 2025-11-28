import { useQuery } from "@tanstack/react-query";
import { TableDataParams, getTableData } from "@/app/services/charts/tableData";

export default function useTableData(params: TableDataParams) {
    return useQuery({
        queryKey: ["chartData", { ...params }],
        queryFn: async () => getTableData(params),
    });
}