import Link from "next/link";
import BackgroundGradient from "@/components/utils/BackgroundGradient";
import Button from "@/components/utils/Button";

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white relative overflow-hidden">
            <BackgroundGradient />

            <div className="relative z-10 flex flex-col items-center text-center px-4">
                <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
                    404
                </h1>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-100">
                    Stránka nenalezena
                </h2>
                <p className="text-slate-400 max-w-md mb-8 text-lg">
                    Omlouváme se, ale stránka, kterou hledáte, neexistuje, byla přesunuta nebo je momentálně nedostupná.
                </p>

                <Link href="/">
                    <Button
                        variant="primary"
                        size="lg"
                        className="px-8"
                    >
                        Zpět na hlavní stránku
                    </Button>
                </Link>
            </div>
        </div>
    );
}