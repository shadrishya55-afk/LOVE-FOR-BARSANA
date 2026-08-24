'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RosePetalsProps {
  count?: number;
  area?: [number, number, number];
  position?: [number, number, number];
}

export default function RosePetals({
  count = 35,
  area = [12, 10, 6],
  position = [0, 0, 0],
}: RosePetalsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const petals = useMemo(() => {
    const palette = ['#FF6B9D', '#FF1493', '#FF69B4', '#DB7093', '#C71585'];
    return Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * area[0],
        Math.random() * area[1],
        (Math.random() - 0.5) * area[2],
      ),
      rot: new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ),
      fallSpeed: 0.25 + Math.random() * 0.35,
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 1.8,
        (Math.random() - 0.5) * 1.8,
        (Math.random() - 0.5) * 1.8,
      ),
      drift: Math.random() * Math.PI * 2,
      scale: 0.04 + Math.random() * 0.07,
      color: new THREE.Color(palette[Math.floor(Math.random() * palette.length)]),
    }));
  }, [count, area]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    petals.forEach((p, i) => {
      p.pos.y -= p.fallSpeed * 0.008;
      p.pos.x += Math.sin(t * 0.6 + p.drift) * 0.004;
      p.pos.z += Math.cos(t * 0.4 + p.drift) * 0.003;

      p.rot.x += p.rotSpeed.x * 0.006;
      p.rot.y += p.rotSpeed.y * 0.006;
      p.rot.z += p.rotSpeed.z * 0.006;

      if (p.pos.y < -area[1] / 2) {
        p.pos.y = area[1] / 2;
        p.pos.x = (Math.random() - 0.5) * area[0];
        p.pos.z = (Math.random() - 0.5) * area[2];
      }

      dummy.position.copy(p.pos);
      dummy.rotation.copy(p.rot);
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
        <planeGeometry args={[1, 0.65]} />
        <meshStandardMaterial
          side={THREE.DoubleSide}
          transparent
          opacity={0.7}
          roughness={0.5}
        />
      </instancedMesh>
    </group>
  );
}
