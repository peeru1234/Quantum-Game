import React from 'react';
import { useGame } from '../../context/GameContext';
import { Play, Sliders, Award, ShieldAlert, Radio } from 'lucide-react';
import { GAME_LEVELS } from '../../types/quantum';
import { soundFx } from '../../audio/SoundSystem';

export const MainMenuHUD: React.FC = () => {
  const {
    gameStage,
    startMission,
    levelIndex,
    setLevelIndex,
    setIsWhatIfOpen,
    setIsSkillTreeOpen,
    playerXP,
    playerLevelTitle
  } = useGame();

  if (gameStage !== 'INTRO' && gameStage !== 'MENU_3D') return null;

  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-8 font-orbitron select-none">
      {/* Top Header Bar */}
      <div className="flex justify-between items-start">
        {/* Top-Left Logo Badge */}
        <div className="hologram-box p-4 rounded-xl border border-quantum-cyan/60 flex items-center space-x-3 pointer-events-auto animate-pulse-glow">
          <div className="w-10 h-10 rounded-lg bg-quantum-cyan/20 border border-quantum-cyan flex items-center justify-center text-2xl font-black text-quantum-cyan animate-spin">
            ⚛
          </div>
          <div>
            <h1 className="text-lg font-black tracking-widest text-quantum-cyan hologram-glow">
              QUANTUM SINGULARITY
            </h1>
            <p className="text-xs text-slate-300 font-mono-sci">
              THE QUANTUM QUEST • 3D SCI-FI ADVENTURE
            </p>
          </div>
        </div>

        {/* Top-Right Player Profile & Quick Launch Modals */}
        <div className="flex items-center space-x-3 pointer-events-auto">
          {/* XP & Title Badge */}
          <div className="hologram-box px-4 py-2 rounded-lg border border-amber-400/40 font-mono-sci text-right">
            <div className="text-[10px] text-slate-400">RANK STATUS</div>
            <div className="text-xs font-bold text-amber-300">{playerLevelTitle}</div>
            <div className="text-[10px] text-quantum-cyan">⭐ {playerXP} XP EARNED</div>
          </div>

          {/* What-If Workbench */}
          <button
            onClick={() => {
              soundFx.playHologramClick();
              setIsWhatIfOpen(true);
            }}
            className="hologram-box px-3.5 py-2.5 rounded-lg border border-purple-400/50 hover:border-purple-400 text-purple-300 hover:text-white text-xs font-bold font-mono-sci flex items-center space-x-1.5 transition-all active:scale-95"
          >
            <Sliders className="w-4 h-4 text-purple-300" />
            <span>WHAT-IF LAB</span>
          </button>

          {/* Skill Tree */}
          <button
            onClick={() => {
              soundFx.playHologramClick();
              setIsSkillTreeOpen(true);
            }}
            className="hologram-box px-3.5 py-2.5 rounded-lg border border-quantum-pink/50 hover:border-quantum-pink text-quantum-pink hover:text-white text-xs font-bold font-mono-sci flex items-center space-x-1.5 transition-all active:scale-95"
          >
            <Award className="w-4 h-4 text-quantum-pink" />
            <span>SKILLS</span>
          </button>
        </div>
      </div>

      {/* Center Prompt & Level Navigator Bar */}
      <div className="flex flex-col items-center space-y-6 pointer-events-auto">
        {/* Main Mission Launch Button */}
        <button
          onClick={startMission}
          className="group relative px-10 py-4 rounded-xl bg-gradient-to-r from-quantum-cyan via-blue-600 to-quantum-pink text-white text-lg font-black tracking-widest hover:brightness-125 transition-all shadow-[0_0_40px_rgba(0,243,255,0.6)] active:scale-95 flex items-center space-x-3 border border-white/40"
        >
          <Play className="w-6 h-6 text-white fill-white group-hover:scale-110 transition-transform" />
          <span>LAUNCH QUANTUM MISSION</span>
        </button>

        {/* Level World Selector Carousel Bar */}
        <div className="hologram-box p-3 rounded-xl border border-quantum-cyan/40 max-w-2xl w-full flex items-center justify-between space-x-2">
          {GAME_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              onClick={() => {
                soundFx.playHologramClick();
                setLevelIndex(idx);
              }}
              className={`flex-1 py-2 px-1 rounded-lg text-xs font-bold font-mono-sci transition-all border text-center ${
                levelIndex === idx
                  ? 'bg-quantum-cyan/30 border-quantum-cyan text-quantum-cyan shadow-[0_0_15px_#00f3ff]'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] text-slate-500">LVL 0{lvl.id}</div>
              <div className="truncate">{lvl.title.split('—')[1] || lvl.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Footer Info Bar */}
      <div className="flex justify-between items-end">
        {/* Warning Indicator */}
        <div className="hologram-box px-4 py-2 rounded-lg border border-rose-500/40 text-rose-300 text-xs font-mono-sci flex items-center space-x-2 animate-pulse">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>⚠ QUANTUM INSTABILITY DETECTED • 10:00 REACTOR TIMER ACTIVE</span>
        </div>

        {/* Controls Hint */}
        <div className="hologram-box px-4 py-2 rounded-lg border border-quantum-cyan/30 text-xs font-mono-sci text-slate-300 flex items-center space-x-2">
          <Radio className="w-4 h-4 text-quantum-cyan animate-pulse" />
          <span>[ CLICK LAUNCH BUTTON OR PRESS ENTER TO START ]</span>
        </div>
      </div>
    </div>
  );
};
