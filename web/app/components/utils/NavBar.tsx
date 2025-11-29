'use client';

import Link from "next/link";
import SearchBar, { SearchItem } from "@/app/components/utils/SearchBar";
import useMunicipalities from "@/app/hooks/structure/useMunicipalities";

export default function Navbar() {
    const { data: municipalities } = useMunicipalities();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 gap-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-white shrink-0">
                    <div className="h-5 w-5 rounded bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <span>MěstoStat</span>
                </Link>

                <div className="hidden sm:flex flex-1 max-w-md mx-auto">
                    <SearchBar
                        data={municipalities?.map(mun => ({ id: mun.id, name: mun.name, type: "obec" } as SearchItem)) || []}
                        placeholder="Hledat obec, okres, kraj..."
                    />
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-400 font-medium shrink-0">
                    <Link href="/rankings" className="hover:text-white transition-colors">Rankings</Link>
                    <Link href="/about" className="hover:text-white transition-colors">About</Link>
                </div>
            </div>
        </nav>
    );
}