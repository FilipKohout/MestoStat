import { cnTailwind } from "@/lib/utils";
import React from "react";

type FrameVariant = "default" | "glass" | "popup" | "deep" | "black-glass";

interface FrameProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: FrameVariant;
    noPadding?: boolean; // Užitečné pro dropdowny nebo komponenty, co si padding řeší samy
}

export function Frame({ children, className, variant = "default", noPadding = false, ...props }: FrameProps) {
    const variants: Record<FrameVariant, string> = {
        default: "bg-slate-900/50 border-slate-800 shadow-sm",

        glass: "bg-slate-900/80 backdrop-blur-xl border-slate-700 shadow-xl",

        popup: "bg-slate-900 border-slate-700 shadow-2xl shadow-black/50",

        deep: "bg-slate-950 border-slate-800",

        "black-glass": "bg-black/40 backdrop-blur-md border-white/10",
    };

    return (
        <div
            className={cnTailwind(
                "relative rounded-xl border overflow-hidden",
                variants[variant],
                !noPadding && "p-2",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}