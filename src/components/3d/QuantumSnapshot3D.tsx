import React from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { Interactable3DPrompt } from './Interactable3DPrompt';
import { interactionSystem } from '../../game/InteractionSystem';

export const QuantumSnapshot3D: React.FC = () => {
  const { snapshotData, takeSnapshot, restoreSnapshot, setInteractPrompt } = useGame();
  const snapshotPos = new THREE.Vector3(0, 1.2, -7.5);
  const activeTargetId = interactionSystem.getActiveTarget()?.id || null;

  const handleSnapshotClick = () => {
    if (!snapshotData) {
      takeSnapshot();
    } else {
      restoreSnapshot();
    }
  };

  React.useEffect(() => {
    interactionSystem.register({
      id: 'quantum-snapshot',
      position: snapshotPos,
      interactionDistance: 4.5,
      prompt: !snapshotData ? '[E] TAKE QUANTUM SNAPSHOT' : `[E] RESTORE SNAPSHOT (${snapshotData.basis} / ${snapshotData.state})`,
      onInteract: handleSnapshotClick
    });
  }, [snapshotData]);

  return (
    <group position={[0, 1.2, -7.5]}>
      <mesh
        onPointerOver={() => setInteractPrompt('[E] QUANTUM SNAPSHOT DEVICE')}
        onPointerOut={() => setInteractPrompt(null)}
        onClick={handleSnapshotClick}
      >
        <boxGeometry args={[1.0, 1.2, 0.4]} />
        <meshStandardMaterial color={snapshotData ? '#00ffaa' : '#0066ff'} metalness={0.8} />
      </mesh>

      <Text fontSize={0.16} color="#ffffff" position={[0, 0.8, 0]} anchorX="center">
        {!snapshotData ? 'SNAPSHOT: EMPTY' : `SAVED: ${snapshotData.basis} ${snapshotData.state}`}
      </Text>

      <Interactable3DPrompt
        position={[0, 1.1, 0]}
        text={!snapshotData ? '[E] TAKE SNAPSHOT' : '[E] RESTORE STATE'}
        visible={activeTargetId === 'quantum-snapshot'}
      />
    </group>
  );
};
