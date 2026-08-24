'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface HeartEyesCat3DProps {
  position: [number, number, number];
  scale?: number;
  speed?: number;
}

export default function HeartEyesCat3D({
  position,
  scale = 1,
  speed = 1.4,
}: HeartEyesCat3DProps) {
  const catRef = useRef<THREE.Group>(null);
  const leftHeartRef = useRef<THREE.Mesh>(null);
  const rightHeartRef = useRef<THREE.Mesh>(null);

  const heartShape = useRef(
    (() => {
      const s = new THREE.Shape();
      s.moveTo(0, 0.2);
      s.bezierCurveTo(0, 0.2, -0.05, 0.1, -0.12, 0.1);
      s.bezierCurveTo(-0.25, 0.1, -0.25, 0.25, -0.25, 0.25);
      s.bezierCurveTo(-0.25, 0.35, -0.15, 0.45, 0, 0.55);
      s.bezierCurveTo(0.15, 0.45, 0.25, 0.35, 0.25, 0.25);
      s.bezierCurveTo(0.25, 0.25, 0.25, 0.1, 0.12, 0.1);
      s.bezierCurveTo(0.05, 0.1, 0, 0.2, 0, 0.2);
      return s;
    })(),
  ).current;

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (catRef.current) {
      catRef.current.rotation.y = Math.sin(t * 0.7) * 0.2;
    }
    // Pulsing heart eyes
    const heartPulse = 1 + Math.sin(t * 4) * 0.18;
    if (leftHeartRef.current && rightHeartRef.current) {
      leftHeartRef.current.scale.setScalar(heartPulse * 0.38);
      rightHeartRef.current.scale.setScalar(heartPulse * 0.38);
    }
  });

  return (
    <Float speed={1.9} rotationIntensity={0.25} floatIntensity={0.45}>
      <group ref={catRef} position={position} scale={scale}>
        {/* Cat Body (Golden Ginger) */}
        <mesh position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.46, 24, 24]} />
          <meshStandardMaterial color="#FFA726" roughness={0.55} />
        </mesh>

        {/* Cat Head */}
        <group position={[0, 0.32, 0]}>
          <mesh>
            <sphereGeometry args={[0.42, 24, 24]} />
            <meshStandardMaterial color="#FFA726" roughness={0.55} />
          </mesh>

          {/* Ears */}
          {[-1, 1].map((side) => (
            <group key={`ear-${side}`}>
              <mesh position={[side * 0.24, 0.35, -0.02]} rotation={[0, 0, side * -0.35]}>
                <coneGeometry args={[0.13, 0.26, 6]} />
                <meshStandardMaterial color="#FFA726" roughness={0.55} />
              </mesh>
              <mesh position={[side * 0.24, 0.33, 0.03]} rotation={[0, 0, side * -0.35]}>
                <coneGeometry args={[0.07, 0.16, 6]} />
                <meshStandardMaterial color="#FF80AB" roughness={0.4} />
              </mesh>
            </group>
          ))}

          {/* 3D Glowing Ruby Red Heart Eyes */}
          <mesh
            ref={leftHeartRef}
            position={[-0.14, 0.04, 0.36]}
            rotation={[0, 0, Math.PI]}
          >
            <extrudeGeometry
              args={[
                heartShape,
                { depth: 0.08, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.02, bevelThickness: 0.02 },
              ]}
            />
            <meshStandardMaterial color="#FF1493" emissive="#FF1493" emissiveIntensity={0.8} />
          </mesh>

          <mesh
            ref={rightHeartRef}
            position={[0.14, 0.04, 0.36]}
            rotation={[0, 0, Math.PI]}
          >
            <extrudeGeometry
              args={[
                heartShape,
                { depth: 0.08, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.02, bevelThickness: 0.02 },
              ]}
            />
            <meshStandardMaterial color="#FF1493" emissive="#FF1493" emissiveIntensity={0.8} />
          </mesh>

          {/* Happy Open Smile */}
          <mesh position={[0, -0.1, 0.34]} rotation={[0.2, 0, 0]}>
            <torusGeometry args={[0.06, 0.012, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#212121" />
          </mesh>
          {/* Pink Tongue */}
          <mesh position={[0, -0.14, 0.36]} rotation={[0.2, 0, 0]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#FF4081" />
          </mesh>

          {/* Rosy Blush */}
          {[-1, 1].map((side) => (
            <mesh key={`blush-${side}`} position={[side * 0.22, -0.06, 0.28]}>
              <circleGeometry args={[0.065, 12]} />
              <meshStandardMaterial color="#FF4081" transparent opacity={0.6} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
}
