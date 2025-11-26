'use client';

import { AreaChart } from "@tremor/react";
import { useParams } from "next/navigation";
// Import Image už nepotřebujeme
import { DashboardCard } from "@/app/components/utils/DashboardCard";
import { CustomTooltip } from "@/app/components/charts/ChartTooltip";
import { useState } from "react";

const chartdata = [
    { date: "2018", Obyvatele: 2890, Rozpocet: 2300 },
    { date: "2019", Obyvatele: 2950, Rozpocet: 2500 },
    { date: "2020", Obyvatele: 3000, Rozpocet: 2450 },
    { date: "2021", Obyvatele: 3100, Rozpocet: 2800 },
    { date: "2022", Obyvatele: 3150, Rozpocet: 3100 },
    { date: "2023", Obyvatele: 3200, Rozpocet: 3400 },
];

const dataFormatter = (number: number) =>
    Intl.NumberFormat("cs-CZ", { notation: "compact" }).format(number).toString();

const tabs = ["Přehled", "Finance", "Demografie", "Projekty", "Úřední deska"];

export default function MunicipalityPage() {
    const params = useParams<{ slug: string }>();
    const [activeTab, setActiveTab] = useState("Přehled");

    const nazevObce = params.slug
        ? params.slug.charAt(0).toUpperCase() + params.slug.slice(1)
        : "Neznámá obec";

    return (
        <div className="min-h-screen pb-10">

            {/* --- 1. HERO IMAGE SEKCE --- */}
            <div className="relative h-[500px] w-full overflow-hidden border-b border-slate-800">
                {/* Obyčejný IMG tag místo Next Image */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=2500&auto=format&fit=crop"
                        alt="Foto obce"
                        className="h-full w-full object-cover" // Toto zajistí, že se obrázek roztáhne a neořízne blbě
                    />
                    {/* Gradient pro čitelnost textu */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                </div>

                {/* Obsah Hero sekce */}
                <div className="absolute bottom-0 w-full px-4 sm:px-6 pb-8 mx-auto max-w-7xl">
                    <div className="flex flex-col gap-6">

                        {/* Nadpis */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-900/50">
                                    Hlavní město
                                </span>
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-xl">
                                {nazevObce}
                            </h1>
                            <p className="text-slate-200 text-lg max-w-2xl drop-shadow-md font-medium">
                                Kulturní a administrativní centrum regionu.
                            </p>
                        </div>

                        {/* Statistiky v obrázku (Blur Glass efekt) */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                            {[
                                { label: "Obyvatelé", val: "3 200", change: "+12%", color: "text-blue-300" },
                                { label: "Rozpočet", val: "3.4 M", change: "+5.2%", color: "text-cyan-300" },
                                { label: "Výdaje", val: "2.1 M", change: "-1.2%", color: "text-rose-300" },
                                { label: "Projekty", val: "12", change: "Aktivní", color: "text-emerald-300" },
                            ].map((item, i) => (
                                <DashboardCard
                                    key={i}
                                    // Tmavší podklad a větší blur pro lepší čitelnost na obrázku
                                    className="flex flex-col justify-center h-24 bg-black/40 backdrop-blur-md border-white/10 hover:bg-black/60 transition-colors"
                                >
                                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide opacity-90">
                                        {item.label}
                                    </span>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-2xl font-bold text-white drop-shadow-md">{item.val}</span>
                                        <span className={`text-xs font-medium ${item.color} bg-black/30 px-1.5 py-0.5 rounded border border-white/5`}>
                                            {item.change}
                                        </span>
                                    </div>
                                </DashboardCard>
                            ))}
                        </div>
                    </div>
                </div>
            </div>


            {/* --- 2. MAIN CONTENT SEKCE --- */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6">

                {/* Sticky Menu */}
                <div className="sticky top-14 z-40 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/80 border-b border-slate-800 mb-8 -mx-4 sm:-mx-6 px-4 sm:px-6">
                    <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                                    ${activeTab === tab
                                    ? "border-blue-500 text-white"
                                    : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"}
                                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grafy a Widgety */}
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    <DashboardCard>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-semibold text-white">Finanční bilance</h2>
                            <div className="flex gap-4 text-xs font-medium">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                                    Obyvatelé
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></span>
                                    Rozpočet
                                </div>
                            </div>
                        </div>

                        <AreaChart
                            className="h-80 w-full"
                            data={chartdata}
                            index="date"
                            categories={["Obyvatele", "Rozpocet"]}
                            colors={["blue", "cyan"]}
                            valueFormatter={dataFormatter}
                            yAxisWidth={40}
                            showLegend={false}
                            showGridLines={true}
                            showYAxis={true}
                            showXAxis={true}
                            curveType="monotone"
                            showAnimation={true}
                            animationDuration={1000}
                            customTooltip={CustomTooltip}
                        />
                    </DashboardCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DashboardCard className="h-64 flex flex-col items-center justify-center border-dashed border-slate-800 group cursor-pointer hover:border-slate-700 hover:bg-slate-900/50 transition-all">
                            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.806-.982l-4.661-1.165" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-slate-400">Zobrazit mapu obce</span>
                        </DashboardCard>

                        <DashboardCard className="h-64 flex flex-col items-center justify-center border-dashed border-slate-800 group cursor-pointer hover:border-slate-700 hover:bg-slate-900/50 transition-all">
                            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-slate-400">Úřední deska</span>
                        </DashboardCard>
                    </div>
                </div>

            </main>
        </div>
    );
}