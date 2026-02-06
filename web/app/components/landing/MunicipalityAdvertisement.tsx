"use client";

import { percentValueFormatter, standardValueFormatter } from "@/app/lib/utils";
import { ChartWrapper } from "@/app/components/charts/ChartWrapper";
import TimeChart from "@/app/components/charts/wrappedComponents/TimeChart";
import Carousel from "@/app/components/utils/Carousel";
import useMunicipalities from "@/app/hooks/structure/useMunicipalities";
import Link from "next/link";
import Button from "@/app/components/utils/Button";
import { Frame } from "@/app/components/utils/Frame";
import ChevronRightIcon from "@/app/components/icons/ChevronRightIcon";


export default function MunicipalityAdvertisement() {
    const { data: municipalities } = useMunicipalities();

    const Praha = (
        <Frame key="Praha" variant="glass" className="flex flex-col pt-6 px-6 pb-2 items-center justify-center gap-2">
            <h2 className="text-3xl font-bold">Praha</h2>
            <ChartWrapper title={`Výdaje`} showFilters={false} className="bg-transparent border-none shadow-none" variants={[
                {
                    tableId: 9,
                    label: "",
                    component: props => <TimeChart type="bar" stacked compact summaries={{ current: true }} {...props} />,
                    valueFormatter: value => standardValueFormatter(value, 0, " Kč")
                },
            ]} structureLevelId={4} identifierId={municipalities?.find(m => m.name == "Praha")?.id ?? 0} periodicityId={4} startDate={new Date(2000, 1, 1)} endDate={new Date()} />

            <Link href={`municipality/${municipalities?.find(m => m.name == "Praha")?.id ?? 0}`} className="mt-2">
                <Button variant="primary" size="lg" icon={<ChevronRightIcon />} iconPosition="left">
                    Více
                </Button>
            </Link>
        </Frame>
    );

    const Brno = (
        <Frame key="Brno" variant="glass" className="flex flex-col pt-6 px-6 pb-2 items-center justify-center gap-2">
            <h2 className="text-3xl font-bold">Brno</h2>
            <ChartWrapper title={`Počet Obyvatel`} className="bg-transparent border-none shadow-none" showFilters={false} variants={[
                {
                    tableId: 1,
                    label: "",
                    component: props => <TimeChart addTotalCategory type="area" stacked={false} compact summaries={{ current: true }} {...props} allCategories={["total"]} activeCategories={["total"]} />,
                    valueFormatter: value => standardValueFormatter(value, 0)
                },
            ]} structureLevelId={4} identifierId={municipalities?.find(m => m.name == "Brno")?.id ?? 0} periodicityId={4} startDate={new Date(2000, 1, 1)} endDate={new Date()} />

            <Link href={`municipality/${municipalities?.find(m => m.name == "Brno")?.id ?? 0}`} className="mt-2">
                <Button variant="primary" size="lg" icon={<ChevronRightIcon />} iconPosition="left">
                    Více
                </Button>
            </Link>
        </Frame>
    );

    const Ostrava = (
        <Frame key="Ostrava" variant="glass" className="flex flex-col pt-6 px-6 pb-2 items-center justify-center gap-2">
            <h2 className="text-3xl font-bold">Ostrava</h2>
            <ChartWrapper title={`Nezaměstnanost`} className="bg-transparent border-none shadow-none" showFilters={false} variants={[
                {
                    tableId: 6,
                    label: "",
                    component: props => <TimeChart addTotalCategory type="area" stacked={false} compact summaries={{ current: true }} {...props} allCategories={["total"]} activeCategories={["total"]} />,
                    valueFormatter: value => percentValueFormatter(value, 2) + "%"
                },
            ]} structureLevelId={4} identifierId={municipalities?.find(m => m.name == "Ostrava")?.id ?? 0} periodicityId={4} startDate={new Date(2000, 1, 1)} endDate={new Date()} />

            <Link href={`municipality/${municipalities?.find(m => m.name == "Ostrava")?.id ?? 0}`} className="mt-2">
                <Button variant="primary" size="lg" icon={<ChevronRightIcon />} iconPosition="left">
                    Více
                </Button>
            </Link>
        </Frame>
    );

    const landingPageCarouselItems: React.ReactNode[] = [Praha, Brno, Ostrava];

    return (
        <Carousel items={landingPageCarouselItems} />
    );
}