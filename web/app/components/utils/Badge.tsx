import { cnTailwind } from "@/app/lib/utils";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "primary" | "neutral" | "success" | "danger" | "warning" | "glass";
    size?: "sm" | "md";
    className?: string;
}

export default function Badge({ children, variant = "neutral", size = "md", className }: BadgeProps) {
    const variants = {
        primary: "bg-blue-600 text-white shadow-lg shadow-blue-900/50 border-transparent",
        neutral: "bg-slate-800 text-slate-300 border-slate-700",
        glass: "bg-black/30 text-slate-200 border-white/5 backdrop-blur-sm",
        success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };

    const sizes = {
        sm: "text-[10px] px-1.5 py-0.5",
        md: "text-xs px-2.5 py-0.5",
    };

    return (
        <span className={cnTailwind(
            "inline-flex items-center justify-center font-bold uppercase tracking-wider rounded-full border",
            variants[variant],
            sizes[size],
            className
        )}>
            {children}
        </span>
    );
}