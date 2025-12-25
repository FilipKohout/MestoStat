import { ChartProps } from "@/app/components/charts/ChartWrapper";
import useDataPercentage from "@/app/hooks/charts/useDataPercentage";
import { CustomTooltipProps, DonutChart } from "@tremor/react";
import { getCategoryColorName, percentValueFormatter, standardValueFormatter } from "@/app/lib/utils";
import { useCallback } from "react";
import { CustomTooltip } from "@/app/components/charts/ChartTooltip";
import StatBox from "@/app/components/utils/StatBox";
import { HEX_COLORS } from "@/app/lib/consts";

type PieChartProps = {
    type: "pie" | "donut";
    aggregation: "SUM" | "AVG";
} & ChartProps;

export default function PieChart(props: PieChartProps) {
    const { type, aggregation, data, allCategories, activeCategories, valueFormatter } = props;

    const { percentageData } = useDataPercentage(data, aggregation);

    const filteredData = percentageData?.filter(val => activeCategories.includes(val.name));
    const consistentColors = filteredData.map(item => getCategoryColorName(allCategories, item.name));

    const customPieChartTooltip = (args: CustomTooltipProps) => (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        <CustomTooltip
            {...args}
            valueFormatter={valueFormatter as (value: number | null | undefined) => string}
        />
    );

    return (
        <>
            <div className="w-full flex flex-row flex-nowrap items-center justify-start gap-3 overflow-x-auto py-2 mb-2 px-1 scrollbar-hide">
                {allCategories.map((category, index) => {
                    const percentageValue = percentageData?.find(val => val.name === category)?.value || 0;
                    return (
                        <StatBox
                            className={"min-w-[90px] " + (activeCategories.includes(category) ? "" : "opacity-50")}
                            style={{
                                backgroundColor: HEX_COLORS[getCategoryColorName(allCategories, category)] + "70",
                            }}
                            key={category}
                            label={category}
                            value={percentValueFormatter(percentageValue, 2) + "%"}
                        />
                    );
                })}
            </div>

            <DonutChart
                className="h-80 w-full chart"
                data={filteredData}
                variant={type}
                colors={consistentColors}
                valueFormatter={valueFormatter}
                showAnimation={true}
                animationDuration={500}
                customTooltip={customPieChartTooltip as (props: CustomTooltipProps) => never}
                noDataText="Žádná data"
            />
        </>
    )
}
