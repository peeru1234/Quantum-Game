import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';

export const QICompanion3D: React.FC<{ position?: [number, number, number] }> = ({ position = [1.2, 1.8, -2] }) => {
  const { basisState } = useGame();
  const orbRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const eyeRef = useRef<THREE.Mesh>(null);

  const glowColor = basisState === 'Z' ? '#00f3ff' : '#ff00a0';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (orbRef.current) {
      orbRef.current.position.y = position[1] + Math.sin(t * 2.5) * 0.12;
      orbRef.current.position.x = position[0] + Math.cos(t * 1.8) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 2;
      ringRef.current.rotation.y = t * 1.5;
    }
    if (eyeRef.current) {
      (eyeRef.current.material as THREE.MeshBasicMaterial).opacity = 0.7 + Math.sin(t * 6) * 0.3;
    }
  });

  return (
    <group ref={orbRef} position={position}>
      {/* Central Robot Core Orb */}
      <mesh>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#0c192c" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Holographic Glowing Eye */}
      <mesh ref={eyeRef} position={[0, 0, 0.22]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.9} />
      </mesh>

      {/* Hovering Gyroscope Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.38, 0.015, 16, 32]} />
        <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={0.6} />
      </mesh>

      {/* Hologram Light Cone pointing down */}
      <mesh position={[0, -0.4, 0.1]} rotation={[Math.PI / 6, 0, 0]}>
        <coneGeometry args={[0.3, 0.8, 16, 1, true]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      <pointLight color={glowColor} intensity={1.5} distance={3} />
    </group>
  );
};
