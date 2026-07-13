import { useState } from 'react';

export default function NavBar({ onNavigate }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 text-white">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 h-16">
                
                {/* Brand Logo */}
                <button onClick={() => onNavigate('home')} className="flex items-center gap-2 group cursor-pointer bg-transparent border-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-gray-900 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                        P
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                        Pikol<span className="text-emerald-400 font-extrabold">Score</span>
                    </h1>
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:block">
                    <ul className="flex items-center gap-6 text-sm font-medium text-gray-300">
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
                </nav>

                {/* Action CTA & Mobile Hamburger Trigger */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => onNavigate('scoreboard')} 
                        className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-bold bg-emerald-500 text-gray-900 rounded-md hover:bg-emerald-400 transition-colors shadow-sm cursor-pointer"
                    >
                        New Match
                    </button>
                    
                    {/* Hamburger Menu Button */}
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

            </div>

            {/* Mobile Dropdown Menu Drawer */}
            {mobileMenuOpen && (
                <nav className="md:hidden bg-gray-900 border-b border-gray-800 px-4 pt-2 pb-6 space-y-4">
                    <ul className="flex flex-col gap-3 text-sm font-medium text-gray-300">
                        <li>
                            <button onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }} className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-800 hover:text-emerald-400 transition-colors bg-transparent border-0 cursor-pointer">Home</button>
                        </li>
                        <li>
                            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-gray-800 hover:text-emerald-400 transition-colors">About</a>
                        </li>
                        <li>
                            <button onClick={() => { onNavigate('scoreboard'); setMobileMenuOpen(false); }} className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-800 hover:text-emerald-400 transition-colors bg-transparent border-0 cursor-pointer">Scoreboard</button>
                        </li>
                    </ul>
                    <div className="pt-2 sm:hidden">
                        <button onClick={() => { onNavigate('scoreboard'); setMobileMenuOpen(false); }} className="w-full py-2.5 text-xs font-bold bg-emerald-500 text-gray-900 rounded-lg hover:bg-emerald-400 transition-colors shadow-sm cursor-pointer">
                            New Match
                        </button>
                    </div>
                </nav>
            )}
        </header>
    );
}