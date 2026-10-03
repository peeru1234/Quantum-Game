import React from 'react';
import { Scan, Radio, ShieldAlert } from 'lucide-react';

interface QuantumScannerOverlayProps {
  isActive: boolean;
  targetObject?: {
    name: string;
    state: string;
    prob0: number;
    prob1: number;
    stability: number;
    entangled: boolean;
  } | null;
}

export const QuantumScannerOverlay: React.FC<QuantumScannerOverlayProps> = ({ isActive, targetObject }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-8 font-orbitron">
      {/* Scanner Visual Reticle Grid */}
      <div className="absolute inset-0 border-2 border-quantum-cyan/30 rounded-xl m-4 animate-pulse">
        <div className="absolute top-2 left-2 text-[10px] text-quantum-cyan font-mono-sci flex items-center space-x-2">
          <Scan className="w-4 h-4 text-quantum-cyan animate-spin" />
          <span>QUANTUM SCANNER MODE [ACTIVE]</span>
        </div>

        <div className="absolute bottom-2 right-2 text-[10px] text-quantum-cyan font-mono-sci">
          FREQ: 433.92 THz | SPECTRAL ANALYZER
        </div>
      </div>

      {/* Target Scan Info Card */}
      <div className="absolute right-8 top-28 hologram-box p-4 rounded-lg border border-quantum-cyan/60 w-72 space-y-2.5 animate-pulse-glow">
        <div className="flex items-center justify-between border-b border-quantum-cyan/30 pb-1.5">
          <span className="text-xs font-bold text-quantum-cyan font-mono-sci tracking-wider flex items-center space-x-1">
            <Radio className="w-3.5 h-3.5 text-quantum-cyan animate-pulse" />
            <span>TARGET DIAGNOSTICS</span>
          </span>
          <span className="bg-quantum-cyan/20 text-quantum-cyan text-[9px] px-1 rounded font-mono-sci">
            SCAN READY
          </span>
        </div>

        <div className="space-y-1.5 font-mono-sci text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">OBJECT:</span>
            <span className="text-white font-bold">{targetObject?.name || "QUANTUM QUBIT CORE"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">STATE:</span>
            <span className="text-quantum-cyan font-extrabold hologram-glow">
              {targetObject?.state || "|0⟩ + |1⟩"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">PROBABILITY:</span>
            <span className="text-slate-200">
              0 → {targetObject?.prob0 ?? 50}% | 1 → {targetObject?.prob1 ?? 50}%
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">STABILITY:</span>
            <span className={targetObject && targetObject.stability < 50 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {targetObject?.stability ?? 82}%
            </span>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-slate-800">
            <span className="text-slate-400">ENTANGLEMENT:</span>
            <span className="text-quantum-pink font-bold flex items-center">
              <ShieldAlert className="w-3 h-3 mr-1 animate-pulse" />
              {targetObject?.entangled ? "ACTIVE LINK" : "STANDBY"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
