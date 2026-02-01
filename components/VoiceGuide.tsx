
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateVoiceGuidance } from '../services/geminiService';
import { decode, decodeAudioData } from '../services/audioUtils';

interface Props {
  onClose: () => void;
}

const VoiceGuide: React.FC<Props> = ({ onClose }) => {
  const [status, setStatus] = useState('Initializing Node...');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const instructions = `
    OmniFlow Enterprise Interface Guide initialized. 
    Navigation Protocol:
    1. Marketplace: Explore diverse business niches. Each service card provides instant AI quote generation via our custom LLM integration.
    2. Neural Dialer: Automated voice-to-voice outreach. Enter a number to deploy an autonomous sales agent capable of live negotiation using the Gemini Native Audio engine.
    3. Concierge AI: Resident system assistant located in the peripheral corner for real-time query resolution and platform navigation.
    The entire ecosystem is powered by a multi-modal state machine ensuring seamless business operation across all verticals.
  `;

  const stopAudio = useCallback(() => {
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch(e) {}
      sourceRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const startGuidance = useCallback(async () => {
    stopAudio();
    try {
      setStatus('Synthesizing Voice...');
      const base64Audio = await generateVoiceGuidance(instructions);
      if (!base64Audio) throw new Error('TTS Failure');

      setStatus('Audio Stream Active');
      setIsSpeaking(true);

      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        audioCtxRef.current,
        24000,
        1
      );

      const source = audioCtxRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtxRef.current.destination);
      source.onended = () => {
        setIsSpeaking(false);
        setStatus('Guidance Complete');
      };
      source.start();
      sourceRef.current = source;
    } catch (err) {
      console.error(err);
      setStatus('System Vocal Error');
      setIsSpeaking(false);
    }
  }, [instructions, stopAudio]);

  useEffect(() => {
    startGuidance();
    return () => {
      stopAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [startGuidance, stopAudio]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-2xl" onClick={onClose}></div>
      <div className="glass-card w-full max-w-xl rounded-[48px] p-16 text-center relative z-10 border border-white/20 animate-in zoom-in-95 duration-500 shadow-[0_0_150px_rgba(79,70,229,0.4)]">
        <div className="mb-12">
          <div className="w-28 h-28 bg-indigo-600 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/50 relative group">
            <div className={`absolute -inset-4 bg-indigo-500/20 rounded-full blur-2xl transition-opacity duration-1000 ${isSpeaking ? 'opacity-100' : 'opacity-0'}`}></div>
            <i className={`fas ${isSpeaking ? 'fa-signal-stream animate-pulse' : 'fa-brain'} text-white text-4xl`}></i>
          </div>
        </div>
        
        <h2 className="text-4xl font-black text-white mb-4 tracking-tight">System <span className="text-gradient">Audio Guide</span></h2>
        <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em] mb-12">{status}</p>
        
        <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 mb-12 text-left shadow-inner">
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            {instructions.trim().substring(0, 150)}...
          </p>
        </div>

        <div className="flex flex-col space-y-6">
          <button 
            onClick={onClose}
            className="w-full bg-white text-[#0f172a] py-6 rounded-[24px] font-black text-xl hover:bg-indigo-50 transition-all shadow-2xl active:scale-95"
          >
            Acknowledge Protocol
          </button>
          {!isSpeaking && (
            <button 
              onClick={startGuidance}
              className="text-indigo-400 font-black text-xs uppercase tracking-widest hover:text-white transition-colors"
            >
              <i className="fas fa-sync-alt mr-2"></i> Re-initialize Guidance
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceGuide;
