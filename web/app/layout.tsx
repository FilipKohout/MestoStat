import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/utils/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Statistiky Obcí",
    description: "Next.js dashboard s Tremor",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="cs">
        <body className={inter.className}>
        <Navbar />
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            {children}
        </main>
        </body>
        </html>
    );
}