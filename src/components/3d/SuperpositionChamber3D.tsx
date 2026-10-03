import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { soundFx } from '../../audio/SoundSystem';

export const SuperpositionChamber3D: React.FC = () => {
  const { basisState, objectiveIndex, advanceObjective, setInteractPrompt } = useGame();
  const barrierRef = useRef<THREE.Mesh>(null);
  const terminalRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (barrierRef.current) {
      const mat = barrierRef.current.material as THREE.MeshBasicMaterial;
      if (basisState === 'Z') {
        mat.opacity = 0.85 + Math.sin(t * 8) * 0.1;
      } else {
        mat.opacity = 0.25 + Math.sin(t * 4) * 0.05;
      }
    }
  });

  const handleTerminalClick = () => {
    if (objectiveIndex === 0) {
      soundFx.playHologramClick();
      soundFx.playMissionStartExplosion();
      advanceObjective();
    }
  };

  return (
    <group>
      {/* Primary Breaker Terminal (Objective 0) */}
      <group position={[-3.5, 1.2, -6]}>
        <mesh
          ref={terminalRef}
          position={[0, 0, 0]}
          onPointerOver={() => {
            if (objectiveIndex === 0) setInteractPrompt('[E] INITIALIZE FACILITY MATRIX');
          }}
          onPointerOut={() => setInteractPrompt(null)}
          onClick={handleTerminalClick}
        >
          <boxGeometry args={[1.2, 1.6, 0.4]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Console Screen Hologram */}
        <mesh position={[0, 0.2, 0.22]}>
          <planeGeometry args={[1.0, 0.8]} />
          <meshBasicMaterial color={objectiveIndex === 0 ? '#00f3ff' : '#00ffaa'} transparent opacity={0.8} />
        </mesh>

        <Text
          fontSize={0.14}
          color="#050714"
          position={[0, 0.2, 0.23]}
          anchorX="center"
        >
          {objectiveIndex === 0 ? '[E] POWER ON' : 'ONLINE'}
        </Text>
      </group>

      {/* Phase Barrier Gate Wall at Z = -12 */}
      <group position={[0, 2.5, -12]}>
        <mesh ref={barrierRef}>
          <boxGeometry args={[12, 5, 0.3]} />
          <meshBasicMaterial
            color={basisState === 'Z' ? '#ff0033' : '#00f3ff'}
            transparent
            opacity={basisState === 'Z' ? 0.85 : 0.2}
            wireframe={basisState === 'X'}
          />
        </mesh>

        {/* Phase Barrier Hologram Warning Sign */}
        <Text
          fontSize={0.35}
          color={basisState === 'Z' ? '#ffffff' : '#00f3ff'}
          position={[0, 0, 0.2]}
          anchorX="center"
        >
          {basisState === 'Z' ? 'QUANTUM PHASE LOCK [Z-BASIS]' : 'SUPERPOSITION PHASE OPEN [X-BASIS]'}
        </Text>

        <Text
          fontSize={0.2}
          color="#ffff00"
          position={[0, -0.6, 0.2]}
          anchorX="center"
        >
          {basisState === 'Z' ? 'PRESS [Q] TO SHIFT BASIS TO |X⟩' : 'PASSTHROUGH PERMITTED'}
        </Text>
      </group>
    </group>
  );
};
