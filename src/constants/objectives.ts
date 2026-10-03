export interface ObjectiveStep {
  id: number;
  main: string;
  sub: string;
  qiDialog: string;
}

export const OBJECTIVES: ObjectiveStep[] = [
  {
    id: 0,
    main: "FLIP QUANTUM CORE STATE & UNLOCK DOOR 01",
    sub: "Use Quantum Flip machine [E] to change state from |0> to |1>, measure in Z, then open door",
    qiDialog: "Door 01 requires Z-Basis and state |1>. Use the Quantum Flip device to flip |0> to |1>."
  },
  {
    id: 1,
    main: "CROSS THE QUANTUM ABYSS",
    sub: "Press [Q] to shift to X-Basis and materialize the Quantum Bridge across the gap",
    qiDialog: "The bridge is absent in Z-Basis! Press [Q] to shift reality to X-Basis to construct the particle bridge."
  },
  {
    id: 2,
    main: "NAVIGATE THE QUANTUM MAZE",
    sub: "Switch realities between Z and X to find open pathways through the maze",
    qiDialog: "Different barriers are solid in different bases. Keep shifting realities to find the path!"
  },
  {
    id: 3,
    main: "MEASURE SECOND CORE & ALIGN HADAMARD GATE",
    sub: "Measure Core 2 in X-Basis [E] and rotate Hadamard Gate to 100% coherence",
    qiDialog: "Core 2 is in superposition |+>. Measure it in X-Basis to lock its phase!"
  },
  {
    id: 4,
    main: "TRIGGER QUANTUM SHIFT",
    sub: "Enter the central Quantum Core Chamber and initiate final quantum jump!",
    qiDialog: "Coherence restored! Enter the Quantum Core ring and activate the Shift!"
  }
];
