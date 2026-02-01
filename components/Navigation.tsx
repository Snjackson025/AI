
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import VoiceGuide from './VoiceGuide';

const Navigation: React.FC = () => {
  const location = useLocation();
  const [showGuide, setShowGuide] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-bolt-lightning text-white text-xl"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white leading-tight">
                  OMNIFLOW<span className="text-indigo-400">.AI</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Enterprise Automation</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <Link 
                to="/" 
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive('/') ? 'bg-white/10 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Marketplace
              </Link>
              <Link 
                to="/dialer" 
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive('/dialer') ? 'bg-white/10 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                AI Dialer
              </Link>
              <Link 
                to="/dashboard" 
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive('/dashboard') ? 'bg-white/10 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Dashboard
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowGuide(true)}
                className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-bold text-indigo-300 hover:bg-white/10 transition-all group"
              >
                <i className="fas fa-volume-up group-hover:animate-bounce"></i>
                <span>Voice Help</span>
              </button>
              <button className="relative group px-6 py-2.5 rounded-full font-bold text-sm overflow-hidden transition-all bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/20">
                <span className="relative z-10">Start Automating</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      {showGuide && <VoiceGuide onClose={() => setShowGuide(false)} />}
    </>
  );
};

export default Navigation;
