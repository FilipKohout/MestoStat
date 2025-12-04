import clsx, { type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toFixedNumber } from "@react-stately/utils";
import { CHART_COLOR_PALETTE as COLOR_PALETTE, HEX_COLORS } from "@/app/lib/consts";

export function getAPIUrl(route: string): string {
    if (typeof window === 'undefined')
        return `${process.env.INTERNAL_API_URL}/${route}`;

    return `${process.env.NEXT_PUBLIC_API_URL}/${route}`;
}

export const compactValueFormatter = (value: number | null | undefined, digits: number = 0, dataAfix: string = ""): string => {
    if (value === null || value === undefined) return "–";
    const formatted = new Intl.NumberFormat("cs-CZ", {
        notation: "compact",
        maximumFractionDigits: digits,
    }).format(value);
    return `${formatted}${dataAfix}`;
};

export const standardValueFormatter = (value: number | null | undefined, digits: number = 0, dataAfix: string = ""): string => {
    if (value === null || value === undefined) return "–";
    const formatted = new Intl.NumberFormat("cs-CZ", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
    return `${formatted}${dataAfix}`;
};

export const percentValueFormatter = (value: number | null | undefined, digits: number = 1): string => {
    if (value === null || value === undefined) return "–";
    const formatted = new Intl.NumberFormat("cs-CZ", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
    return formatted;
};

export function dateFormatter(date: string) {
    return new Intl.DateTimeFormat("cs-CZ", { dateStyle: "medium" }).format(new Date(date));
}

export function cnTailwind(...args: ClassValue[]) {
    return twMerge(clsx(...args))
}

export function getCategoryColorName(allCategories: string[], category: string) {
    const index = allCategories.indexOf(category);
    return COLOR_PALETTE[index % COLOR_PALETTE.length];
}

export function getCategoryColorHex(allCategories: string[], category: string) {
    const colorName = getCategoryColorName(allCategories, category);
    return HEX_COLORS[colorName] || "#cbd5e1";
}