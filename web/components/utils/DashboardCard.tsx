import { cnTailwind } from "@/lib/utils";
import { LoadingSpinner } from "./LoadingSpinner";
import { Frame } from "@/components/utils/Frame";

export type DashboardCardProps = React.ComponentProps<typeof Frame>

export function DashboardCard({ children, className, ...props }: DashboardCardProps) {
    return (
        <Frame
            className={cnTailwind("flex flex-col gap-1 w-full", className)}
            {...props}
        >
            {children}
        </Frame>
    );
}

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    action?: React.ReactNode;
}

function Header({ children, className, title, action, ...props }: HeaderProps) {
    return (
        <div className={cnTailwind("flex items-center justify-between gap-2 min-h-[28px]", className)} {...props}>
            <div className="flex items-center gap-4">
                {title && <h2 className="text-base font-semibold text-white shrink-0">{title}</h2>}
                {children}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
    isLoading?: boolean;
    isError?: boolean;
    errorMessage?: string;
}

function Content({ children, className, isLoading, isError, errorMessage = "Chyba při načítání dat", ...props }: ContentProps) {
    return (
        <div className={cnTailwind("relative flex flex-col items-center justify-center w-full min-h-[320px] gap-3", className)} {...props}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-10 backdrop-blur-[1px] rounded-lg">
                    <LoadingSpinner className="h-10 w-10 text-blue-500" />
                </div>
            )}

            {isError && !isLoading ? (
                <div className="text-rose-200 text-sm rounded-xl p-4 px-8 bg-rose-900/20 border border-rose-800/50">
                    {errorMessage}
                </div>
            ) : (
                <div className={cnTailwind("w-full transition-opacity duration-300", isLoading ? "opacity-30" : "opacity-100")}>
                    {children}
                </div>
            )}
        </div>
    );
}

function Footer({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cnTailwind("w-full overflow-x-auto scrollbar-hide py-1 mt-auto border-t border-slate-800/50 pt-3", className)} {...props}>
            <div className="flex min-w-full w-max justify-center gap-2 px-2">
                {children}
            </div>
        </div>
    );
}

DashboardCard.Header = Header;
DashboardCard.Content = Content;
DashboardCard.Footer = Footer;