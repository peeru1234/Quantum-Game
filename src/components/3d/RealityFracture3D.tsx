import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { soundFx } from '../../audio/SoundSystem';
import { Interactable3DPrompt } from './Interactable3DPrompt';
import { interactionSystem } from '../../game/InteractionSystem';

export const RealityFracture3D: React.FC = () => {
  const { isFractureOpen, setIsFractureOpen, setInteractPrompt } = useGame();
  const fractureRef = useRef<THREE.Mesh>(null);
  const fracturePos = new THREE.Vector3(3.5, 2.0, -15);
  const activeTargetId = interactionSystem.getActiveTarget()?.id || null;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (fractureRef.current) {
      fractureRef.current.rotation.y = t * 0.8;
      fractureRef.current.rotation.x = Math.sin(t * 1.2) * 0.2;
    }
  });

  const handleFractureClick = () => {
    soundFx.playHologramClick();
    setIsFractureOpen(!isFractureOpen);
  };

  React.useEffect(() => {
    interactionSystem.register({
      id: 'reality-fracture',
      position: fracturePos,
      interactionDistance: 4.5,
      prompt: isFractureOpen ? '[E] CLOSE REALITY FRACTURE' : '[E] ENTER REALITY FRACTURE',
      onInteract: handleFractureClick
    });
  }, [isFractureOpen]);

  return (
    <group position={[3.5, 2.0, -15]}>
      {/* Floating Geometric Crack Mesh */}
      <mesh
        ref={fractureRef}
        onPointerOver={() => setInteractPrompt('[E] REALITY FRACTURE')}
        onPointerOut={() => setInteractPrompt(null)}
        onClick={handleFractureClick}
      >
        <octahedronGeometry args={[0.9, 0]} />
        <meshBasicMaterial
          color={isFractureOpen ? '#ff00a0' : '#9d00ff'}
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>

      <Text fontSize={0.18} color="#ff00a0" position={[0, 1.2, 0]} anchorX="center">
        REALITY FRACTURE
      </Text>

      <Interactable3DPrompt
        position={[0, 1.5, 0]}
        text={isFractureOpen ? '[E] FRACTURE OPEN' : '[E] ENTER FRACTURE'}
        visible={activeTargetId === 'reality-fracture'}
      />

      {/* Alternate Pathway Portal Effect when open */}
      {isFractureOpen && (
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[2.5, 3.5]} />
          <meshBasicMaterial color="#ff00a0" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};
