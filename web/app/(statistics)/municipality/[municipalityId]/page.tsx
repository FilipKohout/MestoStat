import { fetchQuickMunicipalityDataQuery, } from "@/services/charts/quickMunicipalityData";
import { fetchMunicipalityQuery } from "@/services/structure/municipalityStructure";
import { notFound } from "next/navigation";
import NumberChartCard from "@/components/charts/NumberChartCard";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import Badge from "@/components/utils/Badge";
import { compactValueFormatter, standardValueFormatter } from "@/lib/utils";
import { getSeriesChange } from "@/lib/statUtils";
import StatsClientWrapper from "@/components/presets/StatsClientWrapper";
import { prefetchAllTablesMetadata } from "@/services/charts/tableMetadata";
import { prefetchTablePeriodicities, prefetchTableStructureLevels } from "@/services/charts/tableDefinitions";
import StatsServerTemplate from "@/components/presets/StatsServerTemplate";
import Overview from "@/components/statisticTabs/Overview";
import Finances from "@/components/statisticTabs/Finances";
import Demographics from "@/components/statisticTabs/Demographics";

const tabs = [
    {label: "Přehled", component: <Overview />},
    {label: "Finance", component: <Finances />},
    {label: "Demografie", component: <Demographics />},
    //{label: "Školství", component: <Education />},
];

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
    await prefetchTableStructureLevels(client);

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
            val: compactValueFormatter(quickData?.budget?.[0]?.totalBudget, 2) + " Kč" || "-",
            change: budgetChange,
            color: budgetChange.includes("+") ? "text-blue-300" : "text-rose-300",
            chartColor: "cyan",
            data: quickData.budget.map(item => ({ date: item.startPeriod, val: item.totalBudget })).reverse().slice(0, 10),
        },
    ]

    return (
        <StatsServerTemplate title={municipality.name} imageURL={municipality.imageURL} badges={
                <>
                    <Badge variant="primary" size="md">
                        {municipality.status}
                    </Badge>
                    {municipality.districtName &&
                        <Badge variant="glass" size="md">
                            Okres {municipality.districtName}
                        </Badge>
                    }
                    <Badge variant="glass" size="md">
                        {municipality.regionName}
                    </Badge>
                </>
            }
            stats={stats.map((item, i: number) =>
                <NumberChartCard key={i} {...item} />
            )}
        >
            <HydrationBoundary state={dehydrate(client)}>
                <StatsClientWrapper tabs={tabs} />
            </HydrationBoundary>
        </StatsServerTemplate>
    );
}