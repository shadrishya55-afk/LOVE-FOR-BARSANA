'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface BananaCat3DProps {
  position: [number, number, number];
  scale?: number;
  speed?: number;
}

export default function BananaCat3D({
  position,
  scale = 1,
  speed = 1.5,
}: BananaCat3DProps) {
  const catRef = useRef<THREE.Group>(null);
  const tearLeftRef = useRef<THREE.Mesh>(null);
  const tearRightRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (catRef.current) {
      catRef.current.rotation.z = Math.sin(t * 1.5) * 0.12;
      catRef.current.rotation.y = Math.sin(t * 0.8) * 0.2;
    }
    // Animated crying tears dripping down
    if (tearLeftRef.current && tearRightRef.current) {
      const tearY = -0.05 - ((t * 2) % 1) * 0.35;
      const tearScale = (1 - ((t * 2) % 1)) * 1.2;
      tearLeftRef.current.position.y = tearY;
      tearLeftRef.current.scale.setScalar(tearScale);
      tearRightRef.current.position.y = tearY;
      tearRightRef.current.scale.setScalar(tearScale);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={catRef} position={position} scale={scale}>
        {/* ── 3D Banana Peel Suit ── */}
        <group position={[0, -0.15, 0]}>
          {/* Main Banana Curved Body */}
          <mesh rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.35, 0.48, 1.2, 16, 8]} />
            <meshStandardMaterial
              color="#FEE500"
              roughness={0.35}
              metalness={0.1}
            />
          </mesh>
          {/* Banana Green Top Stem */}
          <mesh position={[-0.15, 0.7, 0]} rotation={[0, 0, 0.4]}>
            <cylinderGeometry args={[0.06, 0.08, 0.25, 8]} />
            <meshStandardMaterial color="#689F38" roughness={0.6} />
          </mesh>
          {/* Banana Brown Bottom Tip */}
          <mesh position={[0.15, -0.7, 0]} rotation={[0, 0, 0.4]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color="#5D4037" roughness={0.8} />
          </mesh>
        </group>

        {/* ── Cat Head Poking Out of Banana ── */}
        <group position={[0, 0.35, 0.2]}>
          {/* Head */}
          <mesh>
            <sphereGeometry args={[0.36, 24, 24]} />
            <meshStandardMaterial color="#FFF9E6" roughness={0.5} />
          </mesh>

          {/* Pointy Cat Ears */}
          {[-1, 1].map((side) => (
            <group key={`ear-${side}`}>
              <mesh position={[side * 0.2, 0.3, -0.02]} rotation={[0, 0, side * -0.3]}>
                <coneGeometry args={[0.12, 0.24, 6]} />
                <meshStandardMaterial color="#FFF9E6" roughness={0.5} />
              </mesh>
              <mesh position={[side * 0.2, 0.28, 0.02]} rotation={[0, 0, side * -0.3]}>
                <coneGeometry args={[0.07, 0.16, 6]} />
                <meshStandardMaterial color="#FF80AB" roughness={0.4} />
              </mesh>
            </group>
          ))}

          {/* Crying Anime Eyes (Big glassy blue with watery highlights) */}
          {[-1, 1].map((side) => (
            <group key={`eye-${side}`}>
              <mesh position={[side * 0.12, 0.06, 0.24]}>
                <sphereGeometry args={[0.075, 16, 16]} />
                <meshStandardMaterial color="#0288D1" roughness={0.1} />
              </mesh>
              {/* Eye Shimmer / Tears in eyes */}
              <mesh position={[side * 0.1, 0.09, 0.3]}>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.9} />
              </mesh>
            </group>
          ))}

          {/* Streaming Falling Tears */}
          <mesh ref={tearLeftRef} position={[-0.12, -0.1, 0.3]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial
              color="#00E5FF"
              emissive="#00B0FF"
              emissiveIntensity={0.7}
              transparent
              opacity={0.85}
            />
          </mesh>
          <mesh ref={tearRightRef} position={[0.12, -0.1, 0.3]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial
              color="#00E5FF"
              emissive="#00B0FF"
              emissiveIntensity={0.7}
              transparent
              opacity={0.85}
            />
          </mesh>

          {/* Wavy Crying Mouth (﹏) */}
          <mesh position={[0, -0.1, 0.26]} rotation={[0.2, 0, 0]}>
            <torusGeometry args={[0.05, 0.012, 8, 16, Math.PI * 0.8]} />
            <meshStandardMaterial color="#D81B60" />
          </mesh>

          {/* Cute Pink Nose */}
          <mesh position={[0, -0.02, 0.3]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#FF4081" />
          </mesh>

          {/* Blush Cheeks */}
          {[-1, 1].map((side) => (
            <mesh key={`blush-${side}`} position={[side * 0.2, -0.04, 0.24]}>
              <circleGeometry args={[0.055, 12]} />
              <meshStandardMaterial color="#FF4081" transparent opacity={0.6} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>

        {/* Tiny Paws Clinging to Banana */}
        {[-1, 1].map((side) => (
          <mesh key={`paw-${side}`} position={[side * 0.22, 0.1, 0.38]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#FFF9E6" roughness={0.5} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

