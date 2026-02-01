
import React from 'react';
import { SERVICES } from '../constants';
import { Service } from '../types';

interface Props {
  onSelect: (s: Service) => void;
}

const Marketplace: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span>Next-Gen Enterprise Engine</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
          One Platform. <br/>
          <span className="text-gradient">Unlimited Niches.</span>
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
          Whether you're purging spirits, deep cleaning offices, or building scalable web systems—our AI handles the operations while you scale.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map((service) => (
          <div 
            key={service.id}
            onClick={() => onSelect(service)}
            className="group glass-card glow-hover rounded-[32px] p-8 transition-all duration-500 cursor-pointer relative overflow-hidden"
          >
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 mb-8 border border-white/10 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <i className={`fas ${service.icon} text-2xl`}></i>
              </div>
              
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">{service.category}</span>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4 leading-snug group-hover:text-indigo-300 transition-colors">
                {service.name}
              </h3>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                {service.description}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Starts from</span>
                  <span className="text-lg font-bold text-white">{service.priceEstimate}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all">
                  <i className="fas fa-chevron-right text-xs"></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
