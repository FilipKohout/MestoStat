import { cnTailwind, percentValueFormatter } from "@/lib/utils";
import { Frame } from "@/components/utils/Frame";
import Badge from "@/components/utils/Badge";

interface StatBoxProps {
    value: string | number;
    label?: string;
    trend?: number | null;
    className?: string;
    style?: React.CSSProperties;
}

export default function StatBox({ label, value, trend, className, style }: StatBoxProps) {
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
                "flex flex-col items-center justify-center text-nowrap w-fit min-w-max",
                "rounded-lg px-3 py-1.5",
                className
            )}
            style={style}
        >
            {label &&
                <p className="mb-0.5 text-xs font-medium text-slate-400 uppercase tracking-wide text-nowrap">
                    {label}
                </p>
            }

            <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-slate-100 tabular-nums">
                    {value}
                </span>

                {trend !== undefined && trend !== null && (
                    <Badge
                        variant={getBadgeVariant(trend)}
                        size="sm"
                        className="ml-1 font-bold"
                    >
                        {trend > 0 ? "+" : ""}{percentValueFormatter(trend)}%
                    </Badge>
                )}
            </div>
        </Frame>
    );
}