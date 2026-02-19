'use client';

import { useState, useRef, useEffect } from "react";
import useDateRange from "@/hooks/charts/useDateRange";
import { getPresetRange, prettyDate } from "@/lib/dateUtils";
import Button from "@/components/utils/Button";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import CalendarIcon from "@/components/icons/CalendarIcon";
import { Frame } from "@/components/utils/Frame";
import { DATE_RANGE_PRESETS } from "@/lib/consts";

type DateRangePickerProps = {
    defaultPreset?: number;
}

export default function DateRangePicker({ defaultPreset }: DateRangePickerProps) {
    const { startDate, endDate, setDateRange } = useDateRange();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const [localStart, setLocalStart] = useState(startDate);
    const [localEnd, setLocalEnd] = useState(endDate);

    const handleApply = () => {
        setDateRange(localStart, localEnd);
        setIsOpen(false);
    };

    const handlePreset = (days: number) => {
        const { start, end } = getPresetRange(days);
        setDateRange(start, end);
        setIsOpen(false);
    };

    const getButtonLabel = () => {
        if (!startDate || !endDate) return "Celé období";
        const match = DATE_RANGE_PRESETS.find(p => {
            const r = getPresetRange(p.days);
            return r.start === startDate && r.end === endDate;
        });
        if (match) return match.label;
        return `${prettyDate(startDate)} - ${prettyDate(endDate)}`;
    };

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLocalStart(startDate);
            setLocalEnd(endDate);
        }
    }, [isOpen, startDate, endDate]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <Button
                variant="outline"
                size="md"
                onClick={() => setIsOpen(!isOpen)}
                icon={<CalendarIcon className="w-4 h-4 text-slate-400" />}
                className={`
                    bg-slate-900/50 border-slate-800 text-slate-300
                    ${isOpen ? "bg-slate-800 border-slate-600 text-white ring-2 ring-blue-500/20" : "hover:bg-slate-800 hover:text-white hover:border-slate-700"}
                `}
            >
                <span className="mr-1">{getButtonLabel()}</span>
                <ChevronDownIcon className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </Button>

            {isOpen && (
                <Frame
                    variant="popup"
                    noPadding
                    className="absolute right-0 top-full mt-2 w-[400px] animate-in fade-in zoom-in-95 duration-100 origin-top-right z-50"
                >
                    <div className="flex flex-row h-full">
                        <div className="w-1/2 bg-slate-950/30 border-r border-slate-800 p-2 flex flex-col gap-1">
                            <span className="px-2 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                                Rychlé volby
                            </span>
                            {DATE_RANGE_PRESETS.map((preset) => (
                                <Button
                                    key={preset.days}
                                    variant="menu-item"
                                    size="sm"
                                    onClick={() => handlePreset(preset.days)}
                                >
                                    {preset.label}
                                </Button>
                            ))}
                        </div>

                        <div className="w-2/3 p-4 flex flex-col justify-between">
                            <div>
                                <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-3">
                                    Vlastní rozsah
                                </span>

                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 ml-1">Od</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={localStart || ""}
                                                onChange={(e) => setLocalStart(e.target.value)}
                                                className="
                                                    w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white
                                                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all
                                                    [color-scheme:dark]
                                                    [&::-webkit-calendar-picker-indicator]:opacity-50
                                                    [&::-webkit-calendar-picker-indicator]:hover:opacity-100
                                                    [&::-webkit-calendar-picker-indicator]:cursor-pointer
                                                    [&::-webkit-calendar-picker-indicator]:invert
                                                "
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 ml-1">Do</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={localEnd || ""}
                                                onChange={(e) => setLocalEnd(e.target.value)}
                                                className="
                                                    w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white
                                                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all
                                                    [color-scheme:dark]
                                                    [&::-webkit-calendar-picker-indicator]:opacity-50
                                                    [&::-webkit-calendar-picker-indicator]:hover:opacity-100
                                                    [&::-webkit-calendar-picker-indicator]:cursor-pointer
                                                    [&::-webkit-calendar-picker-indicator]:invert
                                                "
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-800">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setDateRange(null, null);
                                        setIsOpen(false);
                                    }}
                                >
                                    Reset
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={handleApply}
                                >
                                    Použít
                                </Button>
                            </div>
                        </div>
                    </div>
                </Frame>
            )}
        </div>
    );
}