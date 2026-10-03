import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { soundFx } from '../../audio/SoundSystem';
import { Interactable3DPrompt } from './Interactable3DPrompt';
import { interactionSystem } from '../../game/InteractionSystem';

export const QuantumEcho3D: React.FC = () => {
  const { isEchoActive, setIsEchoActive, setInteractPrompt } = useGame();
  const echoMeshRef = useRef<THREE.Mesh>(null);
  const echoPos = new THREE.Vector3(-3.5, 1.2, -15);
  const activeTargetId = interactionSystem.getActiveTarget()?.id || null;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (echoMeshRef.current && isEchoActive) {
      echoMeshRef.current.position.y = 1.6 + Math.sin(t * 3) * 0.15;
      echoMeshRef.current.rotation.y = t * 1.5;
    }
  });

  const handleEchoClick = () => {
    soundFx.playHologramClick();
    setIsEchoActive(!isEchoActive);
  };

  React.useEffect(() => {
    interactionSystem.register({
      id: 'quantum-echo',
      position: echoPos,
      interactionDistance: 4.5,
      prompt: isEchoActive ? '[E] DEACTIVATE QUANTUM ECHO' : '[E] RECORD QUANTUM ECHO SILHOUETTE',
      onInteract: handleEchoClick
    });
  }, [isEchoActive]);

  return (
    <group position={[-3.5, 1.2, -15]}>
      {/* Echo Terminal */}
      <mesh
        onPointerOver={() => setInteractPrompt('[E] QUANTUM ECHO STATION')}
        onPointerOut={() => setInteractPrompt(null)}
        onClick={handleEchoClick}
      >
        <boxGeometry args={[1.2, 1.4, 0.5]} />
        <meshStandardMaterial color="#00f3ff" metalness={0.8} />
      </mesh>

      <Text fontSize={0.18} color="#00f3ff" position={[0, 0.9, 0]} anchorX="center">
        QUANTUM ECHO
      </Text>

      <Interactable3DPrompt
        position={[0, 1.2, 0]}
        text={isEchoActive ? '[E] ECHO ACTIVE' : '[E] RECORD ECHO'}
        visible={activeTargetId === 'quantum-echo'}
      />

      {/* Translucent Holographic Silhouette */}
      {isEchoActive && (
        <mesh ref={echoMeshRef} position={[1.5, 0.4, 0]}>
          <capsuleGeometry args={[0.35, 1.2, 8, 16]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.5} wireframe />
        </mesh>
      )}
    </group>
  );
};
