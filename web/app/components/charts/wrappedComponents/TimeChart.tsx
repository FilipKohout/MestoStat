import { ChartProps } from "@/app/components/charts/ChartWrapper";
import { AreaChart, BarChart, CustomTooltipProps } from "@tremor/react";
import { CustomTooltip } from "@/app/components/charts/ChartTooltip";
import { compactValueFormatter, getCategoryColorName } from "@/app/lib/utils";
import useFormattedData from "@/app/hooks/charts/useFormattedData";
import { CHART_INDEX_KEY as INDEX_KEY } from "@/app/lib/consts";
import StatBox from "@/app/components/utils/StatBox";
import useSummaries from "@/app/hooks/charts/useSummaries";
import { calculateYAxisWidth } from "@/app/lib/chartUtils";

type TimeChartProps = {
    type: "area" | "bar";
    summaries?: {
        average?: boolean;
        total?: boolean;
        current?: boolean;
        max?: boolean;
    };
    stacked?: boolean;
    compact?: boolean;
} & ChartProps;

export default function TimeChart(props: TimeChartProps) {
    const { type, data, activeCategories, allCategories, addTotalCategory, valueFormatter, stacked, compact, summaries = {} } = props;
    const { formattedData, dataWithoutTotal } = useFormattedData(data);
    const { averageValue, totalValue, currentSummary, maxValue, maxValueNumber } = useSummaries(formattedData, valueFormatter);

    const customAreaChartTooltip = (args: CustomTooltipProps) => (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        <CustomTooltip
            {...args}
            valueFormatter={valueFormatter as (value: number | null | undefined) => string}
        />
    );

    const Component = type === "area" ? AreaChart : BarChart;

    return (
        <>
            <div className="w-full flex flex-row flex-nowrap items-center justify-start gap-3 overflow-x-auto py-2 mb-2 px-1 scrollbar-hide">
                {summaries.current && currentSummary.trend !== null && (
                    compact
                        ? <p className="text-2xl font-bold -mt-3">{currentSummary.value}</p>
                        : <StatBox label="Aktuální Hodnota" value={currentSummary.value} trend={currentSummary.trend} />
                )}
                {summaries.average && <StatBox label="Průměr" value={averageValue} />}
                {summaries.total && <StatBox label="Celkem" value={totalValue} />}
                {summaries.max && <StatBox label="Maximum" value={maxValue} />}
            </div>
            <Component
                className="h-80 w-full chart"
                data={addTotalCategory ? formattedData : dataWithoutTotal}
                index={INDEX_KEY}
                categories={activeCategories}
                colors={activeCategories.map(cat => getCategoryColorName(allCategories, cat))}
                valueFormatter={compactValueFormatter}
                yAxisWidth={calculateYAxisWidth(maxValueNumber as number)}
                showLegend={false}
                showGridLines={true}
                showYAxis={true}
                showXAxis={true}
                curveType="natural"
                showAnimation={true}
                stack={stacked || false}
                animationDuration={500}
                customTooltip={customAreaChartTooltip as (props: CustomTooltipProps) => never}
                noDataText="Žádná data"
            />
        </>
    );
}