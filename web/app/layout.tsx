import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles/charts.css";
import Navbar from "@/app/components/utils/NavBar";
import QueryProvider from "@/app/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "MěstoStat",
    description: "Statistiky obcí",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="cs" className="dark">
            <body className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen flex flex-col`}>
                <QueryProvider>
                    <Navbar/>

                    <div className="w-full flex-1">
                        {children}
                    </div>
                </QueryProvider>
            </body>
        </html>
    );
}