
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Marketplace from './components/Marketplace';
import AiDialer from './components/AiDialer';
import AiReceptionist from './components/AiReceptionist';
import BookingModal from './components/BookingModal';
import { Service } from './types';

const App: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <Router>
      <div className="min-h-screen relative overflow-x-hidden">
        <Navigation />
        
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Marketplace onSelect={(s) => setSelectedService(s)} />} />
            <Route path="/dialer" element={<AiDialer />} />
            <Route path="/dashboard" element={
              <div className="p-20 text-center max-w-7xl mx-auto">
                <h1 className="text-5xl font-black text-white mb-8">Performance <span className="text-gradient">Intelligence</span></h1>
                <p className="text-slate-400 text-lg mb-16 max-w-2xl mx-auto">Real-time telemetry across all business niches.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="glass-card p-10 rounded-[32px] border border-white/5">
                    <div className="text-indigo-400 mb-4 flex justify-center"><i className="fas fa-chart-line text-3xl"></i></div>
                    <div className="text-5xl font-black text-white mb-2">$12.4k</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Revenue (30D)</div>
                  </div>
                  <div className="glass-card p-10 rounded-[32px] border border-white/5">
                    <div className="text-indigo-400 mb-4 flex justify-center"><i className="fas fa-calendar-check text-3xl"></i></div>
                    <div className="text-5xl font-black text-white mb-2">84</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Orders</div>
                  </div>
                  <div className="glass-card p-10 rounded-[32px] border border-white/5">
                    <div className="text-indigo-400 mb-4 flex justify-center"><i className="fas fa-brain text-3xl"></i></div>
                    <div className="text-5xl font-black text-white mb-2">98%</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Automation Efficiency</div>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </main>

        <AiReceptionist />
        
        {selectedService && (
          <BookingModal 
            service={selectedService} 
            onClose={() => setSelectedService(null)} 
          />
        )}

        <footer className="py-20 px-8 border-t border-white/5 relative z-10 mt-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="col-span-1 lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <i className="fas fa-bolt-lightning text-white"></i>
                </div>
                <span className="text-2xl font-black text-white uppercase tracking-tighter">OmniFlow<span className="text-indigo-400">.AI</span></span>
              </div>
              <p className="text-slate-500 max-w-sm text-sm leading-relaxed mb-8">
                The world's first multi-niche business operating system. Scale from simple retail to complex spiritual or technical services with autonomous AI agents.
              </p>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Platform</h5>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Marketplace</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Neural Dialer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Enterprise CRM</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Connect</h5>
              <div className="flex space-x-4 mb-8">
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-slate-400 hover:text-white"><i className="fab fa-twitter"></i></a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-slate-400 hover:text-white"><i className="fab fa-linkedin"></i></a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-slate-400 hover:text-white"><i className="fab fa-discord"></i></a>
              </div>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">&copy; 2024 OmniFlow Intelligence. Node-42.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
