import { valueFormatter } from "@/app/lib/utils";
import { HEX_COLORS } from "@/app/lib/consts";

interface TooltipProps { payload: Array<{ name: string, value: number, color: string }>, active: boolean, label: string }

export const CustomTooltip = ({ payload, active, label }: TooltipProps) => {
    if (!active || !payload || payload.length === 0) return null;

    const sortedPayload = [...payload].sort((a, b) => b.value - a.value);

    console.log(sortedPayload);
    return (
        <div className="rounded-lg border border-slate-700 bg-slate-900/80 backdrop-blur-xl px-3 py-2 shadow-xl">
            <p className="mb-1 text-xs font-medium text-slate-400">{label}</p>
            <div className="flex flex-col gap-2">
                {sortedPayload.map((category, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span
                                className="h-2.5 w-2.5 rounded-full shadow-sm"
                                style={{
                                    backgroundColor: HEX_COLORS[category.color],
                                    boxShadow: `0 0 6px ${HEX_COLORS[category.color]}`
                                }}
                            />
                            <span className="text-sm font-medium text-slate-300">
                                {category.name}
                            </span>
                        </div>

                        <span className="text-sm font-bold text-white tabular-nums">
                            {valueFormatter(category.value)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};