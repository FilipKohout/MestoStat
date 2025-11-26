import { chartColors } from "@/app/lib/chartUtils";

type ChartProps = {
    title: string;
    data: Array<{ [key: string]: string | number }>;
    categories: string[];
    colors: (keyof typeof chartColors)[];
}

export async function Chart({ title, data, categories, colors }: ChartProps) {
    const { BarChart } = await import("@tremor/react");

    return (
        <div className="max-w-4xl mx-auto my-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">{title}</h2>
            <BarChart
                index={title}
                className="h-96"
                data={data}
                categories={categories}
                colors={colors}
                showLegend={true}
                yAxisWidth={56}
            />
        </div>
    );
}