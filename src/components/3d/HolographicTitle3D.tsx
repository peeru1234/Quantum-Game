import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export const HolographicTitle3D: React.FC<{ position?: [number, number, number] }> = ({ position = [0, 3.2, -5] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const textRef1 = useRef<THREE.Mesh>(null);
  const textRef2 = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.08;
    }
    if (textRef1.current) {
      (textRef1.current.material as THREE.MeshBasicMaterial).opacity = 0.85 + Math.sin(t * 8) * 0.15;
    }
    if (textRef2.current) {
      (textRef2.current.material as THREE.MeshBasicMaterial).opacity = 0.85 + Math.cos(t * 6) * 0.15;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 3 + Math.sin(t * 4) * 1.5;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Dynamic Point Light */}
      <pointLight ref={lightRef} color="#00f3ff" intensity={4} distance={8} />

      {/* Main Title: Q-BREAK */}
      <Text
        ref={textRef1}
        fontSize={1.2}
        letterSpacing={0.15}
        color="#00f3ff"
        anchorX="center"
        anchorY="middle"
        position={[0, 0.6, 0]}
      >
        Q-BREAK
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.9} />
      </Text>

      {/* Glow shadow layer for Q-BREAK */}
      <Text
        fontSize={1.24}
        letterSpacing={0.15}
        color="#9d00ff"
        anchorX="center"
        anchorY="middle"
        position={[0, 0.6, -0.05]}
      >
        Q-BREAK
        <meshBasicMaterial color="#9d00ff" transparent opacity={0.5} wireframe />
      </Text>

      {/* Subtitle: QUANTUM SHIFT */}
      <Text
        ref={textRef2}
        fontSize={0.48}
        letterSpacing={0.3}
        color="#ff00a0"
        anchorX="center"
        anchorY="middle"
        position={[0, -0.2, 0]}
      >
        QUANTUM SHIFT
        <meshBasicMaterial color="#ff00a0" transparent opacity={0.9} />
      </Text>

      {/* Hologram Scan Line Projection Rings */}
      <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.55, 32]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.23, 32]} />
        <meshBasicMaterial color="#ff00a0" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
