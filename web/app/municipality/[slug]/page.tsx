import { DashboardCard } from "@/app/components/utils/DashboardCard";
import { SparkAreaChart } from "@tremor/react";
import ClientTabsSection from "@/app/municipality/[slug]/TabsSection";

const stats = [
    { label: "Obyvatelé", val: "3 200", change: "+12%", color: "text-blue-300", chartColor: "blue", data: [{ date: "1", val: 20 }, { date: "5", val: 80 }] },
    { label: "Rozpočet", val: "3.4 M", change: "+5.2%", color: "text-cyan-300", chartColor: "cyan", data: [{ date: "1", val: 10 }, { date: "5", val: 40 }] },
    { label: "Výdaje", val: "2.1 M", change: "-1.2%", color: "text-rose-300", chartColor: "rose", data: [{ date: "1", val: 80 }, { date: "5", val: 30 }] },
    { label: "Projekty", val: "12", change: "Aktivní", color: "text-emerald-300", chartColor: "emerald", data: [{ date: "1", val: 10 }, { date: "5", val: 90 }] },
]

export default async function MunicipalityPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    return (
        <div className="min-h-screen pb-10">
            <div className="relative h-[500px] w-full border-slate-800">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=2500&auto=format&fit=crop"
                        alt={`Foto obce ${slug}`}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                <div className="absolute bottom-0 w-full left-0 right-0">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-8">
                        <div className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-900/50">
                                        Hlavní město
                                    </span>
                                </div>
                                <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-xl">
                                    {slug}
                                </h1>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                                {stats.map((item: any, i: number) => (
                                    <DashboardCard
                                        key={i}
                                        className="flex flex-row items-center justify-between h-24 bg-black/40 backdrop-blur-md border-white/10 hover:bg-black/60 transition-colors pr-6 pl-6"
                                    >
                                        <div className="flex flex-col justify-center h-full">
                                            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide opacity-90">
                                                {item.label}
                                            </span>
                                            <div className="flex items-baseline gap-2 mt-1">
                                                <span className="text-2xl font-bold text-white drop-shadow-md">{item.val}</span>
                                                <span className={`text-xs font-medium ${item.color} bg-black/30 px-1.5 py-0.5 rounded border border-white/5`}>
                                                    {item.change}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-20 h-12 flex items-center justify-end">
                                            <SparkAreaChart
                                                data={item.data}
                                                categories={["val"]}
                                                index="date"
                                                colors={[item.chartColor]}
                                                className="h-10 w-20"
                                                curveType="monotone"
                                            />
                                        </div>
                                    </DashboardCard>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-4 sm:px-6">
                <ClientTabsSection slug={slug} />
            </main>
        </div>
    );
}