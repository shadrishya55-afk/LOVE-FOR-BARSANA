'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface PoliteCat3DProps {
  position: [number, number, number];
  scale?: number;
  speed?: number;
}

export default function PoliteCat3D({
  position,
  scale = 1,
  speed = 1.3,
}: PoliteCat3DProps) {
  const catRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (catRef.current) {
      catRef.current.rotation.y = Math.sin(t * 0.6) * 0.15;
    }
  });

  return (
    <Float speed={1.7} rotationIntensity={0.15} floatIntensity={0.35}>
      <group ref={catRef} position={position} scale={scale}>
        {/* Cat Body (Tuxedo White/Black) */}
        <mesh position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.45, 24, 24]} />
          <meshStandardMaterial color="#212121" roughness={0.6} />
        </mesh>
        {/* White Chest */}
        <mesh position={[0, -0.15, 0.35]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#FAFAFA" roughness={0.5} />
        </mesh>

        {/* Fancy Black Bowtie */}
        <group position={[0, 0.05, 0.38]}>
          {/* Left Wing */}
          <mesh position={[-0.07, 0, 0]} rotation={[0, 0, 0.4]}>
            <coneGeometry args={[0.06, 0.12, 4]} />
            <meshStandardMaterial color="#D81B60" />
          </mesh>
          {/* Right Wing */}
          <mesh position={[0.07, 0, 0]} rotation={[0, 0, -0.4]}>
            <coneGeometry args={[0.06, 0.12, 4]} />
            <meshStandardMaterial color="#D81B60" />
          </mesh>
          {/* Knot */}
          <mesh>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#F48FB1" />
          </mesh>
        </group>

        {/* Cat Head */}
        <group position={[0, 0.32, 0]}>
          <mesh>
            <sphereGeometry args={[0.42, 24, 24]} />
            <meshStandardMaterial color="#FAFAFA" roughness={0.5} />
          </mesh>

          {/* Ears */}
          {[-1, 1].map((side) => (
            <group key={`ear-${side}`}>
              <mesh position={[side * 0.24, 0.35, -0.02]} rotation={[0, 0, side * -0.35]}>
                <coneGeometry args={[0.13, 0.26, 6]} />
                <meshStandardMaterial color="#212121" roughness={0.6} />
              </mesh>
              <mesh position={[side * 0.24, 0.33, 0.03]} rotation={[0, 0, side * -0.35]}>
                <coneGeometry args={[0.07, 0.16, 6]} />
                <meshStandardMaterial color="#FF80AB" roughness={0.4} />
              </mesh>
            </group>
          ))}

          {/* Polite Round Eyes */}
          {[-1, 1].map((side) => (
            <group key={`eye-${side}`}>
              <mesh position={[side * 0.13, 0.08, 0.3]}>
                <sphereGeometry args={[0.07, 16, 16]} />
                <meshStandardMaterial color="#37474F" roughness={0.3} />
              </mesh>
              <mesh position={[side * 0.11, 0.11, 0.35]}>
                <sphereGeometry args={[0.028, 8, 8]} />
                <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.8} />
              </mesh>
            </group>
          ))}

          {/* Polite Ollie Cat Signature Flat Smile ( : | ) */}
          <mesh position={[0, -0.08, 0.36]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.16, 0.016, 0.01]} />
            <meshStandardMaterial color="#212121" />
          </mesh>

          {/* Nose */}
          <mesh position={[0, -0.01, 0.37]}>
            <sphereGeometry args={[0.032, 8, 8]} />
            <meshStandardMaterial color="#FF80AB" />
          </mesh>
        </group>
      </group>
    </Float>
  );
}
