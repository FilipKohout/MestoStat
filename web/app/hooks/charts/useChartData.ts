import { useQuery } from "@tanstack/react-query";
import { ChartDataParams, getChartData } from "@/app/services/charts/chartData";

export default function useChartData(params: ChartDataParams) {
    return useQuery({
        queryKey: ["chartData", { ...params }],
        queryFn: async () => getChartData(params),
    });
}