import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { soundFx } from '../../audio/SoundSystem';
import { GAME_LEVELS } from '../../types/quantum';

export const MainMenu3D: React.FC = () => {
  const { startMission, levelIndex, setLevelIndex } = useGame();

  const coreGroupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const cameraTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 3D Particle Swirl
  const particleCount = 300;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.5 + Math.random() * 5.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      pos[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = radius * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }
    return pos;
  }, [particleCount]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Smooth Mouse Parallax Camera Movement
    const { pointer } = state;
    cameraTargetRef.current.x = THREE.MathUtils.lerp(cameraTargetRef.current.x, pointer.x * 1.5, 0.05);
    cameraTargetRef.current.y = THREE.MathUtils.lerp(cameraTargetRef.current.y, pointer.y * 1.0, 0.05);
    state.camera.position.x = cameraTargetRef.current.x;
    state.camera.position.y = 1.6 + cameraTargetRef.current.y;
    state.camera.lookAt(0, 1.2, -4);

    // Singularity Core Gyro Rings Animation
    if (coreGroupRef.current) {
      coreGroupRef.current.position.y = 1.6 + Math.sin(t * 1.5) * 0.15;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 1.2;
      ring1Ref.current.rotation.y = t * 0.8;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 1.5;
      ring2Ref.current.rotation.z = t * 0.6;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -t * 0.9;
      ring3Ref.current.rotation.z = -t * 1.1;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.15;
    }
  });

  const handlePointerOver = () => {
    soundFx.playQiVoiceChirp();
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto';
  };

  const currentLvl = GAME_LEVELS[levelIndex] || GAME_LEVELS[0];

  return (
    <group>
      {/* Dynamic Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 4, -4]} color="#00f3ff" intensity={5} distance={15} />
      <pointLight position={[-4, 1, -2]} color="#ff00a0" intensity={4} distance={12} />
      <pointLight position={[4, 1, -6]} color="#a855f7" intensity={3} distance={10} />

      {/* Cyber Wave Grid Floor */}
      <mesh position={[0, -0.5, -6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30, 40, 40]} />
        <meshStandardMaterial color="#050a18" wireframe emissive="#00f3ff" emissiveIntensity={0.15} />
      </mesh>

      {/* CENTRAL 3D QUANTUM SINGULARITY CORE */}
      <group ref={coreGroupRef} position={[0, 1.6, -5]}>
        {/* Core Inner Glowing Sphere */}
        <mesh castShadow onClick={startMission} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
          <icosahedronGeometry args={[1.0, 3]} />
          <meshStandardMaterial
            color="#00f3ff"
            emissive="#00f3ff"
            emissiveIntensity={1.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Gyro Ring 1 */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[1.8, 0.05, 16, 64]} />
          <meshStandardMaterial color="#ff00a0" emissive="#ff00a0" emissiveIntensity={1.2} wireframe />
        </mesh>

        {/* Gyro Ring 2 */}
        <mesh ref={ring2Ref}>
          <torusGeometry args={[2.3, 0.04, 16, 64]} />
          <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={1.0} wireframe />
        </mesh>

        {/* Gyro Ring 3 */}
        <mesh ref={ring3Ref}>
          <torusGeometry args={[2.8, 0.03, 16, 64]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.8} wireframe />
        </mesh>

        {/* Floating Particles Cloud */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={particlePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial size={0.06} color="#00f3ff" transparent opacity={0.8} />
        </points>
      </group>

      {/* FLOATING 3D HOLOGRAPHIC TITLE */}
      <group position={[0, 3.8, -5]}>
        <Text
          fontSize={0.9}
          letterSpacing={0.18}
          color="#00f3ff"
          anchorX="center"
          position={[0, 0, 0]}
        >
          QUANTUM SINGULARITY
        </Text>
        <Text
          fontSize={0.32}
          letterSpacing={0.25}
          color="#ff00a0"
          anchorX="center"
          position={[0, -0.6, 0]}
        >
          THE QUANTUM QUEST
        </Text>
      </group>

      {/* 3D LEVEL SELECTION CAROUSEL PANEL */}
      <group position={[0, -0.1, -4.5]}>
        {/* Carousel Frame */}
        <mesh>
          <boxGeometry args={[4.8, 1.4, 0.1]} />
          <meshStandardMaterial color="#0a1226" transparent opacity={0.85} metalness={0.8} />
        </mesh>

        {/* Level Title */}
        <Text
          fontSize={0.2}
          color="#00f3ff"
          anchorX="center"
          position={[0, 0.45, 0.08]}
        >
          {currentLvl.title}
        </Text>

        {/* Concept & Objective */}
        <Text
          fontSize={0.12}
          color="#ffffff"
          anchorX="center"
          position={[0, 0.2, 0.08]}
        >
          {currentLvl.concept}
        </Text>

        <Text
          fontSize={0.1}
          color="#ff00a0"
          anchorX="center"
          position={[0, -0.05, 0.08]}
        >
          DIRECTIVE: {currentLvl.targetObjective}
        </Text>

        {/* Next / Prev 3D Buttons */}
        <group
          position={[-2.0, 0, 0.1]}
          onClick={(e) => {
            e.stopPropagation();
            soundFx.playHologramClick();
            setLevelIndex((levelIndex - 1 + GAME_LEVELS.length) % GAME_LEVELS.length);
          }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <mesh>
            <boxGeometry args={[0.5, 0.5, 0.1]} />
            <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.6} />
          </mesh>
          <Text fontSize={0.25} color="#000000" position={[0, 0, 0.06]} anchorX="center" anchorY="middle">
            &lt;
          </Text>
        </group>

        <group
          position={[2.0, 0, 0.1]}
          onClick={(e) => {
            e.stopPropagation();
            soundFx.playHologramClick();
            setLevelIndex((levelIndex + 1) % GAME_LEVELS.length);
          }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <mesh>
            <boxGeometry args={[0.5, 0.5, 0.1]} />
            <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.6} />
          </mesh>
          <Text fontSize={0.25} color="#000000" position={[0, 0, 0.06]} anchorX="center" anchorY="middle">
            &gt;
          </Text>
        </group>
      </group>
    </group>
  );
};
