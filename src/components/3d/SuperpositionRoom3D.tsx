import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { soundFx } from '../../audio/SoundSystem';
import { Interactable3DPrompt } from './Interactable3DPrompt';
import { interactionSystem } from '../../game/InteractionSystem';

export const SuperpositionRoom3D: React.FC = () => {
  const { superpositionCollapsed, setSuperpositionCollapsed, basisState, setInteractPrompt } = useGame();
  const roomMeshA = useRef<THREE.Mesh>(null);
  const roomMeshB = useRef<THREE.Mesh>(null);

  const roomPos = new THREE.Vector3(0, 1.5, -20);
  const activeTargetId = interactionSystem.getActiveTarget()?.id || null;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!superpositionCollapsed) {
      if (roomMeshA.current) {
        (roomMeshA.current.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.sin(t * 4) * 0.15;
      }
      if (roomMeshB.current) {
        (roomMeshB.current.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.cos(t * 4) * 0.15;
      }
    } else {
      if (roomMeshA.current) {
        (roomMeshA.current.material as THREE.MeshBasicMaterial).opacity = basisState === 'Z' ? 0.9 : 0.1;
      }
      if (roomMeshB.current) {
        (roomMeshB.current.material as THREE.MeshBasicMaterial).opacity = basisState === 'X' ? 0.9 : 0.1;
      }
    }
  });

  const handleCollapseClick = () => {
    soundFx.playHologramClick();
    setSuperpositionCollapsed(true);
  };

  React.useEffect(() => {
    interactionSystem.register({
      id: 'superposition-room',
      position: roomPos,
      interactionDistance: 4.5,
      prompt: superpositionCollapsed ? '[E] SUPERPOSITION COLLAPSED' : '[E] OBSERVE & COLLAPSE ROOM SUPERPOSITION',
      onInteract: handleCollapseClick
    });
  }, [superpositionCollapsed]);

  return (
    <group position={[0, 0, 0]}>
      {/* Superposition Reality A (Door Left, Bridge Right) */}
      <mesh ref={roomMeshA} position={[-2, 2, -20]}>
        <boxGeometry args={[3, 4, 0.3]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.4} wireframe={!superpositionCollapsed} />
      </mesh>

      {/* Superposition Reality B (Door Right, Bridge Left) */}
      <mesh ref={roomMeshB} position={[2, 2, -20]}>
        <boxGeometry args={[3, 4, 0.3]} />
        <meshBasicMaterial color="#ff00a0" transparent opacity={0.4} wireframe={!superpositionCollapsed} />
      </mesh>

      {/* Observation Terminal */}
      <group position={[0, 1.2, -19]}>
        <mesh
          onPointerOver={() => setInteractPrompt('[E] OBSERVE SUPERPOSITION')}
          onPointerOut={() => setInteractPrompt(null)}
          onClick={handleCollapseClick}
        >
          <cylinderGeometry args={[0.6, 0.7, 1.2, 32]} />
          <meshStandardMaterial color="#9d00ff" metalness={0.8} />
        </mesh>

        <Text fontSize={0.2} color="#ffffff" position={[0, 0.9, 0]} anchorX="center">
          SUPERPOSITION ROOM
        </Text>

        <Interactable3DPrompt
          position={[0, 1.2, 0]}
          text={superpositionCollapsed ? '[E] COLLAPSED' : '[E] COLLAPSE REALITIES'}
          visible={activeTargetId === 'superposition-room'}
        />
      </group>
    </group>
  );
};
