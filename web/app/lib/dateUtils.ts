// app/lib/dateUtils.ts
export const formatDateForInput = (date: Date) => date.toISOString().split('T')[0];

export const getPresetRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    return {
        start: formatDateForInput(start),
        end: formatDateForInput(end)
    };
};

export const prettyDate = (dateString: string) => {
    if(!dateString) return "";
    return new Date(dateString).toLocaleDateString("cs-CZ", { day: "numeric", month: "short" });
}