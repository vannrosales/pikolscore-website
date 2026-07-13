export default function Footer({ onNavigate }) {
    return (
        <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Brand Logo & Tagline */}
                    <button onClick={() => onNavigate('home')} className="flex items-center gap-2 group cursor-pointer bg-transparent border-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-gray-950 shadow-lg shadow-emerald-500/20">
                            P
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                            Pikol<span className="text-emerald-400 font-extrabold">Score</span>
                        </h2>
                    </button>

                    {/* Navigation Links */}
                    <ul className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm font-medium text-gray-300">
                        <li>
                            <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors bg-transparent border-0 cursor-pointer">Home</button>
                        </li>
                        <li>
                            <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
                        </li>
                        <li>
                            <button onClick={() => onNavigate('scoreboard')} className="hover:text-emerald-400 transition-colors bg-transparent border-0 cursor-pointer">Scoreboard</button>
                        </li>
                    </ul>
                </div>

                {/* Bottom Bar / Copyright */}
                <div className="pt-8 border-t border-gray-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                    <p>© {new Date().getFullYear()} PikolScore.</p>
                    <p className="text-gray-500">Fast, local, and ready for the court.</p>
                </div>

            </div>
        </footer>
    );
}