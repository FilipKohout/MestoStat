import { SparkAreaChart } from "@tremor/react";
import { DashboardCard } from "@/app/components/utils/DashboardCard";
import { cnTailwind } from "@/app/lib/utils";
import Badge from "@/app/components/utils/Badge";

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
        <DashboardCard
            variant="black-glass"

            className={cnTailwind(
                "flex-row items-center justify-between h-24 p-0 px-6",
                "hover:bg-slate-800/50 hover:border-slate-700 transition-all cursor-default group"
            )}
        >
            <div className="flex flex-col justify-center h-full gap-1">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {label}
                    </span>

                    <Badge
                        variant="glass"
                        size="sm"
                        className={cnTailwind("font-bold border-white/5", color)}
                    >
                        {change}
                    </Badge>
                </div>

                <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-white tracking-tight tabular-nums">
                        {val}
                    </span>
                </div>
            </div>

            <div className="h-12 w-24 flex items-center justify-end opacity-80 group-hover:opacity-100 transition-opacity">
                <SparkAreaChart
                    data={data}
                    categories={["val"]}
                    index="date"
                    colors={[chartColor]}
                    className="h-10 w-24 chart"
                    curveType="monotone"
                    noDataText="Žádná data"
                />
            </div>
        </DashboardCard>
    );
}