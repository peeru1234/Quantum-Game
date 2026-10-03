import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { soundFx } from '../../audio/SoundSystem';

export const QuantumCore3D: React.FC<{ position?: [number, number, number] }> = ({ position = [0, 2.5, -28] }) => {
  const { objectiveIndex, advanceObjective, setInteractPrompt, hGateAngle, setHGateAngle, basisState } = useGame();

  const innerRingRef = useRef<THREE.Mesh>(null);
  const midRingRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const plasmaRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const laserBeamRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x = t * 1.2;
      innerRingRef.current.rotation.y = t * 0.8;
    }
    if (midRingRef.current) {
      midRingRef.current.rotation.y = -t * 1.5;
      midRingRef.current.rotation.z = t * 0.5;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = t * 0.6;
      outerRingRef.current.rotation.x = -t * 0.4;
    }
    if (plasmaRef.current) {
      const scale = 1.2 + Math.sin(t * 4) * 0.15;
      plasmaRef.current.scale.set(scale, scale, scale);
    }
    if (lightRef.current) {
      lightRef.current.intensity = 5 + Math.sin(t * 6) * 2.5;
    }

    if (laserBeamRef.current) {
      const beamMat = laserBeamRef.current.material as THREE.MeshBasicMaterial;
      beamMat.opacity = 0.6 + Math.sin(t * 10) * 0.3;
    }
  });

  const handleHGateClick = () => {
    if (objectiveIndex === 3) {
      soundFx.playHologramClick();
      setHGateAngle((prev: number) => {
        const nextAngle = (prev + 45) % 360;
        if (nextAngle === 180 || nextAngle === 0) {
          advanceObjective();
        }
        return nextAngle;
      });
    }
  };

  const handleCoreShiftClick = () => {
    if (objectiveIndex === 4) {
      soundFx.playMissionStartExplosion();
      advanceObjective();
    }
  };

  return (
    <group position={position}>
      {/* Tokamak Reactor Base Pillars */}
      <mesh position={[0, -3, 0]}>
        <cylinderGeometry args={[4, 5, 2, 32]} />
        <meshStandardMaterial color="#0c1322" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Plasma Light Source */}
      <pointLight ref={lightRef} color={basisState === 'X' ? '#ff00a0' : '#00f3ff'} intensity={6} distance={20} />

      {/* Glowing Energy Plasma Sphere */}
      <mesh ref={plasmaRef}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial color={basisState === 'X' ? '#ff00a0' : '#00f3ff'} transparent opacity={0.85} />
      </mesh>

      {/* Inner Tokamak Accelerator Ring */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[2.5, 0.12, 16, 64]} />
        <meshStandardMaterial color="#00f3ff" metalness={0.9} roughness={0.1} emissive="#00f3ff" emissiveIntensity={0.5} />
      </mesh>

      {/* Mid Accelerator Ring */}
      <mesh ref={midRingRef}>
        <torusGeometry args={[3.4, 0.15, 16, 64]} />
        <meshStandardMaterial color="#9d00ff" metalness={0.9} roughness={0.1} emissive="#9d00ff" emissiveIntensity={0.5} />
      </mesh>

      {/* Outer Magnetic Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[4.2, 0.18, 16, 64]} />
        <meshStandardMaterial color="#0066ff" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Vertical Quantum Energy Beam Column */}
      <mesh ref={laserBeamRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 20, 32]} />
        <meshBasicMaterial color={basisState === 'X' ? '#ff00a0' : '#00f3ff'} transparent opacity={0.6} />
      </mesh>

      {/* Interactive Hadamard Gate Station (Objective 3) */}
      <group position={[0, -2, 4]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 1.2, 1]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Hologram Display on H-Gate */}
        <Text
          fontSize={0.2}
          color="#00f3ff"
          position={[0, 0.3, 0.52]}
          anchorX="center"
        >
          HADAMARD GATE (H)
        </Text>

        <Text
          fontSize={0.16}
          color="#00ffaa"
          position={[0, -0.1, 0.52]}
          anchorX="center"
        >
          PHASE ANGLE: {hGateAngle}°
        </Text>

        {/* H-Gate Interactive Trigger */}
        <mesh
          position={[0, -0.3, 0.53]}
          onPointerOver={() => {
            if (objectiveIndex === 3) setInteractPrompt('[E] ROTATE HADAMARD MATRIX');
          }}
          onPointerOut={() => setInteractPrompt(null)}
          onClick={handleHGateClick}
        >
          <planeGeometry args={[1.6, 0.35]} />
          <meshBasicMaterial color={objectiveIndex === 3 ? '#00f3ff' : '#334155'} transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Final Shift Activation Pedestal (Objective 4) */}
      {objectiveIndex === 4 && (
        <group position={[0, -2, 2]}>
          <Text
            fontSize={0.3}
            color="#ff00a0"
            position={[0, 1.2, 0]}
            anchorX="center"
          >
            [E] TRIGGER QUANTUM SHIFT
          </Text>
          <mesh
            position={[0, 0, 0]}
            onPointerOver={() => setInteractPrompt('[E] ACTIVATE QUANTUM SHIFT')}
            onPointerOut={() => setInteractPrompt(null)}
            onClick={handleCoreShiftClick}
          >
            <cylinderGeometry args={[1.5, 1.8, 0.4, 32]} />
            <meshBasicMaterial color="#ff00a0" transparent opacity={0.9} />
          </mesh>
        </group>
      )}
    </group>
  );
};
