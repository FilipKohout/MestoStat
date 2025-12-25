"use client";

import Dropdown, { DropdownOption } from "@/app/components/utils/Dropdown";
import DateRangePicker from "@/app/components/utils/DateRange";
import ClientTabsSection from "@/app/components/utils/TabsSection";
import Overview from "@/app/municipality/[municipalityId]/tabs/Overview";
import IntervalIcon from "@/app/components/icons/IntervalIcon";
import useTablePeriodicities from "@/app/hooks/charts/query/useTablePeriodicities";
import { DEFAULT_DATE_RANGE_PRESET_INDEX } from "@/app/lib/consts";
import usePeriod from "@/app/hooks/charts/query/usePeriod";

const tabs = [
    {"label": "Přehled", "component": <Overview />},
    // {"label": "Finance", "component": <Finances />},
    // {"label": "Demografie", "component": <Demographics />},
    // {"label": "Školství", "component": <Education />},
];

export default function MunicipalityPageClient() {
    const { data: periodicities } = useTablePeriodicities();
    const { period, setPeriod } = usePeriod();

    return (
        <>
            <div className="flex justify-end mb-1 gap-2">
                <Dropdown
                    icon={<IntervalIcon className="w-4 h-4 text-slate-400" />}
                    options={periodicities?.sort((a, b) => b.id - a.id).map(p => ({ value: p.id, label: p.name } as DropdownOption)) || []}
                    value={period}
                    onChange={value => setPeriod(Number(value))}
                />

                <DateRangePicker
                    defaultPreset={DEFAULT_DATE_RANGE_PRESET_INDEX}
                />
            </div>

            <ClientTabsSection tabs={tabs} />
        </>
    )
}