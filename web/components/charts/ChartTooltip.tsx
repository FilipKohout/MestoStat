import { HEX_COLORS } from "@/lib/consts";
import { Frame } from "@/components/utils/Frame";

interface TooltipProps {
    payload: Array<{ name: string, value: number, color: string }>,
    active: boolean,
    label: string,
    valueFormatter: (value: number | null | undefined) => string
}

export const CustomTooltip = ({ payload, active, label, valueFormatter }: TooltipProps) => {
    if (!active || !payload || payload.length === 0) return null;

    const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
    const hasTotal = sortedPayload.some(item => item.name === "total");
    const withoutTotal = sortedPayload.filter(item => item.name !== "total");

    if (withoutTotal.length > 1) {
        sortedPayload.push({ name: "", value: 0, color: "gray" });
        sortedPayload.push({ name: "průměr", value: withoutTotal.reduce((sum, item) => sum + item.value, 0) / withoutTotal.length, color: "gray" });

        if (!hasTotal)
            sortedPayload.push({ name: "total", value: withoutTotal.reduce((sum, item) => sum + item.value, 0), color: "gray" });
    }

    return (
        <Frame variant="glass" className="px-3 py-2 rounded-lg min-w-[150px]">
            <p className="mb-1 text-xs font-medium text-slate-400 border-transparent pb-1">{label}</p>
            <div className="flex flex-col gap-1.5">
                {sortedPayload.map((category, idx) => category.name == "" ? <hr key="line" className="w-full border-t border-slate-700/50" /> :
                    <div key={idx} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <span
                                className="h-2.5 w-2.5 rounded-full shadow-sm"
                                style={{
                                    backgroundColor: HEX_COLORS[category.color],
                                    boxShadow: `0 0 6px ${HEX_COLORS[category.color]}`
                                }}
                            />
                            <span className="text-xs font-medium text-slate-300">
                                {category.name == "total" ? "celkem" : category.name}
                            </span>
                        </div>

                        <span className="text-xs font-bold text-white tabular-nums">
                            {valueFormatter(category.value)}
                        </span>
                    </div>
                )}
            </div>
        </Frame>
    );
};