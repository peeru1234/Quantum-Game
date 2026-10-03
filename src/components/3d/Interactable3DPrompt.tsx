import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface Interactable3DPromptProps {
  position: [number, number, number];
  text: string;
  visible: boolean;
}

export const Interactable3DPrompt: React.FC<Interactable3DPromptProps> = ({
  position,
  text,
  visible
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Mesh>(null);

  const edgesGeo = useMemo(() => {
    const plane = new THREE.PlaneGeometry(2.8, 0.6);
    const edges = new THREE.EdgesGeometry(plane);
    plane.dispose();
    return edges;
  }, []);

  useEffect(() => {
    return () => {
      edgesGeo.dispose();
    };
  }, [edgesGeo]);

  useFrame(({ camera, clock }) => {
    if (groupRef.current && visible) {
      groupRef.current.quaternion.copy(camera.quaternion);
      const t = clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(t * 3) * 0.08;
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* Background Holographic Glow Box */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[2.8, 0.6]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Hologram Border */}
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color="#00f3ff" linewidth={2} />
      </lineSegments>

      {/* Floating 3D Text Prompt */}
      <Text
        ref={textRef}
        fontSize={0.18}
        color="#ffffff"
        letterSpacing={0.08}
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  );
};
