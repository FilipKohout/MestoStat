"use client";

import useDateRange from "@/app/hooks/charts/useDateRange";
import usePeriod from "@/app/hooks/charts/query/usePeriod";
import { useParams } from "next/navigation";
import { ChartWrapper } from "@/app/components/charts/ChartWrapper";
import { percentValueFormatter, standardValueFormatter } from "@/app/lib/utils";
import PieChart from "@/app/components/charts/wrappedComponents/PieChart";
import TreeMapChart from "@/app/components/charts/wrappedComponents/TreeMapChart";
import TimeChart from "@/app/components/charts/wrappedComponents/TimeChart";
import TableChart from "@/app/components/charts/wrappedComponents/TableChart";

export default function Overview() {
    const { startDate, endDate } = useDateRange();
    const { period } = usePeriod();
    const { municipalityId } = useParams<{ municipalityId: string }>();

    const filters = {
        startDate: new Date(startDate || 0),
        endDate: new Date(endDate || 0),
        identifierId: Number(municipalityId),
        periodicityId: period
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {
                        tableId: 3,
                        label: "Věku",
                        addTotalCategory: true,
                        component: props => <TimeChart type="area" summaries={{
                            max: true,
                            average: true,
                            current: true
                        }} {...props} />,
                        valueFormatter: value => standardValueFormatter(value, 0, "")
                    },
                ]} {...filters} />

                <ChartWrapper title={"Rozdělení obyvatel podle"} showFilters variants={[
                    {
                        tableId: 1,
                        label: "Pohlaví",
                        component: props => <PieChart type="pie" aggregation="ACT" {...props} />,
                        valueFormatter: value => percentValueFormatter(value, 2) + "%"
                    },
                    {
                        tableId: 3,
                        label: "Věku",
                        component: props => <PieChart type="pie" aggregation="ACT" {...props} />,
                        valueFormatter: value => percentValueFormatter(value, 2) + "%"
                    },
                ]} {...filters} />

                <ChartWrapper title={"Nezaměstnanost"} showFilters variants={[
                    {
                        tableId: 6,
                        label: "Procento",
                        component: props => <TimeChart type="area" summaries={{
                            max: true,
                            average: true,
                            current: true
                        }} {...props} />,
                        valueFormatter: value => percentValueFormatter(value, 2) + "%"
                    },
                    {
                        tableId: 7,
                        label: "Počet",
                        component: props => <TimeChart type="area" summaries={{
                            max: true,
                            average: true,
                            current: true
                        }} {...props} />,
                        valueFormatter: value => standardValueFormatter(value, 0, "")
                    },
                ]} {...filters} />

                <ChartWrapper title={"Obyvatelstvo Historicky"} showFilters variants={[
                    {
                        tableId: 4,
                        label: "",
                        addTotalCategory: true,
                        component: props => <TimeChart type="area" summaries={{
                            max: true,
                            average: true,
                            current: true
                        }} {...props} />,
                        valueFormatter: value => standardValueFormatter(value, 0, "")
                    },
                ]} {...filters} />

                <ChartWrapper title={"Změny Obyvatel"} showFilters variants={[
                    {
                        tableId: 5,
                        label: "",
                        component: props => <TimeChart type="bar" stacked={true} {...props} />,
                        valueFormatter: value => standardValueFormatter(value, 0, "")
                    },
                ]} {...filters} />
            </div>

            <ChartWrapper title={`Výdaje ${filters.endDate.getFullYear() - 1}`} showFilters className="row-span-2" variants={[
                {
                    tableId: 8,
                    label: "",
                    component: props => <TreeMapChart aggregation="AVG" {...props} />,
                    valueFormatter: value => standardValueFormatter(value, 0, " Kč")
                },
            ]} {...filters} periodicityId={4} />

            <ChartWrapper title={`Výdaje ${filters.endDate.getFullYear() - 1}`} showFilters={false} className="row-span-2" variants={[
                {
                    tableId: 8,
                    label: "",
                    component: props => <TableChart {...props} />,
                    valueFormatter: value => standardValueFormatter(value, 0, " Kč")
                },
            ]} {...filters} periodicityId={4} />
        </div>
    );
}