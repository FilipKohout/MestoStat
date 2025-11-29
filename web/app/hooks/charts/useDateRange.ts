'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { DATE_RANGE_PRESETS, DEFAULT_DATE_RANGE_PRESET_INDEX, DEFAULT_PERIODICITY } from "@/app/lib/consts";
import { getPresetRange } from "@/app/lib/dateUtils";

export default function useDateRange() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const startDate = searchParams.get('from');
    const endDate = searchParams.get('to');

    const setDateRange = useCallback((start: string | null, end: string | null) => {
        const params = new URLSearchParams(searchParams.toString());

        if (start) params.set('from', start);
        else params.delete('from');

        if (end) params.set('to', end);
        else params.delete('to');

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [searchParams, pathname, router]);

    useEffect(() => {
        if (!startDate || !endDate) {
            const { start, end } = getPresetRange(DATE_RANGE_PRESETS[DEFAULT_DATE_RANGE_PRESET_INDEX].days);
            setDateRange(start, end);
        }
    }, [endDate, setDateRange, startDate]);

    return { startDate, endDate, setDateRange };
}