import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundFx } from '../../audio/SoundSystem';

export const IntroSequence3D: React.FC<{
  onIntroComplete?: () => void;
}> = () => {
  const ringRef = useRef<THREE.Mesh>(null);
  const ringGlowRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);

  // Particle positions for expanding ring
  const count = 120;
  const particlePositions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.2 + Math.random() * 0.2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Pulse & expand ring
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
      const scale = 1 + Math.sin(t * 1.5) * 0.1;
      ringRef.current.scale.set(scale, scale, scale);
    }

    if (ringGlowRef.current) {
      ringGlowRef.current.rotation.z = -t * 0.3;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.z = t * 0.2;
    }

    // Gradual lighting reveal
    if (light1Ref.current) {
      light1Ref.current.intensity = Math.min(4, t * 1.5);
    }
    if (light2Ref.current) {
      light2Ref.current.intensity = Math.min(3, Math.max(0, (t - 1) * 1.2));
    }
  });

  React.useEffect(() => {
    soundFx.playParticleRingSound();
  }, []);

  return (
    <group position={[0, 1.6, -2]}>
      {/* Dynamic Lights for Lab Reveal */}
      <pointLight ref={light1Ref} position={[0, 2, 0]} color="#00f3ff" intensity={0} distance={10} />
      <pointLight ref={light2Ref} position={[0, -1, -3]} color="#ff00a0" intensity={0} distance={10} />

      {/* Main Glowing Quantum Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.2, 0.04, 16, 100]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.85} />
      </mesh>

      {/* Outer Glow Ring */}
      <mesh ref={ringGlowRef}>
        <torusGeometry args={[1.35, 0.02, 16, 100]} />
        <meshBasicMaterial color="#9d00ff" transparent opacity={0.6} />
      </mesh>

      {/* Floating Particles in Ring */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#00f3ff" transparent opacity={0.8} />
      </points>
    </group>
  );
};
