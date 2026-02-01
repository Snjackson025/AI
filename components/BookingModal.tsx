
import React, { useState } from 'react';
import { Service } from '../types';
import { getQuoteEstimation } from '../services/geminiService';

interface Props {
  service: Service;
  onClose: () => void;
}

const BookingModal: React.FC<Props> = ({ service, onClose }) => {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState('');
  const [isEstimating, setIsEstimating] = useState(false);
  const [quote, setQuote] = useState<any>(null);

  const handleEstimate = async () => {
    if (!details) return;
    setIsEstimating(true);
    try {
      const result = await getQuoteEstimation(service.name, details);
      setQuote(result);
      setStep(2);
    } catch (error) {
      alert("AI node busy. Please retry.");
    } finally {
      setIsEstimating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      <div className="bg-[#0f172a] w-full max-w-2xl rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden border border-white/10 animate-in zoom-in-95 duration-300">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1.5 w-full bg-white/5">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">System Protocol</span>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">— Step {step} of 3</span>
            </div>
            <h3 className="text-3xl font-black text-white">{service.name}</h3>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10">
            <i className="fas fa-times text-slate-400"></i>
          </button>
        </div>

        <div className="p-10">
          {step === 1 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <i className="fas fa-pen-nib mr-2 text-indigo-400"></i> Scope of Requirements
                </label>
                <textarea 
                  rows={5}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe your specific needs. The more details, the more accurate the AI estimate..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700"
                ></textarea>
              </div>
              <button 
                onClick={handleEstimate}
                disabled={isEstimating || !details}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 overflow-hidden relative"
              >
                {isEstimating ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-circle-notch fa-spin mr-3"></i> Syncing Engine...
                  </span>
                ) : 'Compute Instant Quote'}
              </button>
            </div>
          )}

          {step === 2 && quote && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-indigo-600/10 rounded-3xl p-8 border border-indigo-500/20">
                <div className="flex flex-col mb-8">
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Validated Quote Packet</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-5xl font-black text-white">${quote.lowEstimate}</span>
                    <span className="text-2xl font-bold text-slate-500">to</span>
                    <span className="text-5xl font-black text-white">${quote.highEstimate}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quote.breakdown.map((item: string, i: number) => (
                    <div key={i} className="flex items-center space-x-3 text-slate-300 text-sm bg-white/5 p-3 rounded-xl">
                      <i className="fas fa-shield-halved text-indigo-500"></i>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => setStep(3)}
                  className="flex-[2] bg-indigo-600 text-white py-5 rounded-2xl font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
                >
                  Secure Service Slot
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white/5 text-slate-400 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all"
                >
                  Refine Parameters
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 text-center animate-in scale-95 duration-500">
              <div className="relative inline-block">
                <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center relative z-10 text-4xl shadow-xl shadow-emerald-500/20">
                  <i className="fas fa-check"></i>
                </div>
              </div>
              
              <div>
                <h4 className="text-3xl font-black text-white mb-2">Order Finalization</h4>
                <p className="text-slate-400">Encrypted payment channel established via OmniFlow Secure.</p>
              </div>
              
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-left space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Activation Deposit</span>
                  <span className="text-2xl font-black text-white">$50.00</span>
                </div>
                <div className="h-px bg-white/5"></div>
                <div className="flex items-center justify-center py-4 bg-indigo-600/10 rounded-2xl border border-dashed border-indigo-500/30">
                   <div className="text-indigo-400 flex items-center font-bold text-sm">
                     <i className="fas fa-fingerprint mr-2 text-xl"></i> Biometric Auth Ready
                   </div>
                </div>
                <button 
                  onClick={() => alert("Payment Finalized. System scheduled.")}
                  className="w-full bg-white text-[#0f172a] py-5 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all shadow-2xl"
                >
                  Confirm & Initialize
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
