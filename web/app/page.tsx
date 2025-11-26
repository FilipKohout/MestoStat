import { Card, Grid, Metric, Text, Title, Flex } from "@tremor/react";

// Mock data - ve skutečnosti je načteš z API
const data = [
    { category: "Celkem obyvatel", stat: "10,5 M" },
    { category: "Počet obcí", stat: "6 254" },
    { category: "Průměrný věk", stat: "42.7 let" },
];

export default function HomePage() {
    return (
        <div className="space-y-6">
            <div>
                <Title>Celkový přehled</Title>
                <Text>Statistiky pro celou Českou republiku</Text>
            </div>

            <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6">
                {data.map((item) => (
                    <Card key={item.category} decoration="top" decorationColor="blue">
                        <Flex justifyContent="start" alignItems="baseline" className="space-x-2">
                            <Text>{item.category}</Text>
                        </Flex>
                        <Metric>{item.stat}</Metric>
                    </Card>
                ))}
            </Grid>

            {/* Tady by mohl být třeba seznam obcí nebo mapa */}
            <Card>
                <div className="h-44 flex items-center justify-center border-dashed border-2 border-gray-200 rounded">
                    <Text className="text-gray-400">Zde může být mapa nebo tabulka obcí</Text>
                </div>
            </Card>
        </div>
    );
}