import React from 'react';
import { Play, Atom, ShieldAlert } from 'lucide-react';

interface StartScreenProps {
  onStart: (e: React.MouseEvent) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-[1000] pointer-events-auto bg-black/85 backdrop-blur-sm flex flex-col justify-between p-8 select-none font-orbitron">
      {/* Background Scanline Layer */}
      <div className="absolute inset-0 scanlines-overlay opacity-40 pointer-events-none z-0" />

      {/* Header Info */}
      <div className="relative z-10 flex justify-between items-center text-xs font-mono-sci text-quantum-cyan/80">
        <div className="flex items-center space-x-2">
          <Atom className="w-4 h-4 text-quantum-cyan animate-spin" />
          <span>SECTOR 07 • QUANTUM FACILITY</span>
        </div>
        <div className="flex items-center space-x-2 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Main Title & Holographic Control Panel */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto">
        <div className="hologram-box p-10 max-w-2xl w-full rounded-2xl border border-quantum-cyan/60 shadow-[0_0_50px_rgba(0,243,255,0.3)] animate-pulse-glow flex flex-col items-center">
          {/* Logo Icon */}
          <div className="w-16 h-16 rounded-full bg-quantum-cyan/15 border-2 border-quantum-cyan flex items-center justify-center mb-6 text-quantum-cyan shadow-[0_0_25px_#00f3ff]">
            <Atom className="w-10 h-10 animate-pulse" />
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white tracking-widest hologram-glow mb-2">
            Q-BREAK
          </h1>

          <div className="text-lg md:text-xl font-bold text-quantum-pink tracking-[0.25em] mb-6 font-mono-sci">
            QUANTUM BASIS SHIFT
          </div>

          <p className="text-xs md:text-sm text-slate-300 font-mono-sci max-w-md mb-8 leading-relaxed">
            Manipulate wavefunction superposition, switch between Z and X realities, and stabilize the Quantum CoreTokamak.
          </p>

          {/* REAL BUTTON FOR STARTING GAME (PART 4 & 6) */}
          <button
            onClick={onStart}
            className="relative z-[1001] pointer-events-auto cursor-pointer bg-gradient-to-r from-quantum-cyan via-blue-600 to-quantum-pink hover:from-quantum-pink hover:to-purple-600 text-white font-extrabold text-base md:text-lg px-10 py-4 rounded-xl border border-white/40 shadow-[0_0_30px_rgba(0,243,255,0.8)] transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-3 tracking-widest"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>[ CLICK TO ENTER ]</span>
          </button>
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="relative z-10 flex justify-between items-center text-[11px] font-mono-sci text-slate-400">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-3.5 h-3.5 text-quantum-cyan" />
          <span>REALTIME 3D QUANTUM SIMULATION • CONTROLS: WASD + MOUSE + Q + E</span>
        </div>
        <div>v2.0 • AGY ENGINE</div>
      </div>
    </div>
  );
};
