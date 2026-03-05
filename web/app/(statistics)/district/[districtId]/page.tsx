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

export default async function DistrictPage({ params }: { params: Promise<{ districtId: number }> }) {
    const { districtId } = await params;
    const client = new QueryClient();

    const [district] = await Promise.all([
        fetchDistrictQuery(client, districtId).catch(() => null),
    ]);

    if (!district)
        notFound();

    await Promise.all([
        prefetchAllTablesMetadata(client),
        prefetchTablePeriodicities(client),
        prefetchTableStructureLevels(client)
    ]);

    return (
        <StatsServerTemplate title={district.name} badges={
            <>
                <Badge variant="primary" size="md">
                    Okres
                </Badge>
                <Badge variant="glass" size="md">
                    {district.regionName}
                </Badge>
            </>
            }
            stats={<></>}
        >
            <HydrationBoundary state={dehydrate(client)}>
                <StatsClientWrapper tabs={tabs} identifierId={districtId} structureLevelId={3} />
            </HydrationBoundary>
        </StatsServerTemplate>
    );
}