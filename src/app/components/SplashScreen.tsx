"use client";


type SplashScreenProps = {
    isVisible: boolean;
};

export default function SplashScreen({ isVisible }: SplashScreenProps) {
    if (!isVisible) return null;

    return (
        <div
            aria-live="polite"
            role="status"
            className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600 text-white"
        >
            <div className="absolute inset-0 opacity-70">
                <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-primary-500/40 blur-[120px] animate-splash-pulse" />
                <div
                    className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-white/10 blur-[120px] animate-splash-glow"
                    style={{ animationDelay: "0.3s" }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18)_0%,_transparent_55%)]" />
            </div>

            <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-10 px-6 text-center lg:px-0">
                <div className="flex flex-col items-center gap-8">
                    <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                        Supply Chain Management (SCM)
                    </h1>

                    <div className="flex flex-col items-center gap-4 text-white/80">
                        <div
                            aria-label="Loading Supply Chain Management workspace"
                            className="h-14 w-14 rounded-full border-2 border-white/30 border-t-white animate-spin"
                        />
                        <p className="text-sm uppercase tracking-[0.4em]">Loading...</p>
                    </div>

                    <div className="w-full max-w-sm space-y-2 text-left">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                            <div className="h-full w-full rounded-full bg-gradient-to-r from-white via-white/70 to-transparent animate-splash-progress" />
                        </div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/70 text-center">
                            Preparing dashboard
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
