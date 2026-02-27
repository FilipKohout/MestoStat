"use client";

import useTablePeriodicities from "@/hooks/charts/query/useTablePeriodicities";
import usePeriod from "@/hooks/charts/query/usePeriod";
import Dropdown, { DropdownOption } from "@/components/utils/Dropdown";
import IntervalIcon from "@/components/icons/IntervalIcon";
import DateRangePicker from "@/components/utils/DateRange";
import { DEFAULT_DATE_RANGE_PRESET_INDEX } from "@/lib/consts";
import TabSection, { tab } from "@/components/utils/TabsSection";

export default function StatsClientWrapper({ tabs }: { tabs: tab[] }) {
    const { data: periodicities } = useTablePeriodicities();
    const { period, setPeriod } = usePeriod();

    return (
        <>
            <div className="flex justify-end mb-1 gap-2">
                <Dropdown icon={<IntervalIcon className="w-4 h-4 text-slate-400" />} options={periodicities?.sort((a, b) => b.id - a.id).map(p => ({ value: p.id, label: p.name } as DropdownOption)) || []} value={period} onChange={value => setPeriod(Number(value))}/>
                <DateRangePicker defaultPreset={DEFAULT_DATE_RANGE_PRESET_INDEX}/>
            </div>

            <TabSection tabs={tabs} />
        </>
    );
}