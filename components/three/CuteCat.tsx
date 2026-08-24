'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface CuteCatProps {
  position: [number, number, number];
  color?: string;
  scale?: number;
  variant?: 'sitting' | 'waving' | 'sleeping';
}

export default function CuteCat({
  position,
  color = '#FFA07A',
  scale = 1,
  variant = 'sitting',
}: CuteCatProps) {
  const tailRef = useRef<THREE.Mesh>(null);
  const pawRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Wag the tail
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 3) * 0.35 + 0.4;
    }

    // Wave the paw
    if (pawRef.current && variant === 'waving') {
      pawRef.current.rotation.z = Math.sin(t * 5) * 0.6;
      pawRef.current.position.y = 0.5 + Math.sin(t * 5) * 0.1;
    }

    // Gentle head bob
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 1.5) * 0.04;
      if (variant === 'sleeping') {
        headRef.current.position.y = 0.55 + Math.sin(t * 0.8) * 0.02;
      }
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.25}>
      <group position={position} scale={scale}>
        {/* ── Body ── */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 20, 20]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>

        {/* ── Head group ── */}
        <group ref={headRef} position={[0, 0.65, 0.15]}>
          <mesh>
            <sphereGeometry args={[0.38, 20, 20]} />
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>

          {/* Ears */}
          {[-1, 1].map((side) => (
            <group key={`ear-${side}`}>
              <mesh position={[side * 0.22, 0.3, -0.02]} rotation={[0, 0, side * -0.3]}>
                <coneGeometry args={[0.13, 0.26, 4]} />
                <meshStandardMaterial color={color} roughness={0.85} />
              </mesh>
              <mesh position={[side * 0.22, 0.28, 0.02]} rotation={[0, 0, side * -0.3]}>
                <coneGeometry args={[0.075, 0.16, 4]} />
                <meshStandardMaterial color="#FFB6C1" roughness={0.85} />
              </mesh>
            </group>
          ))}

          {/* Eyes */}
          {variant === 'sleeping' ? (
            // Closed eyes — curved lines
            [-1, 1].map((side) => (
              <mesh
                key={`closed-eye-${side}`}
                position={[side * 0.12, 0.05, 0.22]}
                rotation={[0, 0, side * 0.15]}
              >
                <boxGeometry args={[0.1, 0.018, 0.01]} />
                <meshStandardMaterial color="#333" />
              </mesh>
            ))
          ) : (
            // Open eyes with highlight
            [-1, 1].map((side) => (
              <group key={`eye-${side}`}>
                <mesh position={[side * 0.12, 0.07, 0.22]}>
                  <sphereGeometry args={[0.075, 14, 14]} />
                  <meshStandardMaterial color="#1a1a2e" />
                </mesh>
                <mesh position={[side * 0.1, 0.09, 0.29]}>
                  <sphereGeometry args={[0.028, 8, 8]} />
                  <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.6} />
                </mesh>
              </group>
            ))
          )}

          {/* Nose */}
          <mesh position={[0, -0.05, 0.3]}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshStandardMaterial color="#FF69B4" />
          </mesh>

          {/* Smile */}
          <mesh position={[0, -0.1, 0.27]} rotation={[0.25, 0, 0]}>
            <torusGeometry args={[0.045, 0.008, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#444" />
          </mesh>

          {/* Whiskers */}
          {[-1, 1].map((side) =>
            [0, 1, 2].map((i) => (
              <mesh
                key={`w-${side}-${i}`}
                position={[side * 0.16, -0.07 + (i - 1) * 0.04, 0.24]}
                rotation={[0, 0, side * (0.08 + i * 0.08)]}
              >
                <boxGeometry args={[0.28, 0.005, 0.003]} />
                <meshStandardMaterial color="#666" transparent opacity={0.7} />
              </mesh>
            )),
          )}

          {/* Blush */}
          {[-1, 1].map((side) => (
            <mesh key={`blush-${side}`} position={[side * 0.2, -0.04, 0.24]}>
              <circleGeometry args={[0.055, 16]} />
              <meshStandardMaterial
                color="#FFB6C1"
                transparent
                opacity={0.4}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>

        {/* ── Front paws ── */}
        <mesh position={[-0.2, -0.38, 0.25]}>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
        <mesh
          ref={variant === 'waving' ? pawRef : undefined}
          position={[0.2, variant === 'waving' ? 0.5 : -0.38, 0.25]}
          rotation={variant === 'waving' ? [0, 0, 0.5] : undefined}
        >
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>

        {/* ── Back paws ── */}
        {[-1, 1].map((side) => (
          <mesh key={`bp-${side}`} position={[side * 0.28, -0.45, -0.1]}>
            <sphereGeometry args={[0.14, 10, 10]} />
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>
        ))}

        {/* ── Tail ── */}
        <mesh ref={tailRef} position={[0, -0.1, -0.48]} rotation={[0.6, 0, 0.4]}>
          <cylinderGeometry args={[0.045, 0.02, 0.65, 8]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>

        {/* ── Belly spot (lighter fur) ── */}
        <mesh position={[0, -0.05, 0.42]}>
          <circleGeometry args={[0.2, 16]} />
          <meshStandardMaterial
            color="#FFDAB9"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  );
}
