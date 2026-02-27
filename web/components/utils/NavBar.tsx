'use client';

import Link from "next/link";
import SearchBar from "@/components/utils/SearchBar";
import useMunicipalities from "@/hooks/structure/useMunicipalities";
import useSearchData from "@/hooks/ui/useSearchData";

export default function Navbar() {
    const { searchData } = useSearchData();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 gap-4">
                <Link href="/public" className="flex items-center gap-2 font-bold text-white shrink-0">
                    <div className="h-5 w-5 rounded bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <span>/</span>
                </Link>

                <div className="hidden sm:flex flex-1 max-w-md mx-auto">
                    <SearchBar
                        data={searchData}
                        placeholder="Hledat obec, okres, kraj..."
                    />
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-400 font-medium shrink-0">
                    <Link href="/rankings" className="hover:text-white transition-colors">Seřazení Měst</Link>
                    <Link href="/about" className="hover:text-white transition-colors">O Nás</Link>
                </div>
            </div>
        </nav>
    );
}