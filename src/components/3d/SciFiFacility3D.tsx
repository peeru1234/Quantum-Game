import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { soundFx } from '../../audio/SoundSystem';
import { interactionSystem } from '../../game/InteractionSystem';
import { Interactable3DPrompt } from './Interactable3DPrompt';
import { SuperpositionRoom3D } from './SuperpositionRoom3D';
import { QuantumEcho3D } from './QuantumEcho3D';
import { RealityFracture3D } from './RealityFracture3D';
import { QuantumSnapshot3D } from './QuantumSnapshot3D';
import { BasisStorm3D } from './BasisStorm3D';
import { QuantumEnemies3D } from './QuantumEnemies3D';
import { QuantumBoss3D } from './QuantumBoss3D';

export const SciFiFacility3D: React.FC = () => {
  const {
    basisState,
    quantumState,
    measureZ,
    measureX,
    quantumFlip,
    objectiveIndex,
    advanceObjective,
    door1Unlocked,
    setDoor1Unlocked,
    bridgeActive,
    setInteractPrompt,
    hGateAngle,
    setHGateAngle,
    enemies,
    bossPhase,
    bossHealth
  } = useGame();

  const doorRef = useRef<THREE.Group>(null);
  const bridgeRef = useRef<THREE.Group>(null);
  const core1Ref = useRef<THREE.Mesh>(null);
  const core2Ref = useRef<THREE.Mesh>(null);

  const flipPos = new THREE.Vector3(-4, 1.2, -3);
  const zMeasurePos = new THREE.Vector3(4, 1.2, -3);
  const doorPos = new THREE.Vector3(0, 2, -9);
  const xMeasurePos = new THREE.Vector3(-3, 1.5, -29);
  const hGatePos = new THREE.Vector3(3, 1.5, -29);
  const finalShiftPos = new THREE.Vector3(0, 1.0, -30);

  const activeTargetId = interactionSystem.getActiveTarget()?.id || null;

  const handleFlipClick = () => {
    soundFx.playHologramClick();
    quantumFlip();
  };

  const handleZMeasureClick = () => {
    soundFx.playHologramClick();
    const res = measureZ();
    if (res === "|1>" && objectiveIndex === 0) {
      setDoor1Unlocked(true);
    }
  };

  const handleDoorClick = () => {
    if (quantumState === "|1>" && basisState === "Z") {
      setDoor1Unlocked(true);
      if (objectiveIndex === 0) advanceObjective();
      soundFx.playObjectiveComplete();
    }
  };

  const handleXMeasureClick = () => {
    soundFx.playHologramClick();
    const res = measureX();
    if (objectiveIndex === 3) {
      advanceObjective();
    }
  };

  const handleHGateClick = () => {
    soundFx.playHologramClick();
    setHGateAngle((prev) => {
      const next = (prev + 45) % 360;
      if (next === 180 || next === 0) {
        if (objectiveIndex === 3) advanceObjective();
      }
      return next;
    });
  };

  const handleFinalShift = () => {
    soundFx.playMissionStartExplosion();
    advanceObjective();
  };

  // Register interactables into center-screen raycast system
  useEffect(() => {
    interactionSystem.register({
      id: 'quantum-flip',
      position: flipPos,
      interactionDistance: 4.5,
      prompt: '[E] QUANTUM FLIP (|0> ↔ |1>)',
      onInteract: handleFlipClick
    });

    interactionSystem.register({
      id: 'z-measure',
      position: zMeasurePos,
      interactionDistance: 4.5,
      prompt: '[E] MEASURE IN Z-BASIS',
      onInteract: handleZMeasureClick
    });

    interactionSystem.register({
      id: 'door-01',
      position: doorPos,
      interactionDistance: 4.5,
      prompt: door1Unlocked ? '[E] DOOR UNLOCKED' : '[E] UNLOCK DOOR 01 (REQ: Z-BASIS + |1>)',
      onInteract: handleDoorClick
    });

    interactionSystem.register({
      id: 'x-measure',
      position: xMeasurePos,
      interactionDistance: 4.5,
      prompt: '[E] MEASURE CORE 2 IN X-BASIS',
      onInteract: handleXMeasureClick
    });

    interactionSystem.register({
      id: 'h-gate',
      position: hGatePos,
      interactionDistance: 4.5,
      prompt: `[E] ROTATE HADAMARD GATE (${hGateAngle}°)`,
      onInteract: handleHGateClick
    });

    if (objectiveIndex >= 3) {
      interactionSystem.register({
        id: 'final-shift',
        position: finalShiftPos,
        interactionDistance: 4.5,
        prompt: '[E] INITIATE QUANTUM SHIFT',
        onInteract: handleFinalShift
      });
    }

    return () => {
      interactionSystem.clear();
    };
  }, [quantumState, basisState, door1Unlocked, objectiveIndex, hGateAngle]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (core1Ref.current) {
      core1Ref.current.rotation.y = t * 0.8;
      core1Ref.current.rotation.z = t * 0.4;
    }

    if (core2Ref.current) {
      core2Ref.current.rotation.x = -t * 1.2;
      core2Ref.current.rotation.y = t * 1.5;
    }

    if (doorRef.current) {
      const targetY = door1Unlocked ? 4.5 : 2;
      doorRef.current.position.y = THREE.MathUtils.lerp(doorRef.current.position.y, targetY, 0.08);
    }

    if (bridgeRef.current) {
      const targetScaleZ = bridgeActive ? 1 : 0;
      bridgeRef.current.scale.z = THREE.MathUtils.lerp(bridgeRef.current.scale.z, targetScaleZ, 0.1);
    }
  });

  return (
    <group>
      {/* Lights & Atmosphere */}
      <ambientLight intensity={basisState === 'Z' ? 0.4 : 0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} color={basisState === 'Z' ? '#00f3ff' : '#ff00a0'} />
      <directionalLight position={[-5, 10, -20]} intensity={0.6} color={basisState === 'Z' ? '#0066ff' : '#9d00ff'} />

      {/* Main Floor Corridor */}
      <mesh position={[0, 0, -20]} receiveShadow>
        <planeGeometry args={[14, 55]} />
        <meshStandardMaterial
          color={basisState === 'Z' ? '#080c16' : '#14081a'}
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>

      {/* Seam Grid Lines */}
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh key={i} position={[0, 0.01, 5 - i * 3]}>
          <planeGeometry args={[13.8, 0.05]} />
          <meshBasicMaterial color={basisState === 'Z' ? '#00f3ff' : '#ff00a0'} transparent opacity={0.3} />
        </mesh>
      ))}

      {/* Walls */}
      <mesh position={[-7, 4, -20]}>
        <boxGeometry args={[0.4, 8, 55]} />
        <meshStandardMaterial color={basisState === 'Z' ? '#0c1220' : '#1c0c24'} metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[7, 4, -20]}>
        <boxGeometry args={[0.4, 8, 55]} />
        <meshStandardMaterial color={basisState === 'Z' ? '#0c1220' : '#1c0c24'} metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Neon Strips */}
      <mesh position={[-6.75, 4.5, -20]}>
        <boxGeometry args={[0.1, 0.15, 55]} />
        <meshBasicMaterial color={basisState === 'Z' ? '#00f3ff' : '#ff00a0'} />
      </mesh>
      <mesh position={[6.75, 4.5, -20]}>
        <boxGeometry args={[0.1, 0.15, 55]} />
        <meshBasicMaterial color={basisState === 'Z' ? '#00f3ff' : '#ff00a0'} />
      </mesh>

      {/* ZONE 1: CORE 1 & FLIP / MEASURE STATIONS */}
      <group position={[0, 2, -5]}>
        <mesh ref={core1Ref}>
          <octahedronGeometry args={[1.2, 2]} />
          <meshStandardMaterial
            color={basisState === 'Z' ? '#00f3ff' : '#ff00a0'}
            metalness={0.9}
            roughness={0.1}
            emissive={basisState === 'Z' ? '#00f3ff' : '#ff00a0'}
            emissiveIntensity={0.5}
          />
        </mesh>
        <Text
          fontSize={0.4}
          color="#ffffff"
          position={[0, 1.8, 0]}
          anchorX="center"
        >
          CORE 01: {quantumState}
        </Text>
      </group>

      {/* Quantum Snapshot Station */}
      <QuantumSnapshot3D />

      {/* Quantum Flip Device Station */}
      <group position={[-4, 1.2, -3]}>
        <mesh
          onPointerOver={() => setInteractPrompt('[E] QUANTUM FLIP (|0> ↔ |1>)')}
          onPointerOut={() => setInteractPrompt(null)}
          onClick={handleFlipClick}
        >
          <boxGeometry args={[1.2, 1.6, 1.2]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
        </mesh>
        <Interactable3DPrompt
          position={[0, 1.3, 0]}
          text="[E] QUANTUM FLIP"
          visible={activeTargetId === 'quantum-flip'}
        />
      </group>

      {/* Z Measurement Machine */}
      <group position={[4, 1.2, -3]}>
        <mesh
          onPointerOver={() => setInteractPrompt('[E] MEASURE IN Z-BASIS')}
          onPointerOut={() => setInteractPrompt(null)}
          onClick={handleZMeasureClick}
        >
          <cylinderGeometry args={[0.8, 0.9, 1.6, 32]} />
          <meshStandardMaterial color="#0066ff" metalness={0.8} roughness={0.2} />
        </mesh>
        <Interactable3DPrompt
          position={[0, 1.3, 0]}
          text="[E] MEASURE Z"
          visible={activeTargetId === 'z-measure'}
        />
      </group>

      {/* Door 01 */}
      <group ref={doorRef} position={[0, 2, -9]}>
        <mesh
          onPointerOver={() => {
            if (!door1Unlocked) setInteractPrompt('[E] UNLOCK DOOR 01 (REQ: Z-BASIS + |1>)');
          }}
          onPointerOut={() => setInteractPrompt(null)}
          onClick={handleDoorClick}
        >
          <boxGeometry args={[6, 4, 0.4]} />
          <meshStandardMaterial
            color={door1Unlocked ? '#00ffaa' : '#ff0033'}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        <Text
          fontSize={0.3}
          color="#ffffff"
          position={[0, 0, 0.25]}
          anchorX="center"
        >
          {door1Unlocked ? 'DOOR 01: UNLOCKED' : 'DOOR 01: REQ Z-BASIS & |1>'}
        </Text>
        <Interactable3DPrompt
          position={[0, 1.8, 0.3]}
          text={door1Unlocked ? '[E] UNLOCKED' : '[E] UNLOCK DOOR'}
          visible={activeTargetId === 'door-01'}
        />
      </group>

      {/* ZONE 2: ADVANCED QUANTUM FEATURES */}
      <QuantumEcho3D />
      <RealityFracture3D />
      <SuperpositionRoom3D />

      {/* QUANTUM ENEMIES & BOSS ENCOUNTER */}
      <QuantumEnemies3D enemies={enemies} />
      <QuantumBoss3D phase={bossPhase} health={bossHealth} />

      {/* ZONE 3: ABYSS & QUANTUM BRIDGE */}
      <mesh position={[0, -0.1, -18]}>
        <boxGeometry args={[14, 0.2, 8]} />
        <meshBasicMaterial color="#02040a" />
      </mesh>

      <group ref={bridgeRef} position={[0, 0, -18]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4, 0.3, 8]} />
          <meshStandardMaterial
            color="#ff00a0"
            emissive="#ff00a0"
            emissiveIntensity={0.6}
            transparent
            opacity={bridgeActive ? 0.9 : 0.1}
          />
        </mesh>
        <Text
          fontSize={0.22}
          color="#ffffff"
          position={[0, 0.3, 0]}
          anchorX="center"
        >
          {bridgeActive ? 'QUANTUM BRIDGE ACTIVE [X-BASIS]' : 'BRIDGE ABSENT IN Z-BASIS'}
        </Text>
      </group>

      {/* Basis Storm Zone */}
      <BasisStorm3D />

      {/* ZONE 4: HADAMARD CORE & X MEASURE */}
      <group position={[0, 2.5, -32]}>
        <mesh ref={core2Ref}>
          <torusGeometry args={[2.5, 0.3, 16, 64]} />
          <meshStandardMaterial
            color="#ff00a0"
            metalness={0.9}
            emissive="#ff00a0"
            emissiveIntensity={0.5}
          />
        </mesh>

        <Text
          fontSize={0.35}
          color="#ffffff"
          position={[0, 2, 0]}
          anchorX="center"
        >
          {"CORE 02: superposition |+>"}
        </Text>

        {/* X Measurement Station */}
        <group position={[-3, -1, 3]}>
          <mesh
            onPointerOver={() => setInteractPrompt('[E] MEASURE CORE 2 IN X-BASIS')}
            onPointerOut={() => setInteractPrompt(null)}
            onClick={handleXMeasureClick}
          >
            <boxGeometry args={[1.5, 1.2, 1]} />
            <meshStandardMaterial color="#9d00ff" metalness={0.8} />
          </mesh>
          <Interactable3DPrompt
            position={[0, 1.1, 0]}
            text="[E] MEASURE X"
            visible={activeTargetId === 'x-measure'}
          />
        </group>

        {/* Hadamard Control Gate */}
        <group position={[3, -1, 3]}>
          <mesh
            onPointerOver={() => setInteractPrompt('[E] ROTATE HADAMARD GATE')}
            onPointerOut={() => setInteractPrompt(null)}
            onClick={handleHGateClick}
          >
            <boxGeometry args={[1.5, 1.2, 1]} />
            <meshStandardMaterial color="#00f3ff" metalness={0.8} />
          </mesh>
          <Interactable3DPrompt
            position={[0, 1.1, 0]}
            text={`[E] H-GATE (${hGateAngle}°)`}
            visible={activeTargetId === 'h-gate'}
          />
        </group>

        {/* Final Shift Activation Pedestal */}
        {objectiveIndex >= 3 && (
          <group position={[0, -1.5, 2]}>
            <mesh
              onPointerOver={() => setInteractPrompt('[E] INITIATE QUANTUM SHIFT')}
              onPointerOut={() => setInteractPrompt(null)}
              onClick={handleFinalShift}
            >
              <cylinderGeometry args={[1.6, 1.8, 0.4, 32]} />
              <meshBasicMaterial color="#ff00a0" />
            </mesh>
            <Interactable3DPrompt
              position={[0, 0.8, 0]}
              text="[E] TRIGGER SHIFT"
              visible={activeTargetId === 'final-shift'}
            />
          </group>
        )}
      </group>
    </group>
  );
};
