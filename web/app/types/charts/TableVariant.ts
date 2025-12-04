export type TableVariant = {
    id: number;
    label: string;
    aggregationMethod?: "SUM" | "AVG";
    dataAfix?: string;
    digits?: number;
}