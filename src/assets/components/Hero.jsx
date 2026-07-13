function Hero({ onStartMatch, onNavigate }) {
    return (
        <section id="home" className="relative overflow-hidden bg-gray-900 text-white py-16 sm:py-24 border-b border-gray-800">
            {/* Background glowing ambient accents */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto space-y-6">
                    
                    {/* Live Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Courtside Digital Scoreboard
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                        Keep the rally going, <br className="hidden sm:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                            never lose count again.
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base sm:text-lg text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
                        The ultimate fast, touch-friendly pickleball scoring companion. Built for smooth matches, automatic local saving, and quick tracking across every set.
                    </p>

                    {/* Call to Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                        <button 
                            onClick={onStartMatch}
                            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 text-gray-900 font-black text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                            Start New Match Now
                        </button>
                        <button 
                            onClick={() => onNavigate('scoreboard')}
                            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gray-800 border border-gray-700/80 text-gray-300 font-bold text-sm hover:bg-gray-700 hover:text-white transition-all text-center cursor-pointer"
                        >
                            View Active Scoreboard
                        </button>
                    </div>

                    {/* Quick feature highlights */}
                    <div className="grid grid-cols-3 gap-4 pt-12 border-t border-gray-800/80 max-w-xl mx-auto text-center">
                        <div>
                            <p className="text-2xl sm:text-3xl font-black text-white">0%</p>
                            <p className="text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5">Lag & Bloat</p>
                        </div>
                        <div>
                            <p className="text-2xl sm:text-3xl font-black text-emerald-400">100%</p>
                            <p className="text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5">Free & Local</p>
                        </div>
                        <div>
                            <p className="text-2xl sm:text-3xl font-black text-white">Fast</p>
                            <p className="text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5">Big Tap UI</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Hero;