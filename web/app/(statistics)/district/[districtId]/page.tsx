import { notFound } from "next/navigation";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import Badge from "@/components/utils/Badge";
import { standardValueFormatter } from "@/lib/utils";
import { getSeriesChange } from "@/lib/statUtils";
import Overview from "@/app/(statistics)/municipality/[municipalityId]/tabs/Overview";
import Finances from "@/app/(statistics)/municipality/[municipalityId]/tabs/Finances";
import Demographics from "@/app/(statistics)/municipality/[municipalityId]/tabs/Demographics";
import StatsClientWrapper from "@/components/presets/StatsClientWrapper";
import { prefetchAllTablesMetadata } from "@/services/charts/tableMetadata";
import { prefetchTablePeriodicities } from "@/services/charts/tableDefinitions";
import StatsServerTemplate from "@/components/presets/StatsServerTemplate";
import { fetchDistrictQuery } from "@/services/structure/districtStructure";

const tabs = [

];

export default async function MunicipalityPage({ params }: { params: Promise<{ districtId: number }> }) {
    const { districtId } = await params;
    const client = new QueryClient();

    const district = await fetchDistrictQuery(client, districtId);

    if (!district)
        notFound();

    // const quickData = await fetchQuickMunicipalityDataQuery(client, municipalityId);
    //
    // if (!quickData)
    //     notFound();

    await prefetchAllTablesMetadata(client);
    await prefetchTablePeriodicities(client);

    return (
        <StatsServerTemplate title={district.name} imageURL={district.imageURL} badges={
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
                <StatsClientWrapper tabs={tabs} />
            </HydrationBoundary>
        </StatsServerTemplate>
    );
}