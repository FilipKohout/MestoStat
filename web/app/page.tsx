import { AutofillAnimationSearchBar } from "@/components/utils/SearchBar";
import { QueryClient } from "@tanstack/query-core";
import BackgroundGradient from "@/components/utils/BackgroundGradient";
import MunicipalityAdvertisement from "@/components/presets/MunicipalityAdvertisement";
import getSearchData from "@/services/structure/searchData";
import LandingPageSearchBar from "@/components/presets/LandingPageSearchBar";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/utils/LoadingSpinner";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    "use server";

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 relative overflow-hidden">
            <main className="relative max-w-7xl mx-auto px-6">
                <BackgroundGradient />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-top min-h-screen pt-16 pb-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                            Sledujte statistiky<br />
                            <span className="text-blue-500">všech obcí v ČR</span>
                        </h1>

                        <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                            Hospodaření, demografie, rozpočet a investice všech samospráv v české republice na jednom místě.
                        </p>

                        <div className="max-w-sm flex items-center justify-center">
                            <Suspense fallback={<LoadingSpinner className="w-8 h-8" />}>
                                <LandingPageSearchBar />
                            </Suspense>
                        </div>
                    </div>

                    <MunicipalityAdvertisement />
                </div>

                <div className="mt-4 pt-12 flex flex-col items-center gap-8">
                    <h2 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                        Data z otevřených zdrojů
                    </h2>
                    <div className="flex justify-center gap-12 grayscale font-bold text-xl">
                        <a className="opacity-40 text-4xl hover:opacity-100 transition-opacity" href="https://monitor.statnipokladna.gov.cz/">MFČR</a>
                        <a className="opacity-40 text-4xl hover:opacity-100 transition-opacity" href="https://csu.gov.cz/">ČSÚ</a>
                    </div>
                </div>
            </main>
        </div>
    );
}