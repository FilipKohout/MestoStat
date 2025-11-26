export const CustomTooltip = ({ payload, active, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const formatValue = (number: number) =>
        Intl.NumberFormat("cs-CZ").format(number).toString();

    return (
        <div className="rounded-lg border border-slate-700 bg-slate-900/80 backdrop-blur-xl px-3 py-2 shadow-xl">
            <p className="mb-1 text-xs font-medium text-slate-400">{label}</p>
            <div className="flex flex-col gap-1">
                {payload.map((category: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
            <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: category.color }}
            />
                        <span className="text-sm font-bold text-slate-50">
              {formatValue(category.value)}
            </span>
                    </div>
                ))}
            </div>
        </div>
    );
};