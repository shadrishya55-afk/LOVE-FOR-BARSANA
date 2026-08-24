'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingHeartsProps {
  count?: number;
  area?: [number, number, number];
  position?: [number, number, number];
  colors?: string[];
  speed?: number;
}

export default function FloatingHearts({
  count = 25,
  area = [10, 8, 5],
  position = [0, 0, 0],
  colors = ['#FF6B9D', '#FF1493', '#FF69B4', '#FFB6C1', '#C084FC'],
  speed = 1,
}: FloatingHeartsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.3);
    shape.bezierCurveTo(0, 0.3, -0.05, 0.2, -0.15, 0.2);
    shape.bezierCurveTo(-0.35, 0.2, -0.35, 0.45, -0.35, 0.45);
    shape.bezierCurveTo(-0.35, 0.6, -0.2, 0.77, 0, 0.9);
    shape.bezierCurveTo(0.2, 0.77, 0.35, 0.6, 0.35, 0.45);
    shape.bezierCurveTo(0.35, 0.45, 0.35, 0.2, 0.15, 0.2);
    shape.bezierCurveTo(0.05, 0.2, 0, 0.3, 0, 0.3);
    return shape;
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * area[0],
          (Math.random() - 0.5) * area[1],
          (Math.random() - 0.5) * area[2],
        ),
        speed: (0.2 + Math.random() * 0.5) * speed,
        rotSpeed: (Math.random() - 0.5) * 2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.5 + Math.random(),
        scale: 0.04 + Math.random() * 0.08,
        color: new THREE.Color(colors[Math.floor(Math.random() * colors.length)]),
      })),
    [count, area, colors, speed],
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    particles.forEach((p, i) => {
      p.pos.y += p.speed * 0.006;
      p.pos.x += Math.sin(t * p.wobbleSpeed + p.wobble) * 0.008;

      if (p.pos.y > area[1] / 2) {
        p.pos.y = -area[1] / 2;
        p.pos.x = (Math.random() - 0.5) * area[0];
        p.pos.z = (Math.random() - 0.5) * area[2];
      }

      dummy.position.copy(p.pos);
      dummy.rotation.set(0, t * p.rotSpeed * 0.5, Math.sin(t * p.rotSpeed) * 0.3);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      meshRef.current!.setColorAt(i, p.color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <group position={position}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <shapeGeometry args={[heartShape]} />
        <meshStandardMaterial
          side={THREE.DoubleSide}
          emissive="#FF6B9D"
          emissiveIntensity={0.5}
          transparent
          opacity={0.75}
        />
      </instancedMesh>
    </group>
  );
}
