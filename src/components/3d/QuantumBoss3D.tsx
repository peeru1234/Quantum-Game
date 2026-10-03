import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface QuantumBoss3DProps {
  phase: number; // 1 to 5
  health: number; // 0 to 100
}

export const QuantumBoss3D: React.FC<QuantumBoss3DProps> = ({ phase }) => {
  const bossGroupRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (bossGroupRef.current) {
      bossGroupRef.current.rotation.y += delta * 0.4;
      bossGroupRef.current.position.y = 4 + Math.sin(state.clock.elapsedTime * 2) * 0.4;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x += delta * 1.2;
      outerRingRef.current.rotation.z += delta * 0.8;
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y -= delta * 2;
    }
  });

  let phaseColor = "#00f3ff";
  if (phase === 2) phaseColor = "#ff007f";
  else if (phase === 3) phaseColor = "#a855f7";
  else if (phase === 4) phaseColor = "#ef4444";
  else if (phase === 5) phaseColor = "#f59e0b";

  return (
    <group ref={bossGroupRef} position={[0, 4, -45]}>
      {/* Outer Rotating Shield Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[3.2, 0.15, 16, 64]} />
        <meshStandardMaterial
          color={phaseColor}
          emissive={phaseColor}
          emissiveIntensity={1.2}
          wireframe
        />
      </mesh>

      {/* Inner Crystalline Core */}
      <mesh ref={innerCoreRef} castShadow>
        <octahedronGeometry args={[1.8, 0]} />
        <meshStandardMaterial
          color={phaseColor}
          emissive={phaseColor}
          emissiveIntensity={1.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Ambient Boss Light */}
      <pointLight color={phaseColor} intensity={5} distance={15} />
    </group>
  );
};
