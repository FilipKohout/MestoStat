import useDateRange from "@/hooks/charts/useDateRange";
import usePeriod from "@/hooks/charts/query/usePeriod";
import { useParams } from "next/navigation";

export default function useChartFilters() {
    const { startDate, endDate } = useDateRange();
    const { period } = usePeriod();
    const { municipalityId } = useParams<{ municipalityId: string }>();

    return {
        startDate: new Date(startDate || 0),
        endDate: new Date(endDate || 0),
        identifierId: Number(municipalityId),
        periodicityId: period,
        structureLevelId: 4,
    };
}