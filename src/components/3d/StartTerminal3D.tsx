import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { soundFx } from '../../audio/SoundSystem';

export const StartTerminal3D: React.FC<{ position?: [number, number, number] }> = ({ position = [0, 1.2, -4] }) => {
  const { startMission } = useGame();
  const [hovered, setHovered] = useState(false);
  const terminalGroupRef = useRef<THREE.Group>(null);
  const particleGroupRef = useRef<THREE.Points>(null);

  const frameEdges = useMemo(() => {
    const plane = new THREE.PlaneGeometry(3.2, 1.8);
    const edges = new THREE.EdgesGeometry(plane);
    plane.dispose();
    return edges;
  }, []);

  const buttonEdges = useMemo(() => {
    const plane = new THREE.PlaneGeometry(2.2, 0.55);
    const edges = new THREE.EdgesGeometry(plane);
    plane.dispose();
    return edges;
  }, []);

  useEffect(() => {
    return () => {
      frameEdges.dispose();
      buttonEdges.dispose();
    };
  }, [frameEdges, buttonEdges]);

  // Floating & Pulse Animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (terminalGroupRef.current) {
      terminalGroupRef.current.position.y = position[1] + Math.sin(t * 2) * 0.05;
      terminalGroupRef.current.rotation.y = Math.sin(t * 0.5) * 0.03;
    }

    if (particleGroupRef.current) {
      const positions = particleGroupRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(t + i) * 0.002;
      }
      particleGroupRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const handlePointerOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setHovered(true);
    soundFx.playQiVoiceChirp();
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    startMission();
  };

  // Particles geometry around terminal
  const particleCount = 60;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    return pos;
  }, []);

  return (
    <group ref={terminalGroupRef} position={position}>
      {/* Outer Hologram Frame Backplate */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[3.2, 1.8]} />
        <meshBasicMaterial
          color={hovered ? '#00f3ff' : '#0a1936'}
          transparent
          opacity={hovered ? 0.35 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Hologram Glass Grid Border */}
      <lineSegments geometry={frameEdges}>
        <lineBasicMaterial color={hovered ? '#00f3ff' : '#0066ff'} linewidth={2} />
      </lineSegments>

      {/* Holographic Glowing Corners */}
      {[-1.6, 1.6].map((x, i) =>
        [-0.9, 0.9].map((y, j) => (
          <mesh key={`${i}-${j}`} position={[x, y, 0.01]}>
            <boxGeometry args={[0.15, 0.15, 0.02]} />
            <meshBasicMaterial color="#00f3ff" />
          </mesh>
        ))
      )}

      {/* Terminal Title Text */}
      <Text
        fontSize={0.22}
        color="#00f3ff"
        letterSpacing={0.12}
        anchorX="center"
        position={[0, 0.55, 0.05]}
      >
        ENTER QUANTUM FACILITY
      </Text>

      {/* Terminal Status Lines */}
      <Text
        fontSize={0.11}
        color="#00ffaa"
        anchorX="center"
        position={[0, 0.3, 0.05]}
      >
        SYSTEM STATUS: ONLINE • COHERENCE 98.4%
      </Text>

      {/* Interactive START MISSION Holographic Button */}
      <group
        position={[0, -0.25, 0.05]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        {/* Button Background */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[2.2, 0.55]} />
          <meshBasicMaterial
            color={hovered ? '#ff00a0' : '#00f3ff'}
            transparent
            opacity={hovered ? 0.6 : 0.3}
          />
        </mesh>

        {/* Button Border */}
        <lineSegments geometry={buttonEdges}>
          <lineBasicMaterial color={hovered ? '#ffffff' : '#00f3ff'} linewidth={3} />
        </lineSegments>

        {/* Button Text */}
        <Text
          fontSize={0.2}
          color={hovered ? '#ffffff' : '#00f3ff'}
          letterSpacing={0.15}
          anchorX="center"
          anchorY="middle"
          position={[0, 0, 0.02]}
        >
          [ START MISSION ]
        </Text>
      </group>

      {/* Floating Hologram Energy Particles */}
      <points ref={particleGroupRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#00f3ff" transparent opacity={0.7} />
      </points>

      {/* Floor Projection Ring Light */}
      <pointLight color={hovered ? '#ff00a0' : '#00f3ff'} intensity={2} distance={5} position={[0, -0.8, 0.5]} />
    </group>
  );
};
