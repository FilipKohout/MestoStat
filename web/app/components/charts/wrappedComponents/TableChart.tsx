import { ChartProps } from "@/app/components/charts/ChartWrapper";
import useDataPercentage, { DataPercentageItem } from "@/app/hooks/charts/useDataPercentage";
import { percentValueFormatter } from "@/app/lib/utils";
import DataTable, { Column } from "@/app/components/utils/DataTable";

type TableChartProps = ChartProps & {
    lastPeriod?: boolean;
};

export default function TableChart(props: TableChartProps) {
    const { data, activeCategories, valueFormatter, lastPeriod } = props;
    const limitedData = (lastPeriod && data) ? data.slice(-1) : data;
    const { percentageData } = useDataPercentage(limitedData, "SUM");

    const columns: Column<DataPercentageItem>[] = [
        { key: "name", label: "Kategorie", sortable: true },
        {
            key: "rawValue",
            label: "Hodnota",
            sortable: true,
            align: "right",
            render: (item) => valueFormatter(item.rawValue)
        },
        {
            key: "value",
            label: "Procento",
            sortable: true,
            align: "right",
            render: (item) => `${percentValueFormatter(item.value, 2)}%`
        },
    ];

    const filteredData = percentageData.filter(item => activeCategories.includes(item.name));

    return (
        <DataTable<DataPercentageItem>
            data={filteredData}
            columns={columns}
            defaultSort={{ key: "rawValue", direction: "desc" }}
        />
    );
}