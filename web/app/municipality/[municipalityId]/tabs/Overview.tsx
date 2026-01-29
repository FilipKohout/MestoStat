"use client";

import { ChartWrapper } from "@/app/components/charts/ChartWrapper";
import { percentValueFormatter, standardValueFormatter } from "@/app/lib/utils";
import PieChart from "@/app/components/charts/wrappedComponents/PieChart";
import TreeMapChart from "@/app/components/charts/wrappedComponents/TreeMapChart";
import TimeChart from "@/app/components/charts/wrappedComponents/TimeChart";
import useChartFilters from "@/app/hooks/charts/useChartFilters";

export default function Overview() {
    const filters = useChartFilters();

    return (
        <div className="grid grid-cols-1 gap-4">
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

                <ChartWrapper title={`Příjmy`} showFilters variants={[
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
        </div>
    );
}