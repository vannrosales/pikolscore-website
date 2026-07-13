import { useState } from 'react';
import NavBar from './assets/components/NavBar';
import Hero from './assets/components/Hero';
import About from './assets/components/About';
import Footer from './assets/components/Footer';
import Scoreboard from './assets/components/Scoreboard';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); 

  return (
    <div className="bg-gray-950 min-h-screen text-white font-sans selection:bg-emerald-500 selection:text-gray-950">
      {currentView === 'home' ? (
        <>
          <NavBar onNavigate={(view) => setCurrentView(view)} />
          <Hero onStartMatch={() => setCurrentView('scoreboard')} onNavigate={(view) => setCurrentView(view)} />
          <About />
          <Footer onNavigate={(view) => setCurrentView(view)} />
        </>
      ) : (
        <Scoreboard onBack={() => setCurrentView('home')} />
      )}
    </div>
  );
}