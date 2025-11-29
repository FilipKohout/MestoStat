import { cnTailwind } from "@/app/lib/utils";
import { Frame } from "@/app/components/utils/Frame";
import Badge from "@/app/components/utils/Badge";

interface StatBoxProps {
    label: string;
    value: string | number;
    trend?: number | null;
    className?: string;
}

export default function StatBox({ label, value, trend, className }: StatBoxProps) {
    const getBadgeVariant = (val: number) => {
        if (val > 0) return "success";
        if (val < 0) return "danger";
        return "neutral";
    };

    return (
        <Frame
            variant="glass"
            noPadding
            className={cnTailwind(
                "flex flex-col items-center justify-center",
                "rounded-lg px-4 py-2",
                className
            )}
        >
            <p className="mb-1 text-xs font-medium text-slate-400 uppercase tracking-wide text-nowrap">
                {label}
            </p>

            <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-slate-100 tabular-nums">
                    {value}
                </span>

                {trend !== undefined && trend !== null && (
                    <Badge
                        variant={getBadgeVariant(trend)}
                        size="sm"
                        className="ml-1 font-bold"
                    >
                        {trend > 0 ? "+" : ""}{trend}%
                    </Badge>
                )}
            </div>
        </Frame>
    );
}