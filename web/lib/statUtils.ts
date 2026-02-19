export function getStatsChangePer(current: number, previous: number) {
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
}

export function getSeriesChange(series: never[] | undefined, key: string) {
    if (!series || series.length === 0) return "N/A";

    const current = series[0]?.[key];
    const previous = series[series.length - 1]?.[key];

    if (current == null || previous == null || previous === 0) return "N/A";

    return getStatsChangePer(current, previous);
}
