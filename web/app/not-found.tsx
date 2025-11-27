import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px]" />
            </div>

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

                <Link
                    href="/"
                    className="px-8 py-3 rounded-full bg-white text-slate-950 font-semibold hover:bg-slate-200 transition-colors shadow-lg shadow-white/10"
                >
                    Zpět na hlavní stránku
                </Link>
            </div>
        </div>
    );
}