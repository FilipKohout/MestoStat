'use client';

import { Chart } from "@/app/components/charts/Chart";
import useDateRange from "@/app/hooks/charts/useDateRange";
import usePeriod from "@/app/hooks/charts/usePeriod";
import { useParams } from "next/navigation";

export default function Overview() {
    const { startDate, endDate } = useDateRange();
    const { period } = usePeriod();
    const { municipalityId } = useParams<{ municipalityId: string }>();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Chart
                    addTotalCategory
                    summaries={{
                        max: true,
                        average: true,
                        total: false,
                        current: true
                    }}
                    title="Počet Obyvatel"
                    tableId={1}
                    startDate={new Date(startDate || 0)}
                    endDate={new Date(endDate || 0)}
                    identifierId={Number(municipalityId)}
                    periodicityId={period}
                />
            </div>
        </div>
    );
}