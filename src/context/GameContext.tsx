import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { soundFx } from '../audio/SoundSystem';
import { OBJECTIVES, ObjectiveStep } from '../constants/objectives';
import { GAME_LEVELS, LevelDefinition, QuantumEnemy } from '../types/quantum';

export type GamePhase = "intro" | "playing" | "paused" | "complete" | "starting";
export type GameStage = "INTRO" | "PLAYING" | "PAUSED" | "COMPLETED" | "STARTING" | "MENU_3D";
export type BasisState = "Z" | "X";
export type QuantumState = "|0>" | "|1>" | "|+>" | "|->";

interface GameContextType {
  gamePhase: GamePhase;
  setGamePhase: (phase: GamePhase) => void;
  gameStage: GameStage;
  setGameStage: (stage: GameStage) => void;
  basisState: BasisState;
  setBasisState: (basis: BasisState) => void;
  toggleBasis: () => void;
  isTransitioningBasis: boolean;
  quantumState: QuantumState;
  setQuantumState: (st: QuantumState) => void;
  measureZ: () => QuantumState;
  measureX: () => QuantumState;
  quantumFlip: () => void;
  objectiveIndex: number;
  currentObjective: ObjectiveStep;
  advanceObjective: () => void;
  interactPrompt: string | null;
  setInteractPrompt: (prompt: string | null) => void;
  qiMessage: string | null;
  setQiMessage: (msg: string | null) => void;
  quantumCoherence: number;
  setQuantumCoherence: (val: number | ((prev: number) => number)) => void;
  door1Unlocked: boolean;
  setDoor1Unlocked: (unlocked: boolean) => void;
  bridgeActive: boolean;
  hGateAngle: number;
  setHGateAngle: (val: number | ((prev: number) => number)) => void;
  handleStartGame: (e?: React.MouseEvent | KeyboardEvent) => void;
  startMission: (e?: React.MouseEvent | KeyboardEvent) => void;
  restartGame: () => void;
  isPointerLocked: boolean;
  setIsPointerLocked: (val: boolean) => void;
  cursorMode: boolean;
  setCursorMode: (val: boolean) => void;
  toggleCursorMode: () => void;
  isEntangled: boolean;
  setIsEntangled: (entangled: boolean) => void;
  isEchoActive: boolean;
  setIsEchoActive: (val: boolean) => void;
  snapshotData: { basis: BasisState; state: QuantumState } | null;
  takeSnapshot: () => void;
  restoreSnapshot: () => void;
  isFractureOpen: boolean;
  setIsFractureOpen: (val: boolean) => void;
  isStormActive: boolean;
  setIsStormActive: (val: boolean) => void;
  superpositionCollapsed: boolean;
  setSuperpositionCollapsed: (val: boolean) => void;
  controlsRef: React.RefObject<any>;

  // QUANTUM SINGULARITY MASTER FEATURES
  timeRemaining: number;
  quantumLives: number;
  quantumStability: number;
  playerXP: number;
  playerLevelTitle: string;
  unlockedSkills: string[];
  unlockSkill: (skillId: string, cost: number) => void;
  isScannerActive: boolean;
  setIsScannerActive: (val: boolean) => void;
  toggleScanner: () => void;
  isWhatIfOpen: boolean;
  setIsWhatIfOpen: (val: boolean) => void;
  isSkillTreeOpen: boolean;
  setIsSkillTreeOpen: (val: boolean) => void;
  currentLevel: LevelDefinition;
  levelIndex: number;
  setLevelIndex: (idx: number) => void;
  nextLevel: () => void;
  enemies: QuantumEnemy[];
  bossHealth: number;
  bossPhase: number;
  triggerDash: () => void;
  modifyStability: (amount: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gamePhase, setGamePhaseState] = useState<GamePhase>("intro");
  const [basisState, setBasisState] = useState<BasisState>("Z");
  const [isTransitioningBasis, setIsTransitioningBasis] = useState<boolean>(false);
  const [quantumState, setQuantumState] = useState<QuantumState>("|0>");
  const [objectiveIndex, setObjectiveIndex] = useState<number>(0);
  const [interactPrompt, setInteractPrompt] = useState<string | null>(null);
  const [qiMessage, setQiMessage] = useState<string | null>(OBJECTIVES[0].qiDialog);
  const [quantumCoherence, setQuantumCoherence] = useState<number>(42);
  const [door1Unlocked, setDoor1Unlocked] = useState<boolean>(false);
  const [hGateAngle, setHGateAngle] = useState<number>(0);
  const [isPointerLocked, setIsPointerLocked] = useState<boolean>(false);
  const [cursorMode, setCursorMode] = useState<boolean>(true); // Default cursor mode active for UI clicking!
  const [isEntangled, setIsEntangled] = useState<boolean>(false);
  const [isEchoActive, setIsEchoActive] = useState<boolean>(false);
  const [snapshotData, setSnapshotData] = useState<{ basis: BasisState; state: QuantumState } | null>(null);
  const [isFractureOpen, setIsFractureOpen] = useState<boolean>(false);
  const [isStormActive, setIsStormActive] = useState<boolean>(false);
  const [superpositionCollapsed, setSuperpositionCollapsed] = useState<boolean>(false);

  // Master Quantum Singularity State
  const [timeRemaining, setTimeRemaining] = useState<number>(600);
  const [quantumLives, setQuantumLives] = useState<number>(3);
  const [quantumStability, setQuantumStability] = useState<number>(82);
  const [playerXP, setPlayerXP] = useState<number>(1250);
  const [levelIndex, setLevelIndex] = useState<number>(0);
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>(["dash", "scanner", "echo"]);
  const [isScannerActive, setIsScannerActive] = useState<boolean>(false);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState<boolean>(false);
  const [isSkillTreeOpen, setIsSkillTreeOpen] = useState<boolean>(false);
  const [bossHealth] = useState<number>(100);
  const [bossPhase] = useState<number>(1);

  const [enemies] = useState<QuantumEnemy[]>([
    {
      id: "enemy-1",
      name: "Superposition Phantom A",
      type: "PHANTOM",
      position: [8, 1.5, -20],
      health: 50,
      maxHealth: 50,
      state: "|+>",
      basis: "X",
      isObserved: false
    },
    {
      id: "enemy-2",
      name: "Decoherence Virus B",
      type: "VIRUS",
      position: [-10, 2, -35],
      health: 40,
      maxHealth: 40,
      state: "|0>",
      basis: "Z",
      isObserved: true
    },
    {
      id: "enemy-3",
      name: "Entanglement Guardian C",
      type: "GUARDIAN",
      position: [0, 2, -45],
      health: 100,
      maxHealth: 100,
      state: "|1>",
      basis: "Z",
      isObserved: false
    }
  ]);

  const controlsRef = useRef<any>(null);

  // 10-Minute Reactor Countdown Timer
  useEffect(() => {
    if (gamePhase !== "playing") return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGamePhase("complete");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase]);

  const toggleCursorMode = () => {
    setCursorMode(prev => {
      const next = !prev;
      if (next && document.pointerLockElement) {
        document.exitPointerLock();
      }
      soundFx.playHologramClick();
      return next;
    });
  };

  const getLevelTitle = (xp: number) => {
    if (xp >= 2500) return "LEVEL 7 — Quantum Master";
    if (xp >= 2000) return "LEVEL 6 — Quantum Architect";
    if (xp >= 1500) return "LEVEL 5 — Quantum Engineer";
    if (xp >= 1000) return "LEVEL 4 — Entanglement Specialist";
    if (xp >= 600) return "LEVEL 3 — Superposition Master";
    if (xp >= 300) return "LEVEL 2 — Qubit Explorer";
    return "LEVEL 1 — Quantum Beginner";
  };

  const modifyStability = (amount: number) => {
    setQuantumStability(prev => {
      const next = Math.max(0, Math.min(100, prev + amount));
      if (next === 0 && quantumLives > 1) {
        setQuantumLives(l => l - 1);
        soundFx.playMissionStartExplosion();
        return 50;
      }
      return next;
    });
  };

  const unlockSkill = (skillId: string, cost: number) => {
    if (playerXP >= cost && !unlockedSkills.includes(skillId)) {
      setPlayerXP(prev => prev - cost);
      setUnlockedSkills(prev => [...prev, skillId]);
      soundFx.playObjectiveComplete();
    }
  };

  const toggleScanner = () => {
    setIsScannerActive(prev => !prev);
    soundFx.playHologramClick();
  };

  const triggerDash = () => {
    soundFx.playBasisShiftSound(true);
  };

  const takeSnapshot = () => {
    setSnapshotData({ basis: basisState, state: quantumState });
    soundFx.playHologramClick();
  };

  const restoreSnapshot = () => {
    if (snapshotData) {
      setBasisState(snapshotData.basis);
      setQuantumState(snapshotData.state);
      soundFx.playHologramClick();
    }
  };

  const gameStageMap: Record<GamePhase, GameStage> = {
    intro: "INTRO",
    playing: "PLAYING",
    paused: "PAUSED",
    complete: "COMPLETED",
    starting: "STARTING"
  };

  const gameStage: GameStage = gameStageMap[gamePhase] || "INTRO";

  const setGamePhase = (phase: GamePhase) => {
    setGamePhaseState(phase);
  };

  const setGameStage = (stage: GameStage) => {
    if (stage === "INTRO" || stage === "MENU_3D") setGamePhaseState("intro");
    else if (stage === "PLAYING") setGamePhaseState("playing");
    else if (stage === "PAUSED") setGamePhaseState("paused");
    else if (stage === "COMPLETED") setGamePhaseState("complete");
    else if (stage === "STARTING") setGamePhaseState("starting");
  };

  const bridgeActive = basisState === "X";

  useEffect(() => {
    if (gamePhase === "playing") {
      soundFx.playObjectiveComplete();
      soundFx.playQiVoiceChirp();
      if (OBJECTIVES[objectiveIndex]) {
        setQiMessage(OBJECTIVES[objectiveIndex].qiDialog);
      }
    }
  }, [objectiveIndex, gamePhase]);

  const measureZ = (): QuantumState => {
    let result: QuantumState;
    if (quantumState === "|0>") result = "|0>";
    else if (quantumState === "|1>") result = "|1>";
    else {
      result = Math.random() < 0.5 ? "|0>" : "|1>";
    }
    setQuantumState(result);
    soundFx.playHologramClick();
    return result;
  };

  const measureX = (): QuantumState => {
    let result: QuantumState;
    if (quantumState === "|+>") result = "|+>";
    else if (quantumState === "|->") result = "|->";
    else {
      result = Math.random() < 0.5 ? "|+>" : "|->";
    }
    setQuantumState(result);
    soundFx.playHologramClick();
    return result;
  };

  const quantumFlip = () => {
    soundFx.playHologramClick();
    setQuantumState(prev => {
      if (prev === "|0>") return "|1>";
      if (prev === "|1>") return "|0>";
      if (prev === "|+>") return "|->";
      return "|+>";
    });
  };

  const toggleBasis = () => {
    if (isTransitioningBasis) return;
    setIsTransitioningBasis(true);
    const nextBasis = basisState === "Z" ? "X" : "Z";

    soundFx.playBasisShiftSound(nextBasis === "X");

    setTimeout(() => {
      setBasisState(nextBasis);
      setIsTransitioningBasis(false);
    }, 400);
  };

  const advanceObjective = () => {
    if (objectiveIndex < OBJECTIVES.length - 1) {
      setObjectiveIndex(prev => prev + 1);
      setPlayerXP(prev => prev + 250);
    } else {
      setGamePhase("complete");
    }
  };

  const nextLevel = () => {
    if (levelIndex < GAME_LEVELS.length - 1) {
      setLevelIndex(prev => prev + 1);
      setPlayerXP(prev => prev + GAME_LEVELS[levelIndex].rewardXP);
      soundFx.playObjectiveComplete();
    }
  };

  const handleStartGame = (e?: React.MouseEvent | KeyboardEvent) => {
    if (e && e.preventDefault) e.preventDefault();

    setGamePhase("playing");
    soundFx.startAmbient();
    soundFx.playMissionStartExplosion();
  };

  const startMission = (e?: React.MouseEvent | KeyboardEvent) => {
    handleStartGame(e);
  };

  const restartGame = () => {
    setGamePhase("intro");
    setObjectiveIndex(0);
    setBasisState("Z");
    setQuantumState("|0>");
    setDoor1Unlocked(false);
    setIsEntangled(false);
    setIsEchoActive(false);
    setSnapshotData(null);
    setIsFractureOpen(false);
    setIsStormActive(false);
    setSuperpositionCollapsed(false);
    setQuantumCoherence(42);
    setHGateAngle(0);
    setTimeRemaining(600);
    setQuantumLives(3);
    setQuantumStability(82);
    setPlayerXP(1250);
    setLevelIndex(0);
  };

  return (
    <GameContext.Provider
      value={{
        gamePhase,
        setGamePhase,
        gameStage,
        setGameStage,
        basisState,
        setBasisState,
        toggleBasis,
        isTransitioningBasis,
        quantumState,
        setQuantumState,
        measureZ,
        measureX,
        quantumFlip,
        objectiveIndex,
        currentObjective: OBJECTIVES[objectiveIndex] || OBJECTIVES[0],
        advanceObjective,
        interactPrompt,
        setInteractPrompt,
        qiMessage,
        setQiMessage,
        quantumCoherence,
        setQuantumCoherence,
        door1Unlocked,
        setDoor1Unlocked,
        bridgeActive,
        hGateAngle,
        setHGateAngle,
        handleStartGame,
        startMission,
        restartGame,
        isPointerLocked,
        setIsPointerLocked,
        cursorMode,
        setCursorMode,
        toggleCursorMode,
        isEntangled,
        setIsEntangled,
        isEchoActive,
        setIsEchoActive,
        snapshotData,
        takeSnapshot,
        restoreSnapshot,
        isFractureOpen,
        setIsFractureOpen,
        isStormActive,
        setIsStormActive,
        superpositionCollapsed,
        setSuperpositionCollapsed,
        controlsRef,

        timeRemaining,
        quantumLives,
        quantumStability,
        playerXP,
        playerLevelTitle: getLevelTitle(playerXP),
        unlockedSkills,
        unlockSkill,
        isScannerActive,
        setIsScannerActive,
        toggleScanner,
        isWhatIfOpen,
        setIsWhatIfOpen,
        isSkillTreeOpen,
        setIsSkillTreeOpen,
        currentLevel: GAME_LEVELS[levelIndex] || GAME_LEVELS[0],
        levelIndex,
        setLevelIndex,
        nextLevel,
        enemies,
        bossHealth,
        bossPhase,
        triggerDash,
        modifyStability
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
};
