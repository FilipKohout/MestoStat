'use client';

import useChartFilters from "@/app/hooks/charts/useChartFilters";
import { ChartWrapper } from "@/app/components/charts/ChartWrapper";
import TimeChart from "@/app/components/charts/wrappedComponents/TimeChart";
import { standardValueFormatter } from "@/app/lib/utils";
import TreeMapChart from "@/app/components/charts/wrappedComponents/TreeMapChart";
import TableChart from "@/app/components/charts/wrappedComponents/TableChart";

export default function Finances() {
    const filters = useChartFilters();

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ChartWrapper title={`Výdaje`} showFilters variants={[
                    {
                        tableId: 9,
                        label: "",
                        component: props => <TimeChart type="bar" stacked={true} {...props} summaries={{
                            max: true,
                            average: true,
                            current: true,
                        }} />,
                        valueFormatter: value => standardValueFormatter(value, 0, " Kč")
                    },
                ]} {...filters} />

                <ChartWrapper title={`Příjmy`} showFilters  variants={[
                    {
                        tableId: 10,
                        label: "",
                        component: props => <TimeChart type="bar" stacked={true} {...props} summaries={{
                            max: true,
                            average: true,
                            current: true,
                        }} />,
                        valueFormatter: value => standardValueFormatter(value, 0, " Kč")
                    },
                ]} {...filters} />
            </div>

            <ChartWrapper title={`Výdaje`} showFilters className="row-span-2" variants={[
                {
                    tableId: 9,
                    label: "Rok %year",
                    component: props => <TreeMapChart lastPeriod aggregation="AVG" {...props} />,
                    valueFormatter: value => standardValueFormatter(value, 0, " Kč")
                },
                {
                    tableId: 9,
                    label: "Celé vybrané období",
                    component: props => <TreeMapChart aggregation="SUM" {...props} />,
                    valueFormatter: value => standardValueFormatter(value, 0, " Kč")
                },
            ]} {...filters} periodicityId={4} />

            <ChartWrapper title={`Výdaje`} showFilters={false} className="row-span-2" variants={[
                {
                    tableId: 8,
                    label: "Rok %year",
                    component: props => <TableChart lastPeriod {...props} />,
                    valueFormatter: value => standardValueFormatter(value, 0, " Kč")
                },
                {
                    tableId: 8,
                    label: "Celé vybrané období",
                    component: props => <TableChart {...props} />,
                    valueFormatter: value => standardValueFormatter(value, 0, " Kč")
                },
            ]} {...filters} periodicityId={4} />

            <ChartWrapper title={`Příjmy`} showFilters className="row-span-2" variants={[
                {
                    tableId: 10,
                    label: "Rok %year",
                    component: props => <TreeMapChart lastPeriod aggregation="AVG" {...props} />,
                    valueFormatter: value => standardValueFormatter(value, 0, " Kč")
                },
                {
                    tableId: 10,
                    label: "Celé vybrané období",
                    component: props => <TreeMapChart aggregation="SUM" {...props} />,
                    valueFormatter: value => standardValueFormatter(value, 0, " Kč")
                },
            ]} {...filters} periodicityId={4} />

            <ChartWrapper title={`Příjmy`} showFilters={false} className="row-span-2" variants={[
                {
                    tableId: 10,
                    label: "Rok %year",
                    component: props => <TableChart lastPeriod {...props} />,
                    valueFormatter: value => standardValueFormatter(value, 0, " Kč")
                },
                {
                    tableId: 10,
                    label: "Celé vybrané období",
                    component: props => <TableChart {...props} />,
                    valueFormatter: value => standardValueFormatter(value, 0, " Kč")
                },
            ]} {...filters} periodicityId={4} />
        </>
    );
}