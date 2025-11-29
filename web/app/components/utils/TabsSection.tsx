'use client';

import { useState } from "react";

type tabSectionProps = {
    tabs: {
        label: string;
        component: React.ReactNode;
    }[];
}

export default function ClientTabsSection({ tabs }: tabSectionProps) {
    const [activeTab, setActiveTab] = useState("Přehled");

    return (
        <>
            <div className="sticky top-14 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800 mb-8 -mx-4 sm:-mx-6 px-4 sm:px-6">
                <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide">
                    {tabs.map(({ label }) => (
                        <button
                            key={label}
                            onClick={() => setActiveTab(label)}
                            className={`
                                py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                                ${activeTab === label
                                ? "border-blue-500 text-white"
                                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"}
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab && tabs.find(({ label }) => label == activeTab)?.component}
        </>
    );
}