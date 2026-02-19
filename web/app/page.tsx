"use server";

import { AutofillAnimationSearchBar, SearchItem } from "@/components/utils/SearchBar";
import { fetchMunicipalitiesQuery } from "@/services/structure/municipalityStructure";
import { QueryClient } from "@tanstack/query-core";
import BackgroundGradient from "@/components/utils/BackgroundGradient";
import MunicipalityAdvertisement from "@/components/presets/MunicipalityAdvertisement";

export default async function HomePage() {
    const client = new QueryClient();

    const municipalities = await fetchMunicipalitiesQuery(client);

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 relative overflow-hidden">
            <BackgroundGradient />

            <main className="relative max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-top max-h-screen pt-16 pb-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent leading-[1.1]">
                            Sledujte statistiky<br />
                            <span className="text-blue-500">všech obcí v ČR</span>
                        </h1>

                        <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                            Sledujte hospodaření, demografii, rozpočet a investice všech samospráv v české republice na jednom místě.
                        </p>

                        <div className="max-w-sm">
                            <AutofillAnimationSearchBar
                                size="lg"
                                phrases={["Praha", "Brno", "Ostrava", "Plzeň", "Liberec", "České Budějovice", "Hradec Králové"]}
                                typingDelay={100}
                                data={municipalities?.map(mun => ({ id: mun.id, name: mun.name, type: mun.status, location: "Okres " + mun.districtName } as SearchItem)) || []}
                                placeholder="Hledat obec, okres, kraj..."
                            />
                        </div>
                    </div>

                    <div className="relative h-full w-full">
                        <MunicipalityAdvertisement />
                    </div>
                </div>

                <div className="mt-4 pt-12 border-t border-slate-900">
                    <p className="text-center text-sm font-medium text-slate-500 uppercase tracking-widest mb-8">
                        Data čerpáme z otevřených zdrojů
                    </p>
                    <div className="flex justify-center gap-12 grayscale">
                        <a className="font-bold text-xl opacity-40 hover:opacity-100 transition-opacity" href="https://monitor.statnipokladna.gov.cz/">MFČR</a>
                        <a className="font-bold text-xl opacity-40 hover:opacity-100 transition-opacity" href="https://csu.gov.cz/">ČSÚ</a>
                    </div>
                </div>
            </main>
        </div>
    );
}