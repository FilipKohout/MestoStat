import { ReactNode } from "react";

interface StatsServerTemplateProps {
    title: string;
    imageURL?: string;
    badges: ReactNode;
    stats: ReactNode;
    children: ReactNode;
}

export default function StatsServerTemplate({ title, imageURL, badges, stats, children }: StatsServerTemplateProps) {
    return (
        <div className="min-h-screen pb-10">
            <div className="relative h-[500px] w-full border-slate-800">
                <div className="absolute inset-0">
                    <img
                        src={imageURL || "https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=2500&auto=format&fit=crop"}
                        alt={`Foto ${title}`}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                <div className="absolute bottom-0 w-full left-0 right-0">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-8">
                        <div className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-xl">
                                    {title}
                                </h1>
                                <div className="flex items-center gap-3">
                                    {badges}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                                {stats}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-4 sm:px-6">
                {children}
            </main>
        </div>
    );
}