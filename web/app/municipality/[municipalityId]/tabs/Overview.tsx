"use client";

import useDateRange from "@/app/hooks/charts/useDateRange";
import usePeriod from "@/app/hooks/charts/query/usePeriod";
import { useParams } from "next/navigation";
import { ChartWrapper } from "@/app/components/charts/ChartWrapper";
import { percentValueFormatter, standardValueFormatter } from "@/app/lib/utils";
import TimeChart from "@/app/components/charts/wrappedComponents/TimeChart";
import PieChart from "@/app/components/charts/wrappedComponents/PieChart";
import { Treemap } from "recharts";

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

    const data: Tree = {
        type: 'node',
        name: "boss",
        value: 0,
        children: [
            {type: 'leaf', name:"Mark", value: 90},
            {type: 'leaf', name:"Robert", value: 12},
            {type: 'leaf', name:"Emily", value: 34},
            {type: 'leaf', name:"Marion", value: 53},
            {type: 'leaf', name:"Nicolas", value: 98},
            {type: 'leaf', name:"Malki", value: 22},
            {type: 'leaf', name:"Djé", value: 12},
            {type: 'leaf', name:"Mélanie", value: 45},
            {type: 'leaf', name:"Einstein", value: 76}]
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ChartWrapper title={"Rozdělení obyvatel podle"} variants={[
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

                <ChartWrapper title={"Rozdělení obyvatel podle"} variants={[
                    {
                        tableId: 1,
                        label: "Pohlaví",
                        component: props => <PieChart type="pie" aggregation="AVG" {...props} />,
                        valueFormatter: value => percentValueFormatter(value, 2) + "%"
                    },
                    {
                        tableId: 3,
                        label: "Věku",
                        component: props => <PieChart type="pie" aggregation="AVG" {...props} />,
                        valueFormatter: value => percentValueFormatter(value, 2) + "%"
                    },
                ]} {...filters} />

                <ChartWrapper title={"Nezaměstnanost"} variants={[
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

                <ChartWrapper title={"Obyvatelstvo Historicky"} variants={[
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

                <ChartWrapper title={"Změny Obyvatel"} variants={[
                    {
                        tableId: 5,
                        label: "",
                        component: props => <TimeChart type="bar" stacked={true} {...props} />,
                        valueFormatter: value => standardValueFormatter(value, 0, "")
                    },
                ]} {...filters} />

                <ChartWrapper title={"Rozdělení obyvatel podle"} variants={[
                    {
                        tableId: 3,
                        label: "Věku",
                        component: props => <Treemap aggregation="AVG" {...props} />,
                        valueFormatter: value => percentValueFormatter(value, 2) + "%"
                    },
                ]} {...filters} />
            </div>
        </div>
    );
}