'use client';

import { useState } from "react";

export type tab = {
    label: string;
    component: React.ReactNode;
}

type tabSectionProps = {
    tabs: tab[];
    buttons?: React.ReactNode[]; // Doporučuji nastavit jako volitelné
}

export default function TabSection({ tabs, buttons = [] }: tabSectionProps) {
    // Malý tip: místo natvrdo napsaného "Přehled" je lepší vzít první tab, kdyby se název někdy změnil
    const [activeTab, setActiveTab] = useState(tabs[0]?.label || "");

    return (
        <>
            <div className="sticky top-14 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 mb-6 -mx-4 sm:-mx-6 px-4 sm:px-6">

                {/* 1. Změna: Hlavní kontejner.
                  Na mobilech se taby a tlačítka seřadí pod sebe (flex-col), na větších displejích vedle sebe (sm:flex-row).
                */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1 sm:py-0 w-full">

                    {/* 2. Změna: Kontejner jen pro taby.
                      Má flex-1 (zabere volné místo) a scrollování (overflow-x-auto).
                    */}
                    <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide no-scrollbar flex-1 w-full">
                        {tabs.map(({ label }) => {
                            const isActive = activeTab === label;
                            return (
                                <button
                                    key={label}
                                    onClick={() => setActiveTab(label)}
                                    className={`
                                        relative py-4 text-sm font-medium transition-all duration-200 whitespace-nowrap outline-none
                                        ${isActive
                                        ? "text-blue-400"
                                        : "text-slate-400 hover:text-slate-200"}
                                    `}
                                >
                                    {label}

                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                    )}

                                    {!isActive && (
                                        <span className="absolute inset-x-0 bottom-2 top-2 rounded-md bg-slate-800/0 hover:bg-slate-800/40 transition-colors -z-10" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* 3. Změna: Kontejner pro tlačítka.
                      Shrink-0 zabrání tomu, aby se tlačítka "smrskla", když je málo místa.
                    */}
                    {buttons.length > 0 && (
                        <div className="flex shrink-0 gap-2 pb-3 sm:pb-0 overflow-x-auto scrollbar-hide no-scrollbar">
                            {buttons.map((btn, index) => (
                                // Přidal jsem key, aby React neházel warning při mapování
                                <div key={index} className="min-h-full flex">{btn}</div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full">
                {tabs.find(({ label }) => label === activeTab)?.component}
            </div>
        </>
    );
}