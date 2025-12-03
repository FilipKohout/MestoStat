"use client";

import { DashboardCard } from "@/app/components/utils/DashboardCard";
import Button from "@/app/components/utils/Button";
import DatabaseIcon from "@/app/components/icons/DatabaseIcon";
import { TableDataParams } from "@/app/services/charts/tableData";
import useTableMetadata from "@/app/hooks/charts/useTableMetadata";
import useTableData from "@/app/hooks/charts/useTableData";
import { useMemo, useState } from "react";
import {
    compactValueFormatter,
    getCategoryColorName,
    percentValueFormatter,
    standardValueFormatter
} from "@/app/lib/utils";
import StatBox from "@/app/components/utils/StatBox";
import { DonutChart, CustomTooltipProps } from "@tremor/react";
import { CustomTooltip } from "@/app/components/charts/ChartTooltip";
import { CHART_INDEX_KEY as INDEX_KEY } from "@/app/lib/consts";
import Dropdown, { DropdownOption } from "@/app/components/utils/Dropdown";
import { TableVariant } from "@/app/types/charts/TableVariant";

type PieChartProps = {
    variants: TableVariant[];

    startDate: Date,
    endDate: Date,
    identifierId: number;
    periodicityId: number;

    title: string;
}

export default function PieChart(props: PieChartProps) {
    const { title, variants } = props;

    const [variant, setVariant] = useState(variants[0].id);
    const { metadata } = useTableMetadata(variant);
    const { data, isLoading, isError } = useTableData({
        tableId: variant,
        startDate: props.startDate,
        endDate: props.endDate,
        identifierId: props.identifierId,
        periodicityId: props.periodicityId,
    } as TableDataParams);

    const filteredData = useMemo<{name: string, value: number}[]>(() => {
        if (!data || data.length === 0) return [];

        return Object.keys(data[0]).filter(val => val != "periodStart").map(key => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const sum = data.reduce((sum, val) => sum + (val[key] ?? 0), 0);
            let val = 0;

            if (variants.find(v => v.id == variant)?.aggregationMethod == "SUM")
                val = sum;
            else if (variants.find(v => v.id == variant)?.aggregationMethod == "AVG")
                val = sum / data.length;

            return {
                name: key,
                value: val
            };
        });
    }, [data, variant, variants]);

    const sumData = useMemo(() => filteredData.reduce((sum, val) => sum + val.value, 0), [filteredData]);

    const percentageData = useMemo<{ name: string, value: number, rawValue: number }[]>(() => {
        if (sumData === 0)
            return filteredData.map(item => ({ ...item, rawValue: item.value, value: 0 }));

        return filteredData.map(item => ({
            name: item.name,
            value: (item.value / sumData) * 100,
            rawValue: item.value
        }));
    }, [filteredData, sumData]);

    const allCategories = useMemo(() => {
        if (!data || data.length === 0) return [];
        return Object.keys(data[0]).filter(val => val != "periodStart");
    }, [data]);

    return (
      <DashboardCard variant="default">
          <DashboardCard.Header
              title={title}
              action={
                  <Button
                      variant="ghost"
                      size="xs"
                      className="text-slate-500 hover:text-slate-300 px-1.5"
                      title={`Zdroj dat: ${metadata?.sourceDomain || 'N/A'}`}
                      onClick={() => window.open(metadata?.sourceDomain, "_blank")}
                  >
                      <DatabaseIcon className="w-3.5 h-3.5" />
                  </Button>
              }
          >
              <Dropdown options={variants.map(v => ({ label: v.label, value: v.id } as DropdownOption))} value={variant} onChange={val => setVariant(val as number)} />
          </DashboardCard.Header>

          <DashboardCard.Content isLoading={isLoading} isError={isError}>
              <div className="w-full flex flex-row flex-nowrap items-center justify-start gap-3 overflow-x-auto py-2 mb-2 px-1 scrollbar-hide">
                  {allCategories.map((category) => <StatBox className="min-w-[90px]" key={category} label={category} value={percentValueFormatter(percentageData?.find(val => val.name === category)?.value || 0) + "%"} />)}
              </div>

              <DonutChart
                  className="h-80 w-full chart"
                  data={percentageData}
                  variant="pie"
                  colors={allCategories.map(cat => getCategoryColorName(allCategories, cat))}
                  valueFormatter={compactValueFormatter}
                  showAnimation={true}
                  animationDuration={500}
                  customTooltip={(args) => <CustomTooltip {...args} percentage={true} />}
                  noDataText="Žádná data"
              />
          </DashboardCard.Content>

      </DashboardCard>
    );
}