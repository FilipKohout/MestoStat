"use client";

import useTablePeriodicities from "@/hooks/charts/query/useTablePeriodicities";
import usePeriod from "@/hooks/charts/query/usePeriod";
import Dropdown, { DropdownOption } from "@/components/utils/Dropdown";
import IntervalIcon from "@/components/icons/IntervalIcon";
import DateRangePicker from "@/components/utils/DateRange";
import { DEFAULT_DATE_RANGE_PRESET_INDEX } from "@/lib/consts";
import TabSection, { tab } from "@/components/utils/TabsSection";
import Button from "@/components/utils/Button";
import { getAPIUrl } from "@/lib/utils";
import DownloadIcon from "@/components/icons/DownloadIcon";
import DownloadStructureButton from "@/components/presets/DownloadStructureButton";
import PowerBIExportStructureButton from "@/components/presets/PowerBIExportStructureButton";
import ExcelExportStructureButton from "@/components/presets/ExcelExportStructureButton";
import BackgroundGradient from "@/components/utils/BackgroundGradient";

type props = { tabs: tab[], identifierId: number, structureLevelId: number }

export default function StatsClientWrapper({ tabs, identifierId, structureLevelId }: props) {
    const { data: periodicities } = useTablePeriodicities();
    const { period, setPeriod } = usePeriod();

    return (
        <>
            <TabSection tabs={tabs} buttons={[
                <DownloadStructureButton key="downloadJSON" identifierId={identifierId} structureLevelId={structureLevelId} />,
                <ExcelExportStructureButton key="downloadEXCEL" identifierId={identifierId} structureLevelId={structureLevelId} />,
                <PowerBIExportStructureButton key="downloadPOWERBI" identifierId={identifierId} structureLevelId={structureLevelId} />,
                <Dropdown key="perdiocity" icon={<IntervalIcon className="w-4 h-4 text-slate-400" />} options={periodicities?.sort((a, b) => b.id - a.id).map(p => ({ value: p.id, label: p.name } as DropdownOption)) || []} value={period} onChange={value => setPeriod(Number(value))}/>,
                <DateRangePicker key="range" defaultPreset={DEFAULT_DATE_RANGE_PRESET_INDEX}/>
            ]} />
        </>
    );
}