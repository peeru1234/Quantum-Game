import React from 'react';
import { X, Award, CheckCircle, Lock, Zap } from 'lucide-react';
import { SKILL_TREE_DATA, SkillNode } from '../../types/quantum';
import { soundFx } from '../../audio/SoundSystem';

interface SkillTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerXP: number;
  unlockedSkills: string[];
  onUnlockSkill: (skillId: string, cost: number) => void;
}

export const SkillTreeModal: React.FC<SkillTreeModalProps> = ({
  isOpen,
  onClose,
  playerXP,
  unlockedSkills,
  onUnlockSkill
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-orbitron">
      <div className="relative w-full max-w-3xl bg-slate-950 border border-quantum-pink/60 rounded-xl p-6 text-white shadow-[0_0_50px_rgba(255,0,127,0.3)] flex flex-col space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-quantum-pink/30 pb-3">
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-quantum-pink animate-bounce" />
            <div>
              <h2 className="text-lg font-black tracking-wider text-quantum-pink hologram-glow">
                QUANTUM ABILITIES & SKILL TREE
              </h2>
              <p className="text-xs text-slate-400 font-mono-sci">
                Unlock Quantum Mechanics Manipulation Abilities with Earned XP
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-slate-900 border border-quantum-cyan/50 px-3 py-1 rounded text-xs font-mono-sci text-quantum-cyan font-bold">
              AVAILABLE XP: ⭐ {playerXP}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-quantum-pink text-slate-300 hover:text-quantum-pink transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Skill Tree Grid */}
        <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {SKILL_TREE_DATA.map((skill: SkillNode) => {
            const isUnlocked = unlockedSkills.includes(skill.id);
            const canAfford = playerXP >= skill.costXP;

            return (
              <div
                key={skill.id}
                className={`p-4 rounded-lg border flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-slate-900/90 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : canAfford
                    ? 'bg-slate-900/60 border-quantum-pink/50 hover:border-quantum-pink'
                    : 'bg-slate-950/80 border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold tracking-wide text-white flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-quantum-pink" />
                      <span>{skill.name}</span>
                    </span>

                    {isUnlocked ? (
                      <span className="text-emerald-400 flex items-center text-xs font-mono-sci font-bold">
                        <CheckCircle className="w-4 h-4 mr-1" /> ACTIVE
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center text-xs font-mono-sci">
                        <Lock className="w-3.5 h-3.5 mr-1 text-slate-500" /> ⭐ {skill.costXP} XP
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 font-mono-sci leading-relaxed mb-3">
                    {skill.description}
                  </p>
                </div>

                {!isUnlocked && (
                  <button
                    onClick={() => {
                      if (canAfford) {
                        soundFx.playObjectiveComplete();
                        onUnlockSkill(skill.id, skill.costXP);
                      }
                    }}
                    disabled={!canAfford}
                    className={`w-full py-1.5 rounded text-xs font-bold font-mono-sci transition-all border ${
                      canAfford
                        ? 'bg-quantum-pink/20 hover:bg-quantum-pink/40 border-quantum-pink text-quantum-pink active:scale-95'
                        : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? "UNLOCK ABILITY" : "INSUFFICIENT XP"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
