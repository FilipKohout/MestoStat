import clsx, { type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toFixedNumber } from "@react-stately/utils";

export function getAPIUrl(route: string): string {
    if (typeof window === 'undefined')
        return `${process.env.INTERNAL_API_URL}/${route}`;

    return `${process.env.NEXT_PUBLIC_API_URL}/${route}`;
}

export function compactValueFormatter(number: number) {
    return Intl.NumberFormat("cs-CZ", { notation: "compact" }).format(number).toString();
}

export function standardValueFormatter(number: number) {
    return Intl.NumberFormat("cs-CZ", { notation: "standard" }).format(toFixedNumber(number, 0)).toString();
}

export function dateFormatter(date: string) {
    return new Intl.DateTimeFormat("cs-CZ", { dateStyle: "medium" }).format(new Date(date));
}

export function cnTailwind(...args: ClassValue[]) {
    return twMerge(clsx(...args))
}