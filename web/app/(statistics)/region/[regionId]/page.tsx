import { notFound } from "next/navigation";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import Badge from "@/components/utils/Badge";
import StatsClientWrapper from "@/components/presets/StatsClientWrapper";
import { prefetchAllTablesMetadata } from "@/services/charts/tableMetadata";
import { prefetchTablePeriodicities, prefetchTableStructureLevels } from "@/services/charts/tableDefinitions";
import StatsServerTemplate from "@/components/presets/StatsServerTemplate";
import { fetchDistrictQuery } from "@/services/structure/districtStructure";
import Overview from "@/components/statisticTabs/Overview";
import Finances from "@/components/statisticTabs/Finances";
import Demographics from "@/components/statisticTabs/Demographics";
import { fetchRegionQuery } from "@/services/structure/regionStructure";

const tabs = [
    {label: "Přehled", component: <Overview />},
    {label: "Finance", component: <Finances />},
    {label: "Demografie", component: <Demographics />},
    //{label: "Školství", component: <Education />},
];

export default async function RegionPage({ params }: { params: Promise<{ regionId: number }> }) {
    const { regionId } = await params;
    const client = new QueryClient();

    const region = await fetchRegionQuery(client, regionId);

    if (!region)
        notFound();

    // const quickData = await fetchQuickMunicipalityDataQuery(client, municipalityId);
    //
    // if (!quickData)
    //     notFound();

    await prefetchAllTablesMetadata(client);
    await prefetchTablePeriodicities(client);
    await prefetchTableStructureLevels(client);

    return (
        <StatsServerTemplate title={region.name} badges={
            <>
                <Badge variant="primary" size="md">
                    Kraj
                </Badge>
            </>
            }
            stats={<></>}
        >
            <HydrationBoundary state={dehydrate(client)}>
                <StatsClientWrapper tabs={tabs} />
            </HydrationBoundary>
        </StatsServerTemplate>
    );
}