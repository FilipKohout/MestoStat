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
import { fetchMunicipalityQuery } from "@/services/structure/municipalityStructure";
import { fetchQuickMunicipalityDataQuery } from "@/services/charts/quickMunicipalityData";

const tabs = [
    {label: "Přehled", component: <Overview />},
    {label: "Finance", component: <Finances />},
    {label: "Demografie", component: <Demographics />},
    //{label: "Školství", component: <Education />},
];

export default async function RegionPage({ params }: { params: Promise<{ regionId: number }> }) {
    const { regionId } = await params;
    const client = new QueryClient();

    const [region] = await Promise.all([
        fetchRegionQuery(client, regionId).catch(() => null),
    ]);

    if (!region)
        notFound();

    await Promise.all([
        prefetchAllTablesMetadata(client),
        prefetchTablePeriodicities(client),
        prefetchTableStructureLevels(client)
    ]);

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
                <StatsClientWrapper tabs={tabs} identifierId={regionId} structureLevelId={2} />
            </HydrationBoundary>
        </StatsServerTemplate>
    );
}