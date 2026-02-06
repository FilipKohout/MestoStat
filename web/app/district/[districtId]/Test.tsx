"use client";

import Dropdown, { DropdownOption } from "@/app/components/utils/Dropdown";
import DateRangePicker from "@/app/components/utils/DateRange";
import ClientTabsSection from "@/app/components/utils/TabsSection";
import Overview from "@/app/municipality/[municipalityId]/tabs/Overview";
import IntervalIcon from "@/app/components/icons/IntervalIcon";
import useTablePeriodicities from "@/app/hooks/charts/query/useTablePeriodicities";
import { DEFAULT_DATE_RANGE_PRESET_INDEX } from "@/app/lib/consts";
import usePeriod from "@/app/hooks/charts/query/usePeriod";
import Finances from "@/app/municipality/[municipalityId]/tabs/Finances";
import Demographics from "@/app/municipality/[municipalityId]/tabs/Demographics";
import useChartFilters from "@/app/hooks/charts/useChartFilters";
import { ChartWrapper } from "@/app/components/charts/ChartWrapper";
import TimeChart from "@/app/components/charts/wrappedComponents/TimeChart";
import { standardValueFormatter } from "@/app/lib/utils";

export default function Test({ districtId }: { districtId: number }) {
    const filters = useChartFilters();

    return (
        <ChartWrapper title={"Rozdělení obyvatel podle"} showFilters variants={[
            {
                tableId: 1,
                label: "Pohlaví",
                addTotalCategory: true,
                component: props => <TimeChart type="area" summaries={{
                    max: true,
                    average: true,
                    current: true
                }} {...props} />,
                valueFormatter: value => standardValueFormatter(value, 0, "")
            },
        ]} {...filters} identifierId={districtId} structureLevelId={3} />
    );
}