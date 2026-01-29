import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles/charts.css";
import Navbar from "@/app/components/utils/NavBar";
import QueryProvider from "@/app/providers/QueryProvider";
import Footer from "@/app/components/utils/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "MěstoStat",
    description: "Statistiky obcí",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    console.log("INTERNAL_API_URL:", process.env.INTERNAL_API_URL);
    console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

    return (
        <html lang="cs" className="dark">
            <body className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen flex flex-col`}>
                <QueryProvider>
                    <Navbar/>

                    <div className="w-full flex-1">
                        {children}
                    </div>

                    <Footer />
                </QueryProvider>
            </body>
        </html>
    );
}