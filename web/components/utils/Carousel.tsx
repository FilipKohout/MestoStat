"use client";

import { useState, useEffect } from "react";

export default function Carousel({ items }: { items: React.ReactNode[] }) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (items.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % items.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [items.length]);

    return (
        <div className="relative w-full overflow-hidden group flex flex-col items-center">
            <div
                className="flex w-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
                {items.map((item, i) => (
                    <div
                        key={i}
                        className="w-full flex-shrink-0"
                    >
                        <div className="w-full flex-shrink-0 h-full">
                            {item}
                        </div>
                    </div>
                ))}
            </div>

            {items.length > 1 && (
                <div className="bottom-6 max-w-fit flex gap-3 px-4 py-2">
                    {items.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                i === activeIndex
                                    ? "w-8 bg-blue-500 shadow-lg shadow-blue-500/50"
                                    : "w-2 bg-white/50 hover:bg-white/80"
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}