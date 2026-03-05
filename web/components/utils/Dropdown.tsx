'use client';

import { useState, useRef, useEffect } from "react";
import { cnTailwind } from "@/lib/utils";
import Button from "@/components/utils/Button";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import { Frame } from "@/components/utils/Frame";
import CheckIcon from "@/components/icons/CheckIcon";

export type DropdownOption = {
    value: string | number;
    label: string;
};

interface DropdownProps {
    options: DropdownOption[];
    value?: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    icon?: React.ReactNode;
    align?: "start" | "end";
    className?: string;
}

export default function Dropdown({ options, value, onChange, placeholder = "Vybrat...", icon, align = "end", className }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: DropdownOption) => {
        onChange(option.value);
        setIsOpen(false);
    };

    const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

    return (
        <div className={cnTailwind("relative inline-block", className)} ref={containerRef}>
            <Button
                variant="secondary"
                size="md"
                onClick={() => setIsOpen(!isOpen)}
                icon={icon}
                className={cnTailwind(
                    "gap-2 min-w-[50px]",
                    isOpen
                        ? "bg-slate-800 border-slate-600 text-white ring-2 ring-blue-500/20"
                        : ""
                )}
            >
                <span className="truncate">{selectedLabel}</span>
                <ChevronDownIcon
                    className={cnTailwind(
                        "w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0",
                        isOpen && "rotate-180"
                    )}
                />
            </Button>

            {isOpen && (
                <Frame
                    variant="popup"
                    noPadding
                    className={cnTailwind(
                        "absolute top-full mt-2 min-w-[50px] w-full z-100",
                        "animate-in fade-in zoom-in-95 duration-100",
                        align === "end" ? "right-0 origin-top-right" : "left-0 origin-top-left"
                    )}
                >
                    <div className="max-h-[300px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent flex flex-col gap-0.5">
                        {options.map((option) => {
                            const isSelected = option.value === value;
                            return (
                                <Button
                                    key={option.value}
                                    variant={isSelected ? "menu-item-active" : "menu-item"}
                                    size="sm"
                                    onClick={() => handleSelect(option)}
                                >
                                    <span className="truncate text-center flex-1">{option.label}</span>

                                    {isSelected && <CheckIcon className="w-4 h-4 text-blue-500 shrink-0" />}
                                </Button>
                            );
                        })}

                        {options.length === 0 && (
                            <div className="px-3 py-4 text-center text-xs text-slate-500">
                                Žádné možnosti
                            </div>
                        )}
                    </div>
                </Frame>
            )}
        </div>
    );
}