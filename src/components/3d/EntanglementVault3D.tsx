import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { soundFx } from '../../audio/SoundSystem';

export const EntanglementVault3D: React.FC = () => {
  const { objectiveIndex, advanceObjective, setInteractPrompt, isEntangled, setIsEntangled } = useGame();
  const cubeARef = useRef<THREE.Mesh>(null);
  const bridgeBRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (cubeARef.current) {
      cubeARef.current.rotation.y = t * 0.8;
      if (isEntangled) {
        cubeARef.current.position.y = 1.4 + Math.sin(t * 3) * 0.2;
      }
    }

    if (bridgeBRef.current) {
      const targetZ = isEntangled ? -19 : -22;
      bridgeBRef.current.position.z = THREE.MathUtils.lerp(bridgeBRef.current.position.z, targetZ, 0.05);
    }
  });

  const handleEntangleClick = () => {
    if (objectiveIndex === 2) {
      soundFx.playEntangleSound();
      setIsEntangled(true);
      advanceObjective();
    }
  };

  return (
    <group position={[0, 0, 0]}>
      {/* Void Gap Floor Warning Lines */}
      <mesh position={[0, -0.05, -19]}>
        <boxGeometry args={[14, 0.1, 8]} />
        <meshStandardMaterial color="#02040a" roughness={0.9} />
      </mesh>

      {/* Quantum Block A on Control Platform */}
      <group position={[-3, 1.2, -16]}>
        <mesh
          ref={cubeARef}
          onPointerOver={() => {
            if (objectiveIndex === 2) setInteractPrompt('[E] ENTANGLE QUANTUM BLOCK A WITH BRIDGE B');
          }}
          onPointerOut={() => setInteractPrompt(null)}
          onClick={handleEntangleClick}
        >
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshStandardMaterial
            color={isEntangled ? '#ff00a0' : '#00f3ff'}
            metalness={0.9}
            roughness={0.1}
            emissive={isEntangled ? '#ff00a0' : '#00f3ff'}
            emissiveIntensity={0.4}
          />
        </mesh>

        <Text
          fontSize={0.2}
          color="#ffffff"
          position={[0, 1, 0]}
          anchorX="center"
        >
          BLOCK A {isEntangled ? '[ENTANGLED]' : '[DISCONNECTED]'}
        </Text>
      </group>

      {/* Kinetic Bridge B */}
      <group ref={bridgeBRef} position={[0, 0, -22]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4, 0.3, 8]} />
          <meshStandardMaterial
            color={isEntangled ? '#00f3ff' : '#1e293b'}
            metalness={0.8}
            roughness={0.2}
            emissive={isEntangled ? '#00f3ff' : '#000000'}
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Glowing Bridge Railings */}
        {[-1.95, 1.95].map((x, idx) => (
          <mesh key={idx} position={[x, 0.5, 0]}>
            <boxGeometry args={[0.1, 0.8, 8]} />
            <meshBasicMaterial color={isEntangled ? '#00f3ff' : '#334155'} transparent opacity={0.7} />
          </mesh>
        ))}

        <Text
          fontSize={0.22}
          color="#ffffff"
          position={[0, 0.3, 0]}
          anchorX="center"
        >
          KINETIC BRIDGE B
        </Text>
      </group>

      {/* Entanglement Energy Beam connecting Block A to Bridge B when active */}
      {isEntangled && (
        <mesh position={[-1.5, 1.2, -17.5]} rotation={[0, Math.PI / 4, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 5, 16]} />
          <meshBasicMaterial color="#ff00a0" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};
