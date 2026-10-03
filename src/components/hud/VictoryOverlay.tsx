import React from 'react';
import { useGame } from '../../context/GameContext';
import { Trophy, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

export const VictoryOverlay: React.FC = () => {
  const { gameStage, restartGame } = useGame();

  if (gameStage !== 'COMPLETED') return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center font-orbitron select-none">
      {/* Background Energy Particle Pulse */}
      <div className="absolute inset-0 scanlines-overlay opacity-40 pointer-events-none" />

      {/* Main Holographic Container */}
      <div className="hologram-box p-8 max-w-xl rounded-2xl border border-quantum-cyan/80 shadow-[0_0_50px_rgba(0,243,255,0.4)] animate-pulse-glow flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-quantum-cyan/20 border-2 border-quantum-cyan flex items-center justify-center mb-4 text-quantum-cyan shadow-[0_0_20px_#00f3ff]">
          <Trophy className="w-8 h-8 animate-bounce" />
        </div>

        <div className="text-xs font-mono-sci text-quantum-cyan tracking-[0.3em] mb-1">
          MISSION SUCCESSFUL
        </div>

        <h1 className="text-4xl font-black text-white tracking-wider hologram-glow mb-2">
          QUANTUM SHIFT ACHIEVED
        </h1>

        <p className="text-sm text-slate-300 font-mono-sci max-w-md mb-6 leading-relaxed">
          You have successfully initialized the Hadamard Gate Matrix, resolved the superposition phase barrier, entangled Kinetic Bridge B, and activated the Quantum Core!
        </p>

        {/* Mission Metrics Summary */}
        <div className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 mb-6 grid grid-cols-2 gap-3 text-left font-mono-sci text-xs">
          <div className="flex items-center space-x-2 text-quantum-cyan">
            <CheckCircle2 className="w-4 h-4" />
            <span>Coherence: 100%</span>
          </div>
          <div className="flex items-center space-x-2 text-quantum-pink">
            <Sparkles className="w-4 h-4" />
            <span>Basis Mode: |X⟩ Transformed</span>
          </div>
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Bridge: Entangled</span>
          </div>
          <div className="flex items-center space-x-2 text-yellow-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Core Shift: Active</span>
          </div>
        </div>

        {/* Restart Mission Button */}
        <button
          onClick={restartGame}
          className="bg-gradient-to-r from-quantum-cyan to-blue-600 hover:from-quantum-pink hover:to-purple-600 text-white font-bold px-8 py-3.5 rounded-xl border border-white/30 shadow-[0_0_25px_rgba(0,243,255,0.6)] transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2"
        >
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>RESTART MISSION</span>
        </button>
      </div>
    </div>
  );
};
