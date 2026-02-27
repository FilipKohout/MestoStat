import useDateRange from "@/hooks/charts/useDateRange";
import usePeriod from "@/hooks/charts/query/usePeriod";
import { useParams } from "next/navigation";
import useTableStructureLevels from "@/hooks/charts/query/useTableStructureLevels";

export default function useChartFilters() {
    const { startDate, endDate } = useDateRange();
    const { period } = usePeriod();
    const { municipalityId, districtId, regionId } = useParams<{ municipalityId: string, districtId: string, regionId: string }>();
    const { data: structureLevels } = useTableStructureLevels();

    let identifierId = 0;
    let structureLevelId = 4;

    if (municipalityId) {
        identifierId = Number(municipalityId);
        structureLevelId = structureLevels?.find(level => level.indentifierName === "municipality_id")?.id || 4;
    }
    else if (districtId) {
        identifierId = Number(districtId);
        structureLevelId = structureLevels?.find(level => level.indentifierName === "district_id")?.id || 4;
    }
    else if (regionId) {
        identifierId = Number(regionId);
        structureLevelId = structureLevels?.find(level => level.indentifierName === "region_id")?.id || 4;
    }

    return {
        startDate: new Date(startDate || 0),
        endDate: new Date(endDate || 0),
        identifierId: identifierId,
        periodicityId: period,
        structureLevelId: structureLevelId,
    };
}