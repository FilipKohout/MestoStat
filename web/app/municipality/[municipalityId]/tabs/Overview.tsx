"use client";

import { TimeChart } from "@/app/components/charts/TimeChart";
import useDateRange from "@/app/hooks/charts/useDateRange";
import usePeriod from "@/app/hooks/charts/usePeriod";
import { useParams } from "next/navigation";
import PieChart from "@/app/components/charts/PieChart";
import { BarChart } from "@/app/components/charts/BarChart";

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
                <TimeChart
                    addTotalCategory
                    summaries={{
                        max: true,
                        average: true,
                        total: false,
                        current: true
                    }}
                    type="area"
                    title="Demografie Obyvatel"
                    variants={[
                        { id: 1, label: "Pohlaví" },
                        { id: 3, label: "Věk" },
                    ]}

                    {...filters}
                />

                <PieChart
                    title="Demografie Obyvatel"
                    variants={[
                        { id: 1, label: "Pohlaví", aggregationMethod: "AVG"},
                        { id: 3, label: "Věk", aggregationMethod: "AVG"},
                    ]}

                    {...filters}
                />

                <TimeChart
                    summaries={{
                        max: true,
                        average: true,
                        total: false,
                        current: true
                    }}
                    type="area"
                    title="Nezaměstnanost"
                    variants={[
                        { id: 4, label: "Procento", digits: 2, dataAfix: "%" },
                        { id: 5, label: "Počet" },
                    ]}

                    {...filters}
                />

                <TimeChart
                    addTotalCategory
                    summaries={{
                        max: true,
                        average: true,
                        total: false,
                        current: true
                    }}
                    type="area"
                    title="Změny Obyvatel"
                    variants={[
                        { id: 6, label: "Historický" },
                    ]}

                    {...filters}
                />

                <TimeChart
                    addTotalCategory={false}
                    stacked
                    type="bar"
                    summaries={{
                        max: false,
                        average: false,
                        total: false,
                        current: false
                    }}
                    title="Změny Obyvatel"
                    variants={[
                        { id: 6, label: "Historický" },
                    ]}

                    {...filters}
                />
            </div>
        </div>
    );
}