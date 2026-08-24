'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

import BalloonHeart from './three/BalloonHeart';
import FloatingHearts from './three/FloatingHearts';
import RosePetals from './three/RosePetals';
import CuteCat from './three/CuteCat';

// Background colors smoothly shifting from Deep Blue to Radiant Pink
const bgColors = [
  new THREE.Color('#050e26'), // 0: Deep Sapphire Royal Blue (Hero)
  new THREE.Color('#110f38'), // 1: Dreamy Midnight Indigo (Love)
  new THREE.Color('#280f3b'), // 2: Mystic Twilight Violet (Cats)
  new THREE.Color('#430f36'), // 3: Sunset Rose Plum (Reasons)
  new THREE.Color('#5a0f3c'), // 4: Radiant Celestial Rose Pink (Finale)
];

const heartColors = [
  '#FF6B9D',
  '#FF1493',
  '#FFD700',
  '#C084FC',
  '#FF69B4',
  '#FFA500',
  '#E91E63',
  '#FFB6C1',
];

function BigHeart({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const heartShape = useRef(
    (() => {
      const s = new THREE.Shape();
      s.moveTo(0, 0.5);
      s.bezierCurveTo(0, 0.5, -0.1, 0.35, -0.25, 0.35);
      s.bezierCurveTo(-0.55, 0.35, -0.55, 0.65, -0.55, 0.65);
      s.bezierCurveTo(-0.55, 0.85, -0.35, 1.07, 0, 1.25);
      s.bezierCurveTo(0.35, 1.07, 0.55, 0.85, 0.55, 0.65);
      s.bezierCurveTo(0.55, 0.65, 0.55, 0.35, 0.25, 0.35);
      s.bezierCurveTo(0.1, 0.35, 0, 0.5, 0, 0.5);
      return s;
    })(),
  ).current;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.35;
    const pulse = 1 + Math.sin(t * 2.2) * 0.05;
    meshRef.current.scale.setScalar(pulse * 1.8);
  });

  return (
    <mesh ref={meshRef} rotation={[0, 0, Math.PI]} position={position}>
      <extrudeGeometry
        args={[
          heartShape,
          {
            depth: 0.35,
            bevelEnabled: true,
            bevelSegments: 4,
            bevelSize: 0.06,
            bevelThickness: 0.05,
          },
        ]}
      />
      <meshStandardMaterial
        color="#FF1493"
        emissive="#FF1493"
        emissiveIntensity={0.5}
        metalness={0.2}
        roughness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function World({ scrollY }: { scrollY: number }) {
  const cameraTargetY = useRef(0);
  const bgColor = useRef(new THREE.Color('#050e26'));

  useFrame(({ camera, scene }) => {
    const maxScroll = typeof document !== 'undefined'
      ? Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      : 1;
    const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

    // Camera travels smoothly across all 5 sections
    const targetY = -progress * 24;
    cameraTargetY.current = THREE.MathUtils.lerp(cameraTargetY.current, targetY, 0.08);
    camera.position.y = cameraTargetY.current;

    // Gradient transition from Blue to Pink
    const colorProgress = progress * (bgColors.length - 1);
    const index = Math.min(Math.floor(colorProgress), bgColors.length - 2);
    const fraction = colorProgress - index;

    bgColor.current.lerpColors(bgColors[index], bgColors[index + 1] || bgColors[index], fraction);
    scene.background = bgColor.current;
    if (scene.fog) {
      scene.fog.color = bgColor.current;
    }
  });

  return (
    <>
      {/* ── Global Subtle Floating Hearts in Background ── */}
      <FloatingHearts count={35} area={[16, 32, 6]} colors={heartColors} speed={0.6} />

      {/* ── Scene 0 (Hero - Sapphire Blue World): 3D Balloons & Glow ── */}
      <group position={[0, 0, 0]}>
        <BalloonHeart position={[-2.5, 1.2, -0.6]} color="#64B5F6" scale={0.8} speed={1.1} />
        <BalloonHeart position={[2.6, 1.4, -0.5]} color="#BA68C8" scale={0.85} speed={0.9} />
        <BalloonHeart position={[-2.1, -1.0, -1.2]} color="#FF6B9D" scale={0.65} speed={1.3} />
        <BalloonHeart position={[2.2, -0.9, -1.0]} color="#FFD700" scale={0.7} speed={1.0} />
        <BalloonHeart position={[-1.2, 2.0, -1.0]} color="#4FC3F7" scale={0.6} speed={1.2} />
        <BalloonHeart position={[1.3, 2.1, -1.3]} color="#F06292" scale={0.55} speed={0.8} />
        <Sparkles count={60} scale={[14, 10, 5]} size={3.5} speed={0.4} color="#64B5F6" />
        <Sparkles count={40} scale={[10, 8, 4]} size={2.5} speed={0.6} color="#FFD700" />
      </group>

      {/* ── Scene 1 (Love Story - Indigo Violet): Giant Heart & Rose Petals ── */}
      <group position={[0, -6, 0]}>
        <BigHeart position={[0, 0.8, 0]} />
        <RosePetals count={35} area={[12, 10, 5]} />
        <Sparkles count={50} scale={[12, 8, 4]} size={3} speed={0.5} color="#BA68C8" />
        <pointLight position={[2, 2, 2]} intensity={1.1} color="#BA68C8" distance={12} />
      </group>

      {/* ── Scene 2 (Cats - Twilight Violet): 3D Cute Cats ── */}
      <group position={[0, -12, 0]}>
        <CuteCat position={[-2.4, -0.5, 0.2]} color="#FFA07A" scale={1.1} variant="sitting" />
        <CuteCat position={[0, 0.3, 0.6]} color="#F48FB1" scale={1.35} variant="waving" />
        <CuteCat position={[2.4, -0.7, -0.2]} color="#FFE082" scale={1.05} variant="sleeping" />
        <Sparkles count={55} scale={[12, 9, 5]} size={3} speed={0.9} color="#FFD700" />
        <Sparkles count={35} scale={[8, 6, 3]} size={2.5} speed={1.2} color="#F48FB1" />
        <pointLight position={[0, 3, 3]} intensity={1.3} color="#FFDAB9" distance={12} />
      </group>

      {/* ── Scene 3 (Reasons - Sunset Rose): Floating Hearts Cascade ── */}
      <group position={[0, -18, 0]}>
        <FloatingHearts count={45} area={[12, 10, 5]} colors={heartColors} speed={0.9} />
        <Sparkles count={55} scale={[12, 10, 5]} size={3} speed={0.5} color="#FF69B4" />
        <pointLight position={[3, 3, 3]} intensity={1.1} color="#FF69B4" distance={12} />
      </group>

      {/* ── Scene 4 (Finale - Celestial Pink): Waving Cat & Celebration Fireworks ── */}
      <group position={[0, -24, 0]}>
        <CuteCat position={[2.2, -0.8, 0.2]} color="#FFA07A" scale={1.2} variant="waving" />
        <FloatingHearts count={60} area={[14, 12, 6]} colors={heartColors} speed={1.2} />
        <Sparkles count={80} scale={[14, 12, 6]} size={4.5} speed={0.7} color="#FFD700" />
        <Sparkles count={60} scale={[10, 10, 4]} size={3.5} speed={1.0} color="#FF1493" />
        <pointLight position={[0, 3, 3]} intensity={2.0} color="#FFD700" distance={15} />
      </group>
    </>
  );
}

export default function Scene() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#050e26']} />
          <fog attach="fog" args={['#050e26', 8, 32]} />

          {/* Lights */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 6, 5]} intensity={0.6} color="#E1F5FE" />
          <pointLight position={[10, 10, 10]} intensity={0.9} color="#64B5F6" distance={30} />
          <pointLight position={[-10, -5, -5]} intensity={0.7} color="#FF80AB" distance={25} />

          {/* Stars */}
          <Stars radius={80} depth={60} count={950} factor={4} saturation={0.6} fade speed={0.8} />

          {/* 3D World */}
          <World scrollY={scrollY} />
        </Suspense>
      </Canvas>
    </div>
  );
}
