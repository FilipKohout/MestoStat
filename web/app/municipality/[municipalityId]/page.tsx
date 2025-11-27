import ClientTabsSection from "@/app/municipality/[municipalityId]/TabsSection";
import { fetchQuickMunicipalityDataQuery, } from "@/app/services/charts/quickMunicipalityData";
import { fetchMunicipalityQuery } from "@/app/services/structure/municipalityStructure";
import { notFound } from "next/navigation";
import NumberChartCard from "@/app/components/charts/NumberChartCard";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate, QueryClient } from "@tanstack/query-core";

export default async function MunicipalityPage({ params }: { params: Promise<{ municipalityId: number }> }) {
    const { municipalityId } = await params;

    const client = new QueryClient();

    const municipality = await fetchMunicipalityQuery(client, municipalityId);

    if (!municipality)
        notFound();

    const quickData = await fetchQuickMunicipalityDataQuery(client, municipalityId);

    if (!quickData)
        notFound();

    const getStatsChangePer = (current: number, previous: number) => {
        const change = ((current - previous) / previous) * 100;
        return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
    }

    const populationChange = getStatsChangePer(quickData.population[0].totalPopulation, quickData.population[1].totalPopulation);
    const stats = [
        {
            label: "Obyvatelé",
            val: quickData.population[0].totalPopulation.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "),
            change: populationChange,
            color: populationChange.includes("+") ? "text-blue-300" : "text-rose-300",
            chartColor: "blue",
            data: quickData.population.map(item => ({ date: item.startPeriod, val: item.totalPopulation })).slice(0, 10),
        },
        { label: "Rozpočet", val: "3.4 M", change: "+5.2%", color: "text-cyan-300", chartColor: "cyan", data: [{ date: "1", val: 10 }, { date: "5", val: 40 }] },
        { label: "Výdaje", val: "2.1 M", change: "-1.2%", color: "text-rose-300", chartColor: "rose", data: [{ date: "1", val: 80 }, { date: "5", val: 30 }] },
        { label: "Projekty", val: "12", change: "Aktivní", color: "text-emerald-300", chartColor: "emerald", data: [{ date: "1", val: 10 }, { date: "5", val: 90 }] },
    ]

    console.log(municipality, municipality.name);

    return (
        <div className="min-h-screen pb-10">
            <div className="relative h-[500px] w-full border-slate-800">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=2500&auto=format&fit=crop"
                        alt={`Foto obce ${municipality.name}`}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                <div className="absolute bottom-0 w-full left-0 right-0">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-8">
                        <div className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-900/50">
                                        {municipality.status}
                                    </span>
                                </div>
                                <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-xl">
                                    {municipality.name}
                                </h1>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                                {stats.map((item, i: number) => <NumberChartCard key={i} {...item} />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-4 sm:px-6">
                <HydrationBoundary state={dehydrate(client)} >
                    <ClientTabsSection />
                </HydrationBoundary>
            </main>
        </div>
    );
}