function About() {
    return (
        <section id="about" className="bg-gray-900 text-white py-16 sm:py-24 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
                        About PikolScore
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                        Built for the court, <span className="text-emerald-400">not the clutter.</span>
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base font-medium leading-relaxed">
                        PikolScore is a lightning-fast, zero-friction digital scoreboard designed specifically for pickleball players who want to focus on the game instead of arguing over the score.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    
                    {/* Card 1 */}
                    <div className="bg-gray-800/50 border border-gray-700/60 p-6 sm:p-8 rounded-2xl space-y-3 hover:border-emerald-500/40 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-lg">
                            ⚡
                        </div>
                        <h3 className="text-lg font-semibold text-white">Big-Tap & Instant</h3>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                            Designed with giant touch targets so you can easily bump the score even with sweaty hands or from across the net.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-gray-800/50 border border-gray-700/60 p-6 sm:p-8 rounded-2xl space-y-3 hover:border-emerald-500/40 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-lg">
                            💾
                        </div>
                        <h3 className="text-lg font-semibold text-white">Zero Backend, Local Safe</h3>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                            Your matches stay right in your browser's local storage. Accidental page refresh? No problem—your score picks up right where it left off.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-gray-800/50 border border-gray-700/60 p-6 sm:p-8 rounded-2xl space-y-3 hover:border-emerald-500/40 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-lg">
                            📱
                        </div>
                        <h3 className="text-lg font-semibold text-white">Courtside Ready</h3>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                            Lightweight and responsive for any mobile device or tablet sitting on the fence, with screen wake lock support to prevent sleep mid-match.
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}

export default About;