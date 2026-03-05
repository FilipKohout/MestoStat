'use client';

import { useState } from "react";
import Button from "@/components/utils/Button";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import { cnTailwind } from "@/lib/utils";

export type tab = {
    label: string;
    component: React.ReactNode;
}

type tabSectionProps = {
    tabs: tab[];
    buttons?: React.ReactNode[];
}

export default function TabSection({ tabs, buttons = [] }: tabSectionProps) {
    const [activeTab, setActiveTab] = useState(tabs[0]?.label || "");
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);

    return (
        <>
            <div className="sticky top-14 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 mb-6 -mx-4 sm:-mx-6 px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:gap-4 py-1 sm:py-0 w-full">
                    <div className="flex items-center w-full">
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

                        {buttons.length > 0 && (
                            <Button
                                variant="secondary"
                                onClick={() => setIsMenuExpanded(!isMenuExpanded)}
                                className="sm:hidden ml-4 p-2"
                            >
                                <ChevronDownIcon
                                    className={cnTailwind(
                                        "w-4 h-4text-slate-500 transition-transform duration-200 shrink-0",
                                        isMenuExpanded && "rotate-180"
                                    )}
                                />
                            </Button>
                        )}
                    </div>

                    {buttons.length > 0 && (
                        <div className={`
                            shrink-0 gap-2 pb-3 sm:pb-0 flex-wrap
                            justify-center sm:justify-end
                            ${isMenuExpanded
                            ? "flex mt-2 border-t border-slate-800/60 pt-3 sm:border-t-0 sm:mt-0 sm:pt-0"
                            : "hidden sm:flex"}
                        `}>
                            {buttons.map((btn, index) => (
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