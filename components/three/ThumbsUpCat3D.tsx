'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface ThumbsUpCat3DProps {
  position: [number, number, number];
  scale?: number;
  speed?: number;
}

export default function ThumbsUpCat3D({
  position,
  scale = 1,
  speed = 1.4,
}: ThumbsUpCat3DProps) {
  const catRef = useRef<THREE.Group>(null);
  const thumbRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (catRef.current) {
      catRef.current.rotation.y = Math.sin(t * 0.7) * 0.2;
    }
    // Animated Thumbs-Up Bobbing
    if (thumbRef.current) {
      thumbRef.current.rotation.z = 0.3 + Math.sin(t * 4) * 0.25;
    }
  });

  return (
    <Float speed={2.1} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={catRef} position={position} scale={scale}>
        {/* Cat Body (Ginger Fur) */}
        <mesh position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.45, 24, 24]} />
          <meshStandardMaterial color="#FFB74D" roughness={0.6} />
        </mesh>

        {/* Cat Head */}
        <group position={[0, 0.32, 0]}>
          <mesh>
            <sphereGeometry args={[0.42, 24, 24]} />
            <meshStandardMaterial color="#FFB74D" roughness={0.6} />
          </mesh>

          {/* Ears */}
          {[-1, 1].map((side) => (
            <group key={`ear-${side}`}>
              <mesh position={[side * 0.24, 0.35, -0.02]} rotation={[0, 0, side * -0.35]}>
                <coneGeometry args={[0.13, 0.26, 6]} />
                <meshStandardMaterial color="#FFB74D" roughness={0.6} />
              </mesh>
              <mesh position={[side * 0.24, 0.33, 0.03]} rotation={[0, 0, side * -0.35]}>
                <coneGeometry args={[0.07, 0.16, 6]} />
                <meshStandardMaterial color="#FF80AB" roughness={0.4} />
              </mesh>
            </group>
          ))}

          {/* Teary Crying Eyes */}
          {[-1, 1].map((side) => (
            <group key={`eye-${side}`}>
              <mesh position={[side * 0.13, 0.08, 0.3]}>
                <sphereGeometry args={[0.07, 16, 16]} />
                <meshStandardMaterial color="#0288D1" roughness={0.2} />
              </mesh>
              <mesh position={[side * 0.11, 0.11, 0.35]}>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.9} />
              </mesh>
            </group>
          ))}

          {/* Big Tear Drops */}
          {[-1, 1].map((side) => (
            <mesh key={`tear-${side}`} position={[side * 0.15, -0.05, 0.36]}>
              <sphereGeometry args={[0.045, 10, 10]} />
              <meshStandardMaterial
                color="#00E5FF"
                emissive="#00B0FF"
                emissiveIntensity={0.6}
                transparent
                opacity={0.85}
              />
            </mesh>
          ))}

          {/* Crying Smile */}
          <mesh position={[0, -0.08, 0.36]} rotation={[0.2, 0, 0]}>
            <torusGeometry args={[0.05, 0.01, 8, 16, Math.PI * 0.8]} />
            <meshStandardMaterial color="#212121" />
          </mesh>
        </group>

        {/* ── 3D Giant Animated Thumbs-Up Paw 👍 ── */}
        <group ref={thumbRef} position={[0.36, 0.15, 0.35]}>
          {/* Fist */}
          <mesh>
            <sphereGeometry args={[0.13, 14, 14]} />
            <meshStandardMaterial color="#FFE0B2" />
          </mesh>
          {/* Extended Thumb */}
          <mesh position={[0, 0.14, 0]} rotation={[0, 0, 0.1]}>
            <cylinderGeometry args={[0.045, 0.05, 0.18, 10]} />
            <meshStandardMaterial color="#FFE0B2" />
          </mesh>
          <mesh position={[0, 0.23, 0]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color="#FFE0B2" />
          </mesh>
        </group>
      </group>
    </Float>
  );
}
