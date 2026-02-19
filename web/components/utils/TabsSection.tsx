'use client';

import { useState } from "react";

export type tab = {
    label: string;
    component: React.ReactNode;
}

type tabSectionProps = {
    tabs: tab[];
}

export default function ClientTabsSection({ tabs }: tabSectionProps) {
    const [activeTab, setActiveTab] = useState("Přehled");

    return (
        <>
            <div className="sticky top-14 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 mb-6 -mx-4 sm:-mx-6 px-4 sm:px-6">
                <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide no-scrollbar">
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
            </div>

            <div className="w-full">
                {tabs.find(({ label }) => label === activeTab)?.component}
            </div>
        </>
    );
}