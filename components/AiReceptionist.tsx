
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getReceptionistStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const AiReceptionist: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', parts: [{ text: "OmniFlow Concierge initialized. Ready to automate your service empire." }] }
  ]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, currentResponse, isOpen, scrollToBottom]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input;
    setInput('');
    
    // Manage context window: only keep last 10 messages for speed and token efficiency
    const recentHistory = messages.slice(-10);
    const newHistory: ChatMessage[] = [...recentHistory, { role: 'user', parts: [{ text: userText }] }];
    
    setMessages(prev => [...prev, { role: 'user', parts: [{ text: userText }] }]);
    setIsLoading(true);
    setCurrentResponse('');

    try {
      const stream = await getReceptionistStream(newHistory);
      let fullText = '';
      
      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          setCurrentResponse(fullText);
        }
      }
      
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: fullText }] }]);
      setCurrentResponse('');
    } catch (error) {
      console.error("Receptionist Stream Error:", error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Communication node failed. System retry initiated." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60]">
      {isOpen ? (
        <div className="bg-[#0b1120] w-[380px] md:w-[420px] h-[650px] rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 zoom-in-95 duration-500">
          <div className="p-8 bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="flex items-center space-x-5 relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-inner">
                <i className="fas fa-robot text-2xl animate-pulse"></i>
              </div>
              <div>
                <h4 className="font-black text-lg tracking-tight">Concierge AI</h4>
                <div className="flex items-center space-x-2">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Operational</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="bg-black/20 hover:bg-black/40 p-3 rounded-2xl transition-all relative z-10 border border-white/10">
              <i className="fas fa-chevron-down"></i>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-900/20 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-[24px] text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white/5 border border-white/10 text-slate-300 rounded-bl-none backdrop-blur-sm'
                }`}>
                  {m.parts[0].text}
                </div>
              </div>
            ))}
            {currentResponse && (
              <div className="flex justify-start">
                <div className="max-w-[85%] p-5 rounded-[24px] text-sm leading-relaxed bg-white/5 border border-white/10 text-slate-300 rounded-bl-none backdrop-blur-sm">
                  {currentResponse}
                  <span className="inline-block w-2 h-4 bg-indigo-500 animate-pulse ml-2 align-middle"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 bg-black/40 border-t border-white/5 flex space-x-4">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query the automation system..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-indigo-500 disabled:opacity-20 transition-all shadow-xl shadow-indigo-600/20 shrink-0"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative w-24 h-24 flex items-center justify-center transition-all duration-500 hover:scale-110"
        >
          <div className="absolute inset-0 bg-indigo-600 rounded-[32px] rotate-12 group-hover:rotate-45 transition-transform duration-500 shadow-[0_20px_60px_rgba(79,70,229,0.4)]"></div>
          <div className="relative z-10 text-white text-3xl">
            <i className="fas fa-headset"></i>
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-[#0f172a] rounded-full z-20"></div>
        </button>
      )}
    </div>
  );
};

export default AiReceptionist;
