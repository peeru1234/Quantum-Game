import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';

export const BasisStorm3D: React.FC = () => {
  const { toggleBasis } = useGame();
  const ringRef = useRef<THREE.Mesh>(null);
  const timerRef = useRef<number>(0);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 2;
      ringRef.current.rotation.x = t * 1.5;
    }

    // Auto-pulse basis shift every 5 seconds inside storm zone
    timerRef.current += delta;
    if (timerRef.current > 5.0) {
      timerRef.current = 0;
      toggleBasis();
    }
  });

  return (
    <group position={[0, 2.5, -24]}>
      {/* Storm Energy Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[3.2, 0.08, 16, 64]} />
        <meshBasicMaterial color="#ff00a0" transparent opacity={0.7} />
      </mesh>

      <Text fontSize={0.25} color="#ff00a0" position={[0, 2.2, 0]} anchorX="center">
        BASIS STORM ZONE (AUTO-PULSE)
      </Text>
    </group>
  );
};
