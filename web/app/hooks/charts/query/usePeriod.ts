'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { DEFAULT_PERIODICITY } from "@/app/lib/consts";

export default function usePeriod() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const period = Number(searchParams.get('period'));

    const setPeriod = useCallback((index: number) => {
        const params = new URLSearchParams(searchParams.toString());

        if (index) params.set('period', String(index));
        else params.delete('period');

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [searchParams, pathname, router]);

    useEffect(() => {
        if (!period)
            setPeriod(DEFAULT_PERIODICITY);
    }, []);

    return { period, setPeriod };
}