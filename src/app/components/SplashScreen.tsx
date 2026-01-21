"use client";

type SplashScreenProps = {
    isVisible: boolean;
};

export default function SplashScreen({ isVisible }: SplashScreenProps) {
    const gridSize = 10; // เพิ่มเป็น 10x10 grid เพื่อให้ ripples มากขึ้น (100 จุด)
    const ripples = Array.from({ length: gridSize * gridSize });

    return (
        <div
            aria-live="polite"
            role="status"
            className={`fixed inset-0 z-[999] flex items-center justify-center overflow-hidden
      bg-[#1f4b99] text-white transition-opacity duration-700 ease-in-out
      ${isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        >
            {/* 🔹 Animated Background Layer */}
            <div className="absolute inset-0 opacity-60">
                <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-[#2c5fb8]/40 blur-[120px] animate-pulse" />
                <div
                    className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-[#163a6b]/30 blur-[120px] animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15)_0%,_transparent_70%)]" />

                {/* 🔹 Ripple Grid Animation - เพิ่ม density */}
                <div className="absolute inset-0 pointer-events-none">
                    {ripples.map((_, i) => {
                        const row = Math.floor(i / gridSize);
                        const col = i % gridSize;
                        const delay = (i * 0.2) % 3; // ลด delay interval เพื่อให้ไหลถี่ขึ้น

                        return (
                            <div
                                key={i}
                                className="absolute h-1 w-1 rounded-full bg-white/8 animate-[ripple_3s_ease-out_infinite]" // ลด size เป็น h-1 w-1 และ opacity เป็น 8 เพื่อเบาๆ
                                style={{
                                    left: `${(col / (gridSize - 1)) * 100}%`,
                                    top: `${(row / (gridSize - 1)) * 100}%`,
                                    animationDelay: `${delay}s`,
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* 🔹 Main Content */}
            <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-10 px-6 text-center lg:px-0">
                <div className="flex flex-col items-center gap-8">
                    <h1 className="text-3xl sm:text-4xl font-semibold leading-tight drop-shadow-lg">
                        Supply Chain Management (SCM)
                    </h1>

                    {/* Spinner */}
                    <div className="flex flex-col items-center gap-4 text-white/80">
                        <div
                            aria-label="Loading Supply Chain Management workspace"
                            className="h-14 w-14 rounded-full border-2 border-white/30 border-t-white animate-spin"
                        />
                        <p className="text-sm uppercase tracking-[0.4em]">Loading...</p>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full max-w-sm space-y-2 text-left">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                            <div className="h-full w-full rounded-full bg-gradient-to-r from-white via-white/70 to-transparent animate-[progress_2.5s_infinite]" />
                        </div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/70 text-center">
                            Preparing dashboard
                        </p>
                    </div>
                </div>
            </div>


            <style jsx global>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.4;
          }
          100% {
            transform: scale(8);
            opacity: 0;
          }
        }
      `}</style>
        </div>
    );
}
