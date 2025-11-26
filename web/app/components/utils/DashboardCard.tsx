import { cn } from "@/app/lib/utils";

export function DashboardCard({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "relative w-full overflow-hidden",
                "bg-slate-900",
                "border border-slate-800",
                "rounded-xl p-4",
                "shadow-sm",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}