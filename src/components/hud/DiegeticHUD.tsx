import React from 'react';
import { useGame } from '../../context/GameContext';
import { Eye, Zap, Camera, Copy, Split, RefreshCw, Heart, ShieldAlert, Sliders, Scan, ZapOff, MousePointer } from 'lucide-react';

export const DiegeticHUD: React.FC = () => {
  const {
    gameStage,
    basisState,
    toggleBasis,
    currentObjective,
    interactPrompt,
    qiMessage,
    isEchoActive,
    setIsEchoActive,
    snapshotData,
    takeSnapshot,
    restoreSnapshot,
    isFractureOpen,
    setIsFractureOpen,
    superpositionCollapsed,
    setSuperpositionCollapsed,
    timeRemaining,
    quantumLives,
    quantumStability,
    playerXP,
    playerLevelTitle,
    isScannerActive,
    toggleScanner,
    setIsWhatIfOpen,
    setIsSkillTreeOpen,
    triggerDash,
    currentLevel,
    cursorMode,
    toggleCursorMode
  } = useGame();

  if (gameStage !== 'PLAYING') return null;

  // Format 10-minute countdown MM:SS
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6 select-none font-orbitron">
      {/* Dynamic Scanlines Overlay */}
      <div className="absolute inset-0 scanlines-overlay opacity-30 z-[-1]" />

      {/* TOP BAR: Master Quantum Singularity Spec Box */}
      <div className="flex justify-between items-start">
        {/* Top-Left: Main Master HUD Box */}
        <div className="hologram-box p-4 rounded-xl border border-quantum-cyan/60 max-w-md animate-pulse-glow space-y-3">
          {/* Header Title */}
          <div className="flex items-center justify-between border-b border-quantum-cyan/30 pb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl animate-spin">⚛</span>
              <div>
                <h1 className="text-base font-black tracking-widest text-quantum-cyan hologram-glow">
                  QUANTUM SINGULARITY
                </h1>
                <p className="text-[10px] text-slate-400 font-mono-sci">
                  {currentLevel.title} — {currentLevel.location}
                </p>
              </div>
            </div>

            <div className="bg-rose-500/20 border border-rose-500 text-rose-300 text-xs px-2 py-0.5 rounded font-mono-sci font-bold flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5 animate-bounce text-rose-400" />
              <span>⏱ COLLAPSE: {formattedTime}</span>
            </div>
          </div>

          {/* Player Stats Row: Lives, Stability, XP */}
          <div className="grid grid-cols-3 gap-2 font-mono-sci text-xs">
            {/* Lives */}
            <div className="bg-slate-900/90 p-2 rounded border border-slate-800 flex flex-col items-center">
              <span className="text-[10px] text-slate-400">QUANTUM LIVES</span>
              <div className="flex items-center space-x-1 mt-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < quantumLives ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Stability */}
            <div className="bg-slate-900/90 p-2 rounded border border-slate-800 flex flex-col items-center">
              <span className="text-[10px] text-slate-400">STABILITY</span>
              <span className={`font-bold mt-0.5 ${quantumStability < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                ⚡ {quantumStability}%
              </span>
            </div>

            {/* XP */}
            <div className="bg-slate-900/90 p-2 rounded border border-slate-800 flex flex-col items-center">
              <span className="text-[10px] text-slate-400">REWARD XP</span>
              <span className="font-bold text-amber-300 mt-0.5">
                ⭐ {playerXP}
              </span>
            </div>
          </div>

          {/* Level Title & Mission Directive */}
          <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800 space-y-1">
            <div className="flex justify-between items-center text-[10px] font-mono-sci text-quantum-cyan">
              <span>EXPLORER RANK:</span>
              <span className="font-bold">{playerLevelTitle}</span>
            </div>
            <div className="text-xs font-extrabold text-white tracking-wide">
              {currentObjective.main}
            </div>
            <div className="text-[11px] text-slate-300 font-mono-sci flex items-start space-x-1">
              <span className="text-quantum-cyan font-bold">&gt;</span>
              <span>{currentObjective.sub}</span>
            </div>
          </div>
        </div>

        {/* Top-Right: Quantum Basis, Modals & Quick Action Panel */}
        <div className="flex flex-col items-end space-y-3">
          {/* Basis State Indicator & Action */}
          <div className="hologram-box px-5 py-3 rounded-lg border border-quantum-cyan/40 text-right flex items-center space-x-4">
            <div>
              <div className="text-[10px] text-slate-400 font-mono-sci tracking-widest">QUANTUM BASIS</div>
              <div className="text-2xl font-black flex items-center space-x-2 justify-end">
                <span className={basisState === 'Z' ? 'text-quantum-cyan hologram-glow' : 'text-slate-500'}>
                  |Z⟩
                </span>
                <span className="text-slate-600 text-sm">/</span>
                <span className={basisState === 'X' ? 'text-quantum-pink hologram-glow' : 'text-slate-500'}>
                  |X⟩
                </span>
              </div>
              <div className="text-[10px] text-quantum-cyan/80 font-mono-sci">
                {basisState === 'Z' ? '|0⟩ COMPUTATIONAL' : '|+⟩ SUPERPOSITION'}
              </div>
            </div>

            <button
              onClick={toggleBasis}
              className="pointer-events-auto bg-quantum-cyan/20 hover:bg-quantum-cyan/40 border border-quantum-cyan text-quantum-cyan px-3 py-2 rounded text-xs font-bold transition-all active:scale-95 flex flex-col items-center"
            >
              <Zap className="w-4 h-4 mb-0.5" />
              <span>[Q] SHIFT</span>
            </button>
          </div>

          {/* Workbench Modals Launcher Bar (What-If, Skill Tree, Scanner, Cursor Mode) */}
          <div className="hologram-box p-2 rounded-lg border border-quantum-pink/40 flex items-center space-x-2 pointer-events-auto">
            {/* CURSOR MODE TOGGLE BUTTON */}
            <button
              onClick={toggleCursorMode}
              className={`px-3 py-1.5 rounded text-xs font-bold font-mono-sci flex items-center space-x-1.5 transition-all border ${
                cursorMode
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_10px_#10b981]'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
              title="Toggle free cursor click mode for HUD interaction"
            >
              <MousePointer className="w-3.5 h-3.5 text-emerald-400" />
              <span>CURSOR {cursorMode ? 'FREE' : 'LOCKED'}</span>
            </button>

            {/* What-If Simulator */}
            <button
              onClick={() => setIsWhatIfOpen(true)}
              className="bg-purple-600/20 hover:bg-purple-600/40 border border-purple-400 text-purple-300 px-3 py-1.5 rounded text-xs font-bold font-mono-sci flex items-center space-x-1.5 transition-all"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-300" />
              <span>[T] WHAT-IF LAB</span>
            </button>

            {/* Skill Tree */}
            <button
              onClick={() => setIsSkillTreeOpen(true)}
              className="bg-quantum-pink/20 hover:bg-quantum-pink/40 border border-quantum-pink text-quantum-pink px-3 py-1.5 rounded text-xs font-bold font-mono-sci flex items-center space-x-1.5 transition-all"
            >
              <span>[K] SKILLS</span>
            </button>

            {/* Scanner Toggle */}
            <button
              onClick={toggleScanner}
              className={`px-3 py-1.5 rounded text-xs font-bold font-mono-sci flex items-center space-x-1.5 transition-all border ${
                isScannerActive
                  ? 'bg-quantum-cyan/30 border-quantum-cyan text-quantum-cyan shadow-[0_0_10px_#00f3ff]'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Scan className="w-3.5 h-3.5" />
              <span>[G] SCANNER {isScannerActive ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Quantum Abilities Action Bar (Q, R, C, F, V, B) */}
          <div className="hologram-box p-2 rounded-lg border border-quantum-cyan/30 flex items-center space-x-1.5 pointer-events-auto">
            {/* [R] Snapshot */}
            <button
              onClick={() => {
                if (snapshotData) restoreSnapshot();
                else takeSnapshot();
              }}
              className={`px-2.5 py-1.5 rounded text-[10px] font-bold font-mono-sci border flex flex-col items-center transition-all ${
                snapshotData
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 hover:bg-amber-500/40'
                  : 'bg-quantum-cyan/10 border-quantum-cyan/40 text-quantum-cyan hover:bg-quantum-cyan/30'
              }`}
            >
              <Camera className="w-3.5 h-3.5 mb-0.5" />
              <span>[R] {snapshotData ? 'RESTORE' : 'SNAP'}</span>
            </button>

            {/* [C] Echo */}
            <button
              onClick={() => setIsEchoActive(!isEchoActive)}
              className={`px-2.5 py-1.5 rounded text-[10px] font-bold font-mono-sci border flex flex-col items-center transition-all ${
                isEchoActive
                  ? 'bg-quantum-pink/30 border-quantum-pink text-quantum-pink hover:bg-quantum-pink/50'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Copy className="w-3.5 h-3.5 mb-0.5" />
              <span>[C] ECHO</span>
            </button>

            {/* [F] Rift */}
            <button
              onClick={() => setIsFractureOpen(!isFractureOpen)}
              className={`px-2.5 py-1.5 rounded text-[10px] font-bold font-mono-sci border flex flex-col items-center transition-all ${
                isFractureOpen
                  ? 'bg-purple-600/30 border-purple-400 text-purple-300 hover:bg-purple-600/50'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Split className="w-3.5 h-3.5 mb-0.5" />
              <span>[F] RIFT</span>
            </button>

            {/* [V] Collapse */}
            <button
              onClick={() => setSuperpositionCollapsed(!superpositionCollapsed)}
              className={`px-2.5 py-1.5 rounded text-[10px] font-bold font-mono-sci border flex flex-col items-center transition-all ${
                superpositionCollapsed
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 hover:bg-emerald-500/40'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 mb-0.5" />
              <span>[V] COLLAPSE</span>
            </button>

            {/* [B] Dash */}
            <button
              onClick={triggerDash}
              className="px-2.5 py-1.5 rounded text-[10px] font-bold font-mono-sci border border-cyan-400/50 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/30 flex flex-col items-center transition-all"
            >
              <ZapOff className="w-3.5 h-3.5 mb-0.5" />
              <span>[B] DASH</span>
            </button>
          </div>
        </div>
      </div>

      {/* CENTER: Reticle & Interaction Prompt */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="relative w-8 h-8 flex items-center justify-center reticle-pulse">
          <div className="w-2 h-2 rounded-full bg-quantum-cyan shadow-[0_0_10px_#00f3ff]" />
          <div className="absolute w-8 h-[1px] bg-quantum-cyan/40" />
          <div className="absolute h-8 w-[1px] bg-quantum-cyan/40" />
          <div className="absolute w-6 h-6 border border-quantum-cyan/30 rounded-full" />
        </div>

        {interactPrompt && (
          <div className="mt-6 hologram-box px-4 py-2 rounded border border-quantum-cyan/60 text-sm font-bold text-white tracking-wider flex items-center space-x-2 animate-bounce shadow-[0_0_20px_rgba(0,243,255,0.4)]">
            <Zap className="w-4 h-4 text-quantum-cyan animate-pulse" />
            <span>{interactPrompt}</span>
          </div>
        )}
      </div>

      {/* BOTTOM BAR: QI Companion Speech & Controls Reference */}
      <div className="flex justify-between items-end">
        {qiMessage && (
          <div className="hologram-box-pink px-5 py-3 rounded-lg max-w-lg border border-quantum-pink/40 flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-quantum-pink/20 border border-quantum-pink flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4 text-quantum-pink animate-pulse" />
            </div>
            <div>
              <div className="text-xs text-quantum-pink font-bold tracking-widest font-mono-sci">
                QI AI COMPANION
              </div>
              <div className="text-xs text-slate-200 font-mono-sci leading-relaxed mt-0.5">
                "{qiMessage}"
              </div>
            </div>
          </div>
        )}

        {/* Keyboard Bindings Footer */}
        <div className="hologram-box px-4 py-2.5 rounded-lg border border-quantum-cyan/30 text-[10px] font-mono-sci text-slate-300 flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <span className="bg-slate-800 text-quantum-cyan px-1 py-0.5 rounded border border-slate-700">WASD</span>
            <span>MOVE</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="bg-slate-800 text-quantum-pink px-1 py-0.5 rounded border border-slate-700">Q</span>
            <span>SHIFT</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="bg-slate-800 text-purple-300 px-1 py-0.5 rounded border border-slate-700">T</span>
            <span>WHAT-IF</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="bg-slate-800 text-quantum-pink px-1 py-0.5 rounded border border-slate-700">K</span>
            <span>SKILLS</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="bg-slate-800 text-quantum-cyan px-1 py-0.5 rounded border border-slate-700">G</span>
            <span>SCAN</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="bg-slate-800 text-cyan-300 px-1 py-0.5 rounded border border-slate-700">B</span>
            <span>DASH</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="bg-slate-800 text-quantum-cyan px-1 py-0.5 rounded border border-slate-700">E</span>
            <span>INTERACT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
