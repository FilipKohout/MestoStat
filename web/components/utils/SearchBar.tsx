"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchIcon from "@/components/icons/SearchIcon";
import Button from "@/components/utils/Button";
import { Frame } from "@/components/utils/Frame";
import Badge from "@/components/utils/Badge";
import { switchCase } from "@babel/types";
import { cnTailwind } from "@/lib/utils";

export type SearchItem = {
    id: number;
    name: string;
    type: string;
    path: string;
    location?: string;
};

interface SearchBarProps {
    data: SearchItem[];
    placeholder?: string;
    size?: "sm" | "md" | "lg";
}

export default function SearchBar({ data, placeholder = "Hledat...", size = "sm" }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [filteredData, setFilteredData] = useState<SearchItem[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (query.trim() === "") {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFilteredData([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = data
            .filter((item) => item.name.toLowerCase().includes(lowerQuery))
            .slice(0, 8);

        setFilteredData(results);
        setIsOpen(true);
    }, [query, data]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (item: SearchItem) => {
        setQuery(item.name);
        setIsOpen(false);
        router.push(item.path);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && filteredData.length > 0) {
            handleSelect(filteredData[0]);
        }
    };

    const inputSizes = {
        sm: "py-1.5 text-sm",
        md: "py-2 text-base",
        lg: "py-2.5 text-lg",
    };

    return (
        <div ref={containerRef} className="relative w-full group z-50">
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <SearchIcon className="w-4 h-4" />
                </div>
                <input
                    type="text"
                    className={cnTailwind(
                    "block w-full rounded-full border border-slate-800 bg-slate-900/50 pl-10 pr-3 text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:leading-6 transition-all",
                        inputSizes[size]
                    )}
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 0 && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {isOpen && query.length > 0 && (
                <div className="absolute top-full mt-3 w-full">
                    <Frame variant="popup" noPadding className="flex flex-col max-h-80 overflow-y-auto custom-scrollbar">
                        {filteredData.length > 0 ? (
                            <div className="p-1 flex flex-col gap-0.5">
                                {filteredData.map((item, index) => (
                                    <Button
                                        key={item.id}
                                        variant={index == 0 ? "menu-item-active" : "menu-item"}
                                        size="md"
                                        onClick={() => handleSelect(item)}
                                    >
                                        <span className="truncate">{item.name}</span>

                                        <Badge variant="primary" size="sm" className="ml-0.5 shrink-0 opacity-70">
                                            {item.type}
                                        </Badge>

                                        {item.location &&
                                            <Badge variant="neutral" size="sm" className="ml-0.5 shrink-0 opacity-70">
                                                {item.location}
                                            </Badge>
                                        }
                                    </Button>
                                ))}
                            </div>
                        ) : (
                            <div className="px-4 py-6 text-center">
                                <span className="text-sm text-slate-500 block">Žádné výsledky pro</span>
                                <span className="text-sm text-slate-300 font-medium">&#34;{query}&#34;</span>
                            </div>
                        )}
                    </Frame>
                </div>
            )}
        </div>
    );
}

export function AutofillAnimationSearchBar(props: SearchBarProps & { phrases: string[], typingDelay?: number, phraseDelay?: number }) {
    const { phrases, typingDelay = 100, phraseDelay = 1000 } = props;
    
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [query, setQuery] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    
    const currentPhrase = phrases[currentPhraseIndex];

    const delayWriting = () => new Promise(resolve => setTimeout(resolve, phraseDelay));

    useEffect(() => {
        const timer = setInterval(async () => {
            if (isDeleting)
                setQuery(prev => prev.slice(0, -1));
            else
                setQuery(prev => currentPhrase.slice(0, prev.length + 1));
            
            if (!isDeleting && query === currentPhrase) {
                clearInterval(timer);
                await delayWriting();

                setIsDeleting(true);    
            }
            else if (isDeleting && query === "") {
                clearInterval(timer);
                await delayWriting();

                setIsDeleting(false);
                setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
            }
        }, typingDelay);
        
        return () => clearInterval(timer);
    }, [currentPhrase, delayWriting, isDeleting, phrases.length, query, typingDelay]);
    
    return (<SearchBar {...props} placeholder={query} />);
}