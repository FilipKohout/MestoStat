"use client";

import { AreaChart } from "@/app/components/charts/AreaChart";
import useDateRange from "@/app/hooks/charts/useDateRange";
import usePeriod from "@/app/hooks/charts/usePeriod";
import { useParams } from "next/navigation";
import PieChart from "@/app/components/charts/PieChart";

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
                <AreaChart
                    addTotalCategory
                    summaries={{
                        max: true,
                        average: true,
                        total: false,
                        current: true
                    }}
                    title="Počet Obyvatel"
                    variants={[
                        { id: 1, label: "Pohlaví" },
                        { id: 3, label: "Věk" },
                    ]}

                    {...filters}
                />

                <PieChart
                    title="Struktura Obyvatel"
                    variants={[
                        { id: 1, label: "Pohlaví", aggregationMethod: "AVG" },
                        { id: 3, label: "Věk", aggregationMethod: "AVG" },
                    ]}

                    {...filters}
                />
            </div>
        </div>
    );
}