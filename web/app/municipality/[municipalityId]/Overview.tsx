'use client';

import { Chart } from "@/app/components/charts/Chart";
import { DashboardCard } from "@/app/components/utils/DashboardCard";

export default function Overview() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Chart
                    showTotal
                    title="Počet Obyvatel"
                    tableId={1}
                    startDate={new Date('2000-01-01')}
                    endDate={new Date('2025-01-01')}
                    identifierId={1}
                    periodicityId={1}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DashboardCard className="h-64 flex flex-col items-center justify-center border-dashed border-slate-800 group cursor-pointer hover:border-slate-700 hover:bg-slate-900/50 transition-all">
                    <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.806-.982l-4.661-1.165" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-400">Zobrazit mapu obce</span>
                </DashboardCard>

                <DashboardCard className="h-64 flex flex-col items-center justify-center border-dashed border-slate-800 group cursor-pointer hover:border-slate-700 hover:bg-slate-900/50 transition-all">
                    <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-400">Úřední deska</span>
                </DashboardCard>
            </div>
        </div>
    );
}