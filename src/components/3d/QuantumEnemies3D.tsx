import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { QuantumEnemy } from '../../types/quantum';

interface QuantumEnemies3DProps {
  enemies: QuantumEnemy[];
  onAttackPlayer?: (damage: number) => void;
}

export const QuantumEnemies3D: React.FC<QuantumEnemies3DProps> = ({ enemies }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, index) => {
      const enemy = enemies[index];
      if (!enemy) return;

      // Idle float & rotation animation
      child.rotation.y += delta * 1.5;

      if (enemy.type === "PHANTOM") {
        child.position.y = enemy.position[1] + Math.sin(state.clock.elapsedTime * 3 + index) * 0.3;
      } else if (enemy.type === "VIRUS") {
        child.rotation.x += delta * 2;
        child.rotation.z += delta * 2;
      } else if (enemy.type === "GLITCH") {
        child.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 10) * 0.15);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {enemies.map(enemy => {
        let color = "#00f3ff";
        if (enemy.type === "PHANTOM") color = "#ff007f";
        else if (enemy.type === "GUARDIAN") color = "#a855f7";
        else if (enemy.type === "VIRUS") color = "#ef4444";
        else if (enemy.type === "HUNTER") color = "#f59e0b";
        else if (enemy.type === "GLITCH") color = "#10b981";

        return (
          <group key={enemy.id} position={enemy.position}>
            {/* Enemy Core Sphere */}
            <mesh castShadow>
              <icosahedronGeometry args={[0.6, 2]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.8}
                wireframe={enemy.type === "GLITCH" || enemy.type === "PHANTOM"}
                transparent
                opacity={0.85}
              />
            </mesh>

            {/* Orbit Ring */}
            <mesh rotation-x={Math.PI / 3}>
              <torusGeometry args={[0.9, 0.04, 16, 32]} />
              <meshBasicMaterial color={color} wireframe />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
