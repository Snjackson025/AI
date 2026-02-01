
import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { createPcmBlob, decode, decodeAudioData } from '../services/audioUtils';
import { DialerStatus } from '../types';

const AiDialer: React.FC = () => {
  const [status, setStatus] = useState<DialerStatus>('IDLE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transcript, setTranscript] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const outAudioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionResourcesRef = useRef<{
    stream: MediaStream;
    processor: ScriptProcessorNode;
    source: MediaStreamAudioSourceNode;
  } | null>(null);

  const cleanup = useCallback(() => {
    setStatus('TERMINATING');
    
    // Stop all active audio playback
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();

    // Stop microphone stream and disconnect nodes
    if (sessionResourcesRef.current) {
      const { stream, processor, source } = sessionResourcesRef.current;
      stream.getTracks().forEach(track => track.stop());
      source.disconnect();
      processor.disconnect();
      sessionResourcesRef.current = null;
    }

    // Reset cursor
    nextStartTimeRef.current = 0;
    setStatus('IDLE');
  }, []);

  const handleCall = async () => {
    if (!phoneNumber || status !== 'IDLE') return;
    
    setError(null);
    setTranscript([`[System] Initializing Outbound Uplink Protocol for target ${phoneNumber}...`]);
    
    try {
      setStatus('PERMISSIONS_REQUEST');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      setStatus('INITIALIZING_ENGINE');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }
      if (!outAudioCtxRef.current) {
        outAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      await audioCtxRef.current.resume();
      await outAudioCtxRef.current.resume();

      setStatus('CONNECTING');
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('LIVE');
            setTranscript(prev => [...prev, "[System] Neural link established. Agent is online."]);
            
            const source = audioCtxRef.current!.createMediaStreamSource(stream);
            const processor = audioCtxRef.current!.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              }).catch(() => cleanup());
            };
            
            source.connect(processor);
            processor.connect(audioCtxRef.current!.destination);
            sessionResourcesRef.current = { stream, processor, source };
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscript(prev => [...prev, `[Agent] ${message.serverContent!.outputTranscription!.text}`]);
            }

            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outAudioCtxRef.current) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outAudioCtxRef.current.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outAudioCtxRef.current, 24000, 1);
              const sourceNode = outAudioCtxRef.current.createBufferSource();
              sourceNode.buffer = buffer;
              sourceNode.connect(outAudioCtxRef.current.destination);
              sourceNode.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(sourceNode);
              sourceNode.onended = () => sourcesRef.current.delete(sourceNode);
            }
          },
          onerror: (e) => {
            console.error("Dialer Session Error:", e);
            setError("Critical signal loss. Session terminated.");
            cleanup();
          },
          onclose: () => {
            cleanup();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          systemInstruction: `You are a high-performance OmniFlow Sales Agent. 
          Target Number: ${phoneNumber}. 
          Services: Cleaning, Tech, Spiritual, T-Shirts.
          Rule: Be extremely professional and direct. Do not sound robotic. 
          Goal: Secure a follow-up appointment or estimate booking.`,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          }
        }
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to initialize audio or network.");
      setStatus('ERROR');
      setTimeout(() => setStatus('IDLE'), 3000);
    }
  };

  const getStatusDisplay = () => {
    switch(status) {
      case 'IDLE': return { text: 'Ready', color: 'text-slate-400', icon: 'fa-circle-check' };
      case 'LIVE': return { text: 'In Call', color: 'text-emerald-400', icon: 'fa-phone-volume' };
      case 'ERROR': return { text: 'Signal Failed', color: 'text-red-400', icon: 'fa-triangle-exclamation' };
      case 'TERMINATING': return { text: 'Disconnecting', color: 'text-amber-400', icon: 'fa-spinner fa-spin' };
      default: return { text: status.replace('_', ' '), color: 'text-indigo-400', icon: 'fa-spinner fa-spin' };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className="p-8 max-w-6xl mx-auto py-16 animate-in fade-in duration-700">
      <div className="glass-card rounded-[40px] shadow-2xl overflow-hidden border border-white/10">
        <div className="bg-indigo-600/10 p-12 text-center border-b border-white/5">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Neural Dialer <span className="text-indigo-400">v2.4</span></h1>
          <p className="text-slate-400 text-lg font-medium tracking-wide">Enterprise-grade autonomous voice commerce engine.</p>
        </div>

        <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-widest flex justify-between items-center">
                <span>Signal Target Destination</span>
                {error && <span className="text-red-500 lowercase text-[10px] font-black">{error}</span>}
              </label>
              <input 
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={status !== 'IDLE'}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
              />
            </div>

            <div className="bg-white/5 rounded-[32px] p-10 border border-white/10 relative overflow-hidden">
              <div className="flex items-center justify-between mb-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Status</span>
                  <span className={`text-lg font-bold flex items-center ${statusInfo.color}`}>
                    <i className={`fas ${statusInfo.icon} mr-2 text-sm`}></i>
                    {statusInfo.text}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <button 
                  onClick={status === 'LIVE' ? cleanup : handleCall}
                  disabled={status !== 'IDLE' && status !== 'LIVE'}
                  className={`w-36 h-36 rounded-full flex items-center justify-center border-4 transition-all duration-500 relative group ${
                    status === 'LIVE' 
                      ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_50px_rgba(239,68,68,0.2)]' 
                      : 'bg-indigo-600 border-indigo-400 text-white hover:scale-105 shadow-[0_0_50px_rgba(79,70,229,0.3)] disabled:opacity-20'
                  }`}
                >
                  <i className={`fas ${status === 'LIVE' ? 'fa-phone-slash' : 'fa-phone'} text-4xl`}></i>
                  {status === 'LIVE' && (
                    <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-25"></div>
                  )}
                </button>
                <p className="mt-8 text-slate-500 text-sm font-bold uppercase tracking-widest">
                  {status === 'LIVE' ? 'ACTIVE ENCRYPTION CHANNEL' : 'UPLINK STANDBY'}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-black/40 rounded-[32px] border border-white/5 p-10 flex flex-col shadow-inner min-h-[500px]">
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
              <h3 className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] flex items-center">
                <i className="fas fa-terminal mr-3 text-indigo-500"></i> Signal Log Output
              </h3>
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-white/10"></div>
                <div className="w-2 h-2 rounded-full bg-white/10"></div>
                <div className="w-2 h-2 rounded-full bg-white/10"></div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 font-mono text-xs leading-relaxed custom-scrollbar pr-4">
              {transcript.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-50 italic">
                  <i className="fas fa-satellite text-4xl mb-4"></i>
                  Awaiting signal capture...
                </div>
              )}
              {transcript.map((line, i) => (
                <div key={i} className={`flex space-x-4 animate-in fade-in slide-in-from-left-2 duration-300 ${line.startsWith('[Agent]') ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}>
                  <span className="opacity-20 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false, second: '2-digit' })}]</span>
                  <span className="break-words">{line}</span>
                </div>
              ))}
              {status === 'LIVE' && (
                <div className="flex items-center space-x-2 ml-14">
                  <div className="w-2 h-4 bg-indigo-500 animate-pulse"></div>
                  <span className="text-[10px] text-indigo-500/50 italic">Listening for response...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiDialer;
