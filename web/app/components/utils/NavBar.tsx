import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 gap-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-white shrink-0">
                    <div className="h-5 w-5 rounded bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <span>MěstoStat</span>
                </Link>

                <div className="hidden sm:flex flex-1 max-w-md mx-auto">
                    <div className="relative w-full group">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                            <MagnifyingGlassIcon className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            className="block w-full rounded-full border border-slate-800 bg-slate-900/50 py-1.5 pl-10 pr-3 text-sm text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm sm:leading-6 transition-all"
                            placeholder="Hledat obec, okres, kraj..."
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-400 font-medium shrink-0">
                    <Link href="/rankings" className="hover:text-white transition-colors">Rankings</Link>
                    <Link href="/about" className="hover:text-white transition-colors">About</Link>
                </div>
            </div>
        </nav>
    );
}