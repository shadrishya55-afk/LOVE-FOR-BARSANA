'use client';

import { useRef, useMemo } from 'react';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function createHeartShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.5);
  shape.bezierCurveTo(0, 0.5, -0.1, 0.35, -0.25, 0.35);
  shape.bezierCurveTo(-0.55, 0.35, -0.55, 0.65, -0.55, 0.65);
  shape.bezierCurveTo(-0.55, 0.85, -0.35, 1.07, 0, 1.25);
  shape.bezierCurveTo(0.35, 1.07, 0.55, 0.85, 0.55, 0.65);
  shape.bezierCurveTo(0.55, 0.65, 0.55, 0.35, 0.25, 0.35);
  shape.bezierCurveTo(0.1, 0.35, 0, 0.5, 0, 0.5);
  return shape;
}

interface BalloonHeartProps {
  position: [number, number, number];
  color?: string;
  scale?: number;
  speed?: number;
}

export default function BalloonHeart({
  position,
  color = '#FF6B9D',
  scale = 1,
  speed = 1,
}: BalloonHeartProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const heartShape = useMemo(() => createHeartShape(), []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.25,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.05,
      bevelThickness: 0.04,
    }),
    [],
  );

  const stringCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.35, 0.12),
        new THREE.Vector3(0.04, -0.1, 0.12),
        new THREE.Vector3(-0.03, -0.5, 0.12),
        new THREE.Vector3(0.02, -0.9, 0.12),
      ]),
    [],
  );

  return (
    <Float
      speed={speed}
      rotationIntensity={0.4}
      floatIntensity={0.6}
      floatingRange={[-0.15, 0.15]}
    >
      <group position={position} scale={scale}>
        {/* Heart balloon */}
        <mesh ref={meshRef} rotation={[0, 0, Math.PI]} position={[0, 0.8, 0]}>
          <extrudeGeometry args={[heartShape, extrudeSettings]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.35}
            metalness={0.15}
            roughness={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* String */}
        <mesh>
          <tubeGeometry args={[stringCurve, 20, 0.008, 6, false]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
      </group>
    </Float>
  );
}
