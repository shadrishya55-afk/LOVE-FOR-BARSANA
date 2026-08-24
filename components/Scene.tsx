'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

import BalloonHeart from './three/BalloonHeart';
import FloatingHearts from './three/FloatingHearts';
import RosePetals from './three/RosePetals';
import CuteCat from './three/CuteCat';

// Background colors across 5 sections
const bgColors = [
  new THREE.Color('#0d021f'), // Hero - Cosmic Velvet Violet
  new THREE.Color('#380927'), // Love - Warm Sunset Rose
  new THREE.Color('#2d0e3a'), // Cats - Playful Pastel Wine
  new THREE.Color('#140529'), // Reasons - Starry Lilac Indigo
  new THREE.Color('#340528'), // Finale - Celestial Golden Rose
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
    meshRef.current.rotation.y = t * 0.4;
    const pulse = 1 + Math.sin(t * 2.2) * 0.06;
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
        emissiveIntensity={0.45}
        metalness={0.2}
        roughness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function World({ scrollY }: { scrollY: number }) {
  const cameraTargetY = useRef(0);
  const bgColor = useRef(new THREE.Color('#0d021f'));

  useFrame(({ camera, scene }) => {
    const maxScroll = typeof document !== 'undefined'
      ? Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      : 1;
    const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

    // Smoothly lerp camera position down through the 5 scenes (0 to -24)
    const targetY = -progress * 24;
    cameraTargetY.current = THREE.MathUtils.lerp(cameraTargetY.current, targetY, 0.08);
    camera.position.y = cameraTargetY.current;

    // Smoothly lerp background color
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
      {/* ── Scene 0 (Hero - y: 0): Balloon Hearts & Sparkles ── */}
      <group position={[0, 0, 0]}>
        <BalloonHeart position={[-2.4, 1.2, -0.6]} color={heartColors[0]} scale={0.8} speed={1.1} />
        <BalloonHeart position={[2.5, 1.4, -0.5]} color={heartColors[1]} scale={0.85} speed={0.9} />
        <BalloonHeart position={[-2.0, -1.0, -1.2]} color={heartColors[2]} scale={0.65} speed={1.3} />
        <BalloonHeart position={[2.1, -0.9, -1.0]} color={heartColors[3]} scale={0.7} speed={1.0} />
        <BalloonHeart position={[-1.2, 2.0, -1.0]} color={heartColors[4]} scale={0.6} speed={1.2} />
        <BalloonHeart position={[1.3, 2.1, -1.3]} color={heartColors[5]} scale={0.55} speed={0.8} />
        <FloatingHearts count={25} area={[10, 8, 4]} />
        <Sparkles count={50} scale={[12, 10, 5]} size={3} speed={0.4} color="#FFD700" />
      </group>

      {/* ── Scene 1 (Love Story - y: -6): Big Rotating Heart & Petals ── */}
      <group position={[0, -6, 0]}>
        <BigHeart position={[0, 0.8, 0]} />
        <RosePetals count={35} area={[12, 10, 5]} />
        <Sparkles count={40} scale={[10, 8, 4]} size={2.5} speed={0.5} color="#FF69B4" />
        <pointLight position={[2, 2, 2]} intensity={0.9} color="#FF1493" distance={10} />
      </group>

      {/* ── Scene 2 (Meme Cats - y: -12): 3D Cats in Funny Poses ── */}
      <group position={[0, -12, 0]}>
        <CuteCat position={[-2.4, -0.5, 0.2]} color="#FFA07A" scale={1.1} variant="sitting" />
        <CuteCat position={[0, 0.3, 0.6]} color="#F48FB1" scale={1.3} variant="waving" />
        <CuteCat position={[2.4, -0.7, -0.2]} color="#FFE082" scale={1.05} variant="sleeping" />
        <Sparkles count={50} scale={[12, 9, 5]} size={3} speed={0.9} color="#FFD700" />
        <Sparkles count={30} scale={[8, 6, 3]} size={2} speed={1.2} color="#FF69B4" />
        <pointLight position={[0, 3, 3]} intensity={1.3} color="#FFDAB9" distance={12} />
      </group>

      {/* ── Scene 3 (Reasons - y: -18): Floating Hearts Rain ── */}
      <group position={[0, -18, 0]}>
        <FloatingHearts count={45} area={[12, 10, 5]} colors={heartColors} speed={1.0} />
        <Sparkles count={45} scale={[12, 10, 5]} size={2.5} speed={0.5} color="#C084FC" />
        <pointLight position={[3, 3, 3]} intensity={0.9} color="#C084FC" distance={10} />
      </group>

      {/* ── Scene 4 (Grand Finale - y: -24): Waving Cat & Celebration Fireworks ── */}
      <group position={[0, -24, 0]}>
        <CuteCat position={[2.2, -0.8, 0.2]} color="#FFA07A" scale={1.2} variant="waving" />
        <FloatingHearts count={55} area={[14, 12, 6]} colors={heartColors} speed={1.3} />
        <Sparkles count={70} scale={[14, 12, 6]} size={4} speed={0.7} color="#FFD700" />
        <Sparkles count={50} scale={[10, 10, 4]} size={3} speed={1.0} color="#FF69B4" />
        <pointLight position={[0, 3, 3]} intensity={1.8} color="#FFD700" distance={15} />
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
          <color attach="background" args={['#0d021f']} />
          <fog attach="fog" args={['#0d021f', 8, 32]} />

          {/* Lights */}
          <ambientLight intensity={0.45} />
          <directionalLight position={[5, 6, 5]} intensity={0.5} color="#FFE4E1" />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#FF69B4" distance={30} />
          <pointLight position={[-10, -5, -5]} intensity={0.6} color="#FFD700" distance={25} />

          {/* Stars */}
          <Stars radius={80} depth={60} count={900} factor={4} saturation={0.5} fade speed={0.8} />

          {/* World */}
          <World scrollY={scrollY} />
        </Suspense>
      </Canvas>
    </div>
  );
}
