'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface PopCat3DProps {
  position: [number, number, number];
  scale?: number;
  speed?: number;
}

export default function PopCat3D({
  position,
  scale = 1,
  speed = 1.6,
}: PopCat3DProps) {
  const catRef = useRef<THREE.Group>(null);
  const openMouthRef = useRef<THREE.Mesh>(null);
  const closedMouthRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (catRef.current) {
      catRef.current.rotation.y = Math.sin(t * 0.8) * 0.25;
      catRef.current.position.y = position[1] + Math.sin(t * 2) * 0.1;
    }

    // Pop mouth toggle every 0.3s
    const isOpen = (Math.sin(t * 6) + 1) * 0.5 > 0.45;
    if (openMouthRef.current && closedMouthRef.current) {
      openMouthRef.current.visible = isOpen;
      closedMouthRef.current.visible = !isOpen;
    }
  });

  return (
    <Float speed={2.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={catRef} position={position} scale={scale}>
        {/* Cat Body */}
        <mesh position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.45, 24, 24]} />
          <meshStandardMaterial color="#EFEBE9" roughness={0.6} />
        </mesh>

        {/* Cat Head */}
        <group position={[0, 0.32, 0]}>
          <mesh>
            <sphereGeometry args={[0.42, 24, 24]} />
            <meshStandardMaterial color="#EFEBE9" roughness={0.6} />
          </mesh>

          {/* Ears */}
          {[-1, 1].map((side) => (
            <group key={`ear-${side}`}>
              <mesh position={[side * 0.24, 0.35, -0.02]} rotation={[0, 0, side * -0.35]}>
                <coneGeometry args={[0.13, 0.26, 6]} />
                <meshStandardMaterial color="#EFEBE9" roughness={0.6} />
              </mesh>
              <mesh position={[side * 0.24, 0.33, 0.03]} rotation={[0, 0, side * -0.35]}>
                <coneGeometry args={[0.07, 0.16, 6]} />
                <meshStandardMaterial color="#FF80AB" roughness={0.4} />
              </mesh>
            </group>
          ))}

          {/* Wide Open Singing Eyes */}
          {[-1, 1].map((side) => (
            <group key={`eye-${side}`}>
              <mesh position={[side * 0.14, 0.1, 0.3]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color="#212121" roughness={0.2} />
              </mesh>
              <mesh position={[side * 0.12, 0.13, 0.36]}>
                <sphereGeometry args={[0.032, 8, 8]} />
                <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.9} />
              </mesh>
            </group>
          ))}

          {/* Pink Nose */}
          <mesh position={[0, -0.01, 0.37]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#FF4081" />
          </mesh>

          {/* 1. Closed Mouth State (:3) */}
          <group ref={closedMouthRef} position={[0, -0.1, 0.34]}>
            <mesh rotation={[0.2, 0, 0]}>
              <torusGeometry args={[0.05, 0.01, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#212121" />
            </mesh>
          </group>

          {/* 2. Wide Open Pop Mouth State (:O) */}
          <mesh ref={openMouthRef} position={[0, -0.12, 0.33]} rotation={[0.25, 0, 0]} visible={false}>
            <cylinderGeometry args={[0.13, 0.16, 0.12, 20]} />
            <meshStandardMaterial color="#880E4F" roughness={0.5} />
          </mesh>

          {/* Whiskers */}
          {[-1, 1].map((side) =>
            [0, 1].map((i) => (
              <mesh
                key={`w-${side}-${i}`}
                position={[side * 0.22, -0.06 + i * 0.05, 0.28]}
                rotation={[0, 0, side * (0.1 + i * 0.1)]}
              >
                <boxGeometry args={[0.25, 0.008, 0.003]} />
                <meshStandardMaterial color="#424242" />
              </mesh>
            )),
          )}
        </group>
      </group>
    </Float>
  );
}

