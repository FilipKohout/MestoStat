export default function BackgroundGradient() {
    return <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />

        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[120px] mix-blend-screen" />

        <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[80px] mix-blend-screen" />
    </div>
}