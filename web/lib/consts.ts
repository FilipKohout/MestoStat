export const CHART_COLOR_PALETTE = ["blue", "emerald", "violet", "amber", "fuchsia", "cyan"];
export const CHART_INDEX_KEY = "periodStart";

export const HEX_COLORS: { [key: string]: string } = {
    blue: "#3b82f6",
    cyan: "#06b6d4",
    emerald: "#10b981",
    violet: "#8b5cf6",
    amber: "#f59e0b",
    fuchsia: "#d946ef"
};

export const DEFAULT_PERIODICITY = 4;
export const DEFAULT_DATE_RANGE_PRESET_INDEX = 6;

export const DATE_RANGE_PRESETS = [
    { label: "Posledních 180 dní", days: 180 },
    { label: "Poslední rok", days: 365 },
    { label: "Posledních 5 let", days: 365 * 5 },
    { label: "Posledních 10 let", days: 365 * 10 },
    { label: "Posledních 20 let", days: 365 * 20 },
    { label: "Posledních 30 let", days: 365 * 30 },
    { label: "Posledních 60 let", days: 365 * 60 },
];