import { fetchQuickMunicipalityDataQuery, } from "@/app/services/charts/quickMunicipalityData";
import { fetchMunicipalityQuery } from "@/app/services/structure/municipalityStructure";
import { notFound } from "next/navigation";
import NumberChartCard from "@/app/components/charts/NumberChartCard";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import { prefetchAllTablesMetadata } from "@/app/services/charts/tableMetadata";
import Badge from "@/app/components/utils/Badge";
import MunicipalityPageClient from "@/app/municipality/[municipalityId]/MunicipalityPageClient";
import { prefetchTablePeriodicities } from "@/app/services/charts/tableDefinitions";
import { standardValueFormatter } from "@/app/lib/utils";

export default async function MunicipalityPage({ params }: { params: Promise<{ municipalityId: number }> }) {
    const { municipalityId } = await params;

    const client = new QueryClient();

    const municipality = await fetchMunicipalityQuery(client, municipalityId);

    if (!municipality)
        notFound();

    const quickData = await fetchQuickMunicipalityDataQuery(client, municipalityId);

    if (!quickData)
        notFound();

    await prefetchAllTablesMetadata(client);
    await prefetchTablePeriodicities(client);

    const getStatsChangePer = (current: number, previous: number) => {
        const change = ((current - previous) / previous) * 100;
        return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
    }

    const getSeriesChange = (series: never[] | undefined, key: string) => {
        if (!series || series.length === 0) return "N/A";

        const current = series[0]?.[key];
        const previous = series[series.length - 1]?.[key];

        if (current == null || previous == null || previous === 0) return "N/A";

        return getStatsChangePer(current, previous);
    }

    const populationChange = getSeriesChange(quickData.population as never[], "totalPopulation");
    const budgetChange = getSeriesChange(quickData.budget as never[], "totalBudget");

    const stats = [
        {
            label: "Obyvatelé",
            val: standardValueFormatter(quickData?.population?.[0]?.totalPopulation) || "-",
            change: populationChange,
            color: populationChange.includes("+") ? "text-blue-300" : "text-rose-300",
            chartColor: "blue",
            data: quickData.population.map(item => ({ date: item.startPeriod, val: item.totalPopulation })).reverse().slice(0, 10),
        },
        {
            label: "Rozpočet",
            val: standardValueFormatter(quickData?.budget?.[0]?.totalBudget) || "-",
            change: budgetChange,
            color: budgetChange.includes("+") ? "text-blue-300" : "text-rose-300",
            chartColor: "cyan",
            data: quickData.budget.map(item => ({ date: item.startPeriod, val: item.totalBudget })).reverse().slice(0, 10),
        },
    ]

    return (
        <div className="min-h-screen pb-10">
            <div className="relative h-[500px] w-full border-slate-800">
                <div className="absolute inset-0">
                    <img
                        src={municipality.imageURL || "https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=2500&auto=format&fit=crop"}
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
                                    <Badge variant="primary" size="md">
                                        {municipality.status}
                                    </Badge>
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
                <HydrationBoundary state={dehydrate(client)}>
                    <MunicipalityPageClient />
                </HydrationBoundary>
            </main>
        </div>
    );
}