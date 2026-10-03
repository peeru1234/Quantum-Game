import React from 'react';
import { Canvas } from '@react-three/fiber';
import { GameProvider, useGame } from './context/GameContext';
import { SciFiFacility3D } from './components/3d/SciFiFacility3D';
import { MainMenu3D } from './components/3d/MainMenu3D';
import { QICompanion3D } from './components/3d/QICompanion3D';
import { FPSController } from './components/3d/FPSController';
import { DiegeticHUD } from './components/hud/DiegeticHUD';
import { MainMenuHUD } from './components/hud/MainMenuHUD';
import { VictoryOverlay } from './components/hud/VictoryOverlay';
import { QuantumScannerOverlay } from './components/hud/QuantumScannerOverlay';
import { QuantumCursorOverlay } from './components/hud/QuantumCursorOverlay';
import { WhatIfModal } from './components/hud/WhatIfModal';
import { SkillTreeModal } from './components/hud/SkillTreeModal';

const Main3DScene: React.FC = () => {
  const { gameStage } = useGame();

  return (
    <>
      {/* 3D Main Menu Environment on Homepage */}
      {(gameStage === 'INTRO' || gameStage === 'MENU_3D') && <MainMenu3D />}

      {/* 3D Facility Environment during gameplay */}
      {gameStage === 'PLAYING' && <SciFiFacility3D />}

      {/* QI Robot Companion in 3D during gameplay */}
      {gameStage === 'PLAYING' && <QICompanion3D position={[1.2, 1.8, -2]} />}

      {/* First Person Player Controls during gameplay */}
      {gameStage === 'PLAYING' && <FPSController />}
    </>
  );
};

export const GameContent: React.FC = () => {
  const {
    gameStage,
    startMission,
    isScannerActive,
    isWhatIfOpen,
    setIsWhatIfOpen,
    isSkillTreeOpen,
    setIsSkillTreeOpen,
    playerXP,
    unlockedSkills,
    unlockSkill
  } = useGame();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((gameStage === 'INTRO' || gameStage === 'MENU_3D') && (e.code === 'Enter' || e.code === 'Space')) {
        startMission();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStage, startMission]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none font-orbitron">
      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 1.6, 5], fov: 75 }}
        gl={{ antialias: true, alpha: false }}
        className="w-full h-full"
      >
        <color attach="background" args={['#03050a']} />
        <fog attach="fog" args={['#03050a', 5, 45]} />
        <Main3DScene />
      </Canvas>

      {/* Main Menu UI Overlay on Intro Screen */}
      <MainMenuHUD />

      {/* STARTING Transition Flash Overlay */}
      {gameStage === 'STARTING' && (
        <div className="absolute inset-0 bg-white animate-ping opacity-75 z-40 pointer-events-none" />
      )}

      {/* Gameplay HUD Overlay */}
      <DiegeticHUD />

      {/* Custom Glowing Quantum Cursor Overlay */}
      <QuantumCursorOverlay />

      {/* Quantum Scanner Overlay */}
      <QuantumScannerOverlay isActive={isScannerActive} />

      {/* What-If Simulator Modal */}
      <WhatIfModal isOpen={isWhatIfOpen} onClose={() => setIsWhatIfOpen(false)} />

      {/* Skill Tree Modal */}
      <SkillTreeModal
        isOpen={isSkillTreeOpen}
        onClose={() => setIsSkillTreeOpen(false)}
        playerXP={playerXP}
        unlockedSkills={unlockedSkills}
        onUnlockSkill={unlockSkill}
      />

      {/* Game Completion Overlay */}
      <VictoryOverlay />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
