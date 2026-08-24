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
  const pawRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Tail wag
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 3.5) * 0.4 + 0.35;
    }

    // Waving paw
    if (pawRef.current && variant === 'waving') {
      pawRef.current.rotation.z = Math.sin(t * 6) * 0.65;
      pawRef.current.position.y = 0.52 + Math.sin(t * 6) * 0.12;
    }

    // Head bob
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 1.8) * 0.06;
      if (variant === 'sleeping') {
        headRef.current.position.y = 0.58 + Math.sin(t * 1.0) * 0.025;
      }
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.35}>
      <group position={position} scale={scale}>
        {/* ── Body ── */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 24, 24]} />
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
        </mesh>

        {/* ── Calico / Fur Patches ── */}
        <mesh position={[0.2, 0.15, 0.32]} rotation={[0, 0.4, 0.2]}>
          <circleGeometry args={[0.18, 16]} />
          <meshStandardMaterial color="#8D6E63" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-0.25, -0.1, 0.35]} rotation={[0, -0.3, -0.2]}>
          <circleGeometry args={[0.14, 16]} />
          <meshStandardMaterial color="#FFB74D" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>

        {/* ── Head group ── */}
        <group ref={headRef} position={[0, 0.68, 0.15]}>
          <mesh>
            <sphereGeometry args={[0.4, 24, 24]} />
            <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
          </mesh>

          {/* Forehead Tiger Stripes */}
          {[-0.08, 0, 0.08].map((x, idx) => (
            <mesh key={`stripe-${idx}`} position={[x, 0.22, 0.34]} rotation={[0, 0, 0]}>
              <boxGeometry args={[0.025, 0.08, 0.01]} />
              <meshStandardMaterial color="#5D4037" transparent opacity={0.65} />
            </mesh>
          ))}

          {/* Ears */}
          {[-1, 1].map((side) => (
            <group key={`ear-${side}`}>
              {/* Outer ear */}
              <mesh position={[side * 0.24, 0.33, -0.02]} rotation={[0, 0, side * -0.32]}>
                <coneGeometry args={[0.14, 0.28, 4]} />
                <meshStandardMaterial color={color} roughness={0.7} />
              </mesh>
              {/* Inner pink ear */}
              <mesh position={[side * 0.24, 0.3, 0.03]} rotation={[0, 0, side * -0.32]}>
                <coneGeometry args={[0.08, 0.18, 4]} />
                <meshStandardMaterial color="#FF80AB" roughness={0.5} />
              </mesh>
            </group>
          ))}

          {/* Eyes */}
          {variant === 'sleeping' ? (
            // Closed eyes (^_^)
            [-1, 1].map((side) => (
              <mesh
                key={`closed-eye-${side}`}
                position={[side * 0.13, 0.05, 0.25]}
                rotation={[0, 0, side * 0.25]}
              >
                <boxGeometry args={[0.12, 0.02, 0.01]} />
                <meshStandardMaterial color="#212121" />
              </mesh>
            ))
          ) : (
            // Big anime / meme eyes
            [-1, 1].map((side) => (
              <group key={`eye-${side}`}>
                {/* Dark Pupil */}
                <mesh position={[side * 0.13, 0.08, 0.25]}>
                  <sphereGeometry args={[0.08, 16, 16]} />
                  <meshStandardMaterial color="#1A237E" />
                </mesh>
                {/* Big shine */}
                <mesh position={[side * 0.11, 0.11, 0.32]}>
                  <sphereGeometry args={[0.032, 10, 10]} />
                  <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.8} />
                </mesh>
                {/* Small lower shine */}
                <mesh position={[side * 0.15, 0.06, 0.32]}>
                  <sphereGeometry args={[0.016, 8, 8]} />
                  <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.8} />
                </mesh>
              </group>
            ))
          )}

          {/* Cute Pink Heart Nose */}
          <mesh position={[0, -0.04, 0.33]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshStandardMaterial color="#FF1493" emissive="#FF1493" emissiveIntensity={0.3} />
          </mesh>

          {/* Smile */}
          <mesh position={[0, -0.1, 0.3]} rotation={[0.25, 0, 0]}>
            <torusGeometry args={[0.05, 0.009, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#212121" />
          </mesh>

          {/* Whiskers */}
          {[-1, 1].map((side) =>
            [0, 1, 2].map((i) => (
              <mesh
                key={`w-${side}-${i}`}
                position={[side * 0.18, -0.06 + (i - 1) * 0.045, 0.26]}
                rotation={[0, 0, side * (0.08 + i * 0.1)]}
              >
                <boxGeometry args={[0.3, 0.006, 0.003]} />
                <meshStandardMaterial color="#424242" transparent opacity={0.8} />
              </mesh>
            )),
          )}

          {/* Rosy Blush */}
          {[-1, 1].map((side) => (
            <mesh key={`blush-${side}`} position={[side * 0.22, -0.03, 0.27]}>
              <circleGeometry args={[0.065, 16]} />
              <meshStandardMaterial
                color="#FF4081"
                transparent
                opacity={0.55}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>

        {/* ── Front Paws with Toe Beans ── */}
        <group position={[-0.2, -0.38, 0.28]}>
          <mesh>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
          {/* Pink toe beans */}
          <mesh position={[0, -0.04, 0.09]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#FF80AB" />
          </mesh>
        </group>

        <group
          ref={variant === 'waving' ? pawRef : undefined}
          position={[0.2, variant === 'waving' ? 0.52 : -0.38, 0.28]}
          rotation={variant === 'waving' ? [0, 0, 0.55] : undefined}
        >
          <mesh>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
          {/* Pink toe beans */}
          <mesh position={[0, -0.04, 0.09]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#FF80AB" />
          </mesh>
        </group>

        {/* ── Back paws ── */}
        {[-1, 1].map((side) => (
          <mesh key={`bp-${side}`} position={[side * 0.3, -0.45, -0.1]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
        ))}

        {/* ── Tail ── */}
        <mesh ref={tailRef} position={[0, -0.1, -0.5]} rotation={[0.65, 0, 0.4]}>
          <cylinderGeometry args={[0.05, 0.025, 0.7, 10]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>

        {/* ── White Belly Fur ── */}
        <mesh position={[0, -0.04, 0.43]}>
          <circleGeometry args={[0.24, 20]} />
          <meshStandardMaterial
            color="#FFF8E7"
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  );
}
