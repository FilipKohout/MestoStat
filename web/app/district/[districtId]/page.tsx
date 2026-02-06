"use server";

import Test from "@/app/district/[districtId]/Test";

export default async function MunicipalityPage({ params }: { params: Promise<{ districtId: number }> }) {
    const { districtId } = await params;

    return (
        <Test districtId={Number(districtId)} />
    );
}