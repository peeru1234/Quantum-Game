export type BasisState = "Z" | "X";
export type QuantumStateStr = "|0>" | "|1>" | "|+>" | "|->";

export interface QubitState {
  id: string;
  alpha: number; // Amplitude for |0>
  beta: number;  // Amplitude for |1>
  phase: number;
  entangledWith?: string;
  stability: number;
}

export interface QuantumEnemy {
  id: string;
  name: string;
  type: "PHANTOM" | "GUARDIAN" | "VIRUS" | "HUNTER" | "GLITCH";
  position: [number, number, number];
  health: number;
  maxHealth: number;
  state: QuantumStateStr;
  basis: BasisState;
  isObserved: boolean;
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  costXP: number;
  unlocked: boolean;
  icon: string;
  requires?: string;
}

export interface LevelDefinition {
  id: number;
  title: string;
  subtitle: string;
  location: string;
  concept: string;
  description: string;
  targetObjective: string;
  rewardXP: number;
}

export const GAME_LEVELS: LevelDefinition[] = [
  {
    id: 1,
    title: "LEVEL 1 — QUANTUM LAB",
    subtitle: "Qubit Fundamentals & Z-Basis Measurement",
    location: "Sector A: Research Vault",
    concept: "Qubits, 0 & 1, Measurement, Computational Basis",
    description: "Identify correct qubit states and flip state |0⟩ to |1⟩ using the Z-Basis matrix operator to clear Vault Door 01.",
    targetObjective: "Flip Quantum Core to |1⟩ & Unlock Door 01",
    rewardXP: 250
  },
  {
    id: 2,
    title: "LEVEL 2 — SUPERPOSITION CITY",
    subtitle: "Wave Function & Probability Matrices",
    location: "Sector B: Multi-State Atrium",
    concept: "Superposition |+⟩, Probability, Measurement Collapse",
    description: "Platforms exist in simultaneous multi-spatial coordinates. Shift reality to X-basis to materialize structural particle bridges.",
    targetObjective: "Materialize Quantum Bridge in Superposition",
    rewardXP: 500
  },
  {
    id: 3,
    title: "LEVEL 3 — ENTANGLEMENT CHAMBER",
    subtitle: "Correlated Spooky Action at a Distance",
    location: "Sector C: Entanglement Spire",
    concept: "Quantum Entanglement, Bell State |Φ+⟩, Spooky Correlation",
    description: "Two distant quantum switches are entangled. Manipulate particle A to synchronously adjust twin particle B.",
    targetObjective: "Synchronize Entangled Bell Pair",
    rewardXP: 750
  },
  {
    id: 4,
    title: "LEVEL 4 — QUANTUM COMPUTER",
    subtitle: "Logic Gates & Circuit Construction",
    location: "Sector D: Mainframe Processing Core",
    concept: "Quantum Gates: X (NOT), H (Hadamard), Z (Phase), CNOT",
    description: "Construct a valid quantum circuit pipeline to transform initial state |0⟩ into target superposition state |+⟩.",
    targetObjective: "Assemble Hadamard + CNOT Quantum Circuit",
    rewardXP: 1000
  },
  {
    id: 5,
    title: "LEVEL 5 — QUANTUM BATTLEFIELD",
    subtitle: "Decoherence & Anomaly Mitigation",
    location: "Sector E: Anomalous Containment Grid",
    concept: "Decoherence Virus, Phantoms, Measurement Hunters",
    description: "Anomalous quantum entities threaten reactor stability. Utilize Quantum Scanner, Dash, and Collapse abilities to neutralize hostiles.",
    targetObjective: "Purge Decoherence Viruses & Superposition Phantoms",
    rewardXP: 1500
  },
  {
    id: 6,
    title: "LEVEL 6 — QUANTUM SINGULARITY",
    subtitle: "The Quantum Core Reactor Stabilization",
    location: "Sector F: Quantum Reactor Core",
    concept: "Mastery of all Quantum Mechanics Concepts & Boss Defense",
    description: "Face The Quantum Guardian boss across 5 phases of shifting quantum realities and permanently stabilize the Quantum Core.",
    targetObjective: "Defeat Quantum Guardian & Stabilize Core",
    rewardXP: 2500
  }
];

export const SKILL_TREE_DATA: SkillNode[] = [
  {
    id: "dash",
    name: "Quantum Dash",
    description: "Teleport a short distance through quantum space-time [B].",
    costXP: 200,
    unlocked: true,
    icon: "Zap"
  },
  {
    id: "scanner",
    name: "Quantum Scanner",
    description: "Analyze qubit amplitudes, probabilities, and entanglement [G].",
    costXP: 300,
    unlocked: true,
    icon: "Scan"
  },
  {
    id: "echo",
    name: "Superposition Echo",
    description: "Create a dual projection clone to press distant triggers [C].",
    costXP: 400,
    unlocked: true,
    icon: "Copy"
  },
  {
    id: "snapshot",
    name: "Quantum Snapshot",
    description: "Save and rewind your exact quantum basis state [R].",
    costXP: 500,
    unlocked: false,
    icon: "Camera"
  },
  {
    id: "fracture",
    name: "Reality Fracture",
    description: "Open a spatial rift shortcut across facility sectors [F].",
    costXP: 750,
    unlocked: false,
    icon: "Split"
  },
  {
    id: "probability",
    name: "Probability Shift",
    description: "Force wave-function collapse into favorable states [V].",
    costXP: 1000,
    unlocked: false,
    icon: "Sparkles"
  }
];
