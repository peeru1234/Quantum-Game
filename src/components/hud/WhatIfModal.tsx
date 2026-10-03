import React, { useState } from 'react';
import { X, Play, RotateCcw, Cpu, Zap, Activity } from 'lucide-react';
import { soundFx } from '../../audio/SoundSystem';

interface WhatIfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatIfModal: React.FC<WhatIfModalProps> = ({ isOpen, onClose }) => {
  const [initialState, setInitialState] = useState<"|0>" | "|1>">("|0>");
  const [selectedGate, setSelectedGate] = useState<"NONE" | "X" | "H" | "Z" | "CNOT">("H");
  const [measurementBasis, setMeasurementBasis] = useState<"Z" | "X">("Z");
  const [noiseLevel, setNoiseLevel] = useState<number>(5);
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<{
    finalState: string;
    prob0: number;
    prob1: number;
    coherence: number;
    description: string;
  } | null>(null);

  if (!isOpen) return null;

  const runSimulation = () => {
    soundFx.playHologramClick();
    setSimulationRunning(true);

    setTimeout(() => {
      let state = initialState;
      let prob0 = 100;
      let prob1 = 0;
      let desc = "";

      if (selectedGate === "X") {
        state = initialState === "|0>" ? "|1>" : "|0>";
        prob0 = state === "|0>" ? 100 : 0;
        prob1 = 100 - prob0;
        desc = "X (NOT) Gate inverted the quantum spin bit.";
      } else if (selectedGate === "H") {
        prob0 = 50 - (noiseLevel / 2);
        prob1 = 50 - (noiseLevel / 2);
        desc = "Hadamard (H) Gate put the qubit into equal superposition |+⟩ = (|0⟩ + |1⟩)/√2.";
      } else if (selectedGate === "Z") {
        desc = "Phase Flip (Z) Gate modified the phase sign of state |1⟩ without altering probabilities.";
        prob0 = initialState === "|0>" ? 100 : 0;
        prob1 = 100 - prob0;
      } else if (selectedGate === "CNOT") {
        desc = "Controlled-NOT Gate created an entangled Bell state |Φ+⟩ with target qubit.";
        prob0 = 50;
        prob1 = 50;
      } else {
        prob0 = initialState === "|0>" ? 100 : 0;
        prob1 = 100 - prob0;
        desc = "Identity transformation. State preserved.";
      }

      // Measurement effect
      let measuredState = "";
      if (measurementBasis === "Z") {
        measuredState = Math.random() * 100 < prob0 ? "|0⟩" : "|1⟩";
      } else {
        measuredState = Math.random() < 0.5 ? "|+⟩" : "|-⟩";
      }

      setSimulationResult({
        finalState: measuredState,
        prob0: Math.round(prob0),
        prob1: Math.round(prob1),
        coherence: Math.max(10, 100 - noiseLevel * 2),
        description: desc
      });
      setSimulationRunning(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-orbitron">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-quantum-cyan/60 rounded-xl p-6 text-white shadow-[0_0_50px_rgba(0,243,255,0.3)] flex flex-col space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-quantum-cyan/30 pb-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-6 h-6 text-quantum-cyan animate-pulse" />
            <div>
              <h2 className="text-lg font-black tracking-wider text-quantum-cyan hologram-glow">
                WHAT-IF QUANTUM SIMULATOR
              </h2>
              <p className="text-xs text-slate-400 font-mono-sci">
                Interactive Quantum Circuit & Wave Function Workbench
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-quantum-pink text-slate-300 hover:text-quantum-pink transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Initial Qubit State */}
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <label className="text-xs font-mono-sci text-slate-400 block mb-2">INITIAL QUBIT STATE</label>
            <div className="flex space-x-2">
              {(["|0>", "|1>"] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setInitialState(st)}
                  className={`flex-1 py-1.5 rounded text-xs font-bold font-mono-sci transition-all border ${
                    initialState === st
                      ? 'bg-quantum-cyan/30 border-quantum-cyan text-quantum-cyan shadow-[0_0_10px_#00f3ff]'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Gate Selection */}
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <label className="text-xs font-mono-sci text-slate-400 block mb-2">APPLY QUANTUM GATE</label>
            <div className="flex space-x-1">
              {(["NONE", "X", "H", "Z", "CNOT"] as const).map(gate => (
                <button
                  key={gate}
                  onClick={() => setSelectedGate(gate)}
                  className={`flex-1 py-1.5 rounded text-xs font-bold font-mono-sci transition-all border ${
                    selectedGate === gate
                      ? 'bg-quantum-pink/30 border-quantum-pink text-quantum-pink shadow-[0_0_10px_#ff007f]'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {gate}
                </button>
              ))}
            </div>
          </div>

          {/* Measurement Basis */}
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <label className="text-xs font-mono-sci text-slate-400 block mb-2">MEASUREMENT BASIS</label>
            <div className="flex space-x-2">
              {(["Z", "X"] as const).map(b => (
                <button
                  key={b}
                  onClick={() => setMeasurementBasis(b)}
                  className={`flex-1 py-1.5 rounded text-xs font-bold font-mono-sci transition-all border ${
                    measurementBasis === b
                      ? 'bg-amber-500/30 border-amber-400 text-amber-300 shadow-[0_0_10px_#f59e0b]'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  |{b}⟩ BASIS
                </button>
              ))}
            </div>
          </div>

          {/* Environmental Noise Slider */}
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-mono-sci text-slate-400">DECOHERENCE NOISE</label>
              <span className="text-xs font-bold font-mono-sci text-quantum-cyan">{noiseLevel}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              value={noiseLevel}
              onChange={e => setNoiseLevel(Number(e.target.value))}
              className="w-full accent-quantum-cyan cursor-pointer"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={runSimulation}
          disabled={simulationRunning}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-quantum-cyan via-blue-600 to-quantum-pink text-white font-black tracking-widest text-sm hover:brightness-125 transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)] flex items-center justify-center space-x-2"
        >
          {simulationRunning ? (
            <Activity className="w-5 h-5 animate-spin" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          <span>{simulationRunning ? "SIMULATING WAVE FUNCTION..." : "EXECUTE QUANTUM EXPERIMENT"}</span>
        </button>

        {/* Simulation Output Panel */}
        {simulationResult && (
          <div className="bg-black/60 p-4 rounded-lg border border-quantum-cyan/40 space-y-3 animate-pulse-glow">
            <div className="flex justify-between items-center">
              <div className="text-xs text-slate-400 font-mono-sci">COLLAPSED MEASUREMENT RESULT:</div>
              <div className="text-xl font-black text-quantum-cyan hologram-glow">
                {simulationResult.finalState}
              </div>
            </div>

            <div className="space-y-1.5 font-mono-sci text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Probability P(|0⟩):</span>
                <span className="text-quantum-cyan font-bold">{simulationResult.prob0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Probability P(|1⟩):</span>
                <span className="text-quantum-pink font-bold">{simulationResult.prob1}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quantum Coherence:</span>
                <span className="text-emerald-400 font-bold">{simulationResult.coherence}%</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 font-mono-sci bg-slate-900/90 p-2.5 rounded border border-slate-800 leading-relaxed">
              <span className="text-quantum-cyan font-bold">&gt; OBSERVATION NOTE: </span>
              {simulationResult.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
