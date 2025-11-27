import { SparkAreaChart } from "@tremor/react";
import { DashboardCard } from "@/app/components/utils/DashboardCard";

type NumberChartCardProps = {
    label: string;
    val: string | number;
    change: string;
    color: string;
    data: { date: string; val: number }[];
    chartColor: string;
}

export default function NumberChartCard({ label, change, color, data, chartColor, val }: NumberChartCardProps) {
    return (
        <DashboardCard className="flex flex-row items-center justify-between h-24 bg-black/40 backdrop-blur-md border-white/10 hover:bg-black/60 transition-colors pr-6 pl-6">
            <div className="flex flex-col justify-center h-full">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide opacity-90">
                        {label}
                    </span>
                    <span className={`text-xs font-medium ${color} bg-black/30 px-1.5 py-0.5 rounded border border-white/5`}>
                        {change}
                    </span>
                </div>

                <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-white drop-shadow-md">{val}</span>
                </div>
            </div>

            <div className="w-20 h-12 flex items-center justify-end">
                <SparkAreaChart
                    data={data}
                    categories={["val"]}
                    index="date"
                    colors={[chartColor]}
                    className="h-10 w-20"
                    curveType="monotone"
                />
            </div>
        </DashboardCard>
    );
}