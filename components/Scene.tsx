'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

import BalloonHeart from './three/BalloonHeart';
import FloatingHearts from './three/FloatingHearts';
import RosePetals from './three/RosePetals';
import FloatingMemeCats from './three/FloatingMemeCats';

// High-visibility, rich vibrant Blue-to-Pink gradient colors across sections
const bgColors = [
  new THREE.Color('#05133d'), // 0: Rich Royal Sapphire Blue (Hero)
  new THREE.Color('#141757'), // 1: Deep Twilight Indigo (Gallery)
  new THREE.Color('#28135c'), // 2: Mystic Royal Violet (Our Story)
  new THREE.Color('#4c1264'), // 3: Twilight Magenta (Love Story)
  new THREE.Color('#6e1363'), // 4: Sunset Berry Rose (Cat Memes)
  new THREE.Color('#85125e'), // 5: Passionate Berry Plum (Mini Game)
  new THREE.Color('#9e125d'), // 6: Sunset Rose Plum (Reasons)
  new THREE.Color('#c2185b'), // 7: Radiant Celestial Rose Pink (Finale)
];

const heartColors = [
  '#60A5FA',
  '#F472B6',
  '#FBBF24',
  '#C084FC',
  '#EC4899',
  '#F59E0B',
  '#E11D48',
  '#FDA4AF',
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
        color="#EC4899"
        emissive="#EC4899"
        emissiveIntensity={0.55}
        metalness={0.2}
        roughness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function World({ scrollY }: { scrollY: number }) {
  const cameraTargetY = useRef(0);
  const bgColor = useRef(new THREE.Color('#05133d'));

  useFrame(({ camera, scene }) => {
    const maxScroll = typeof document !== 'undefined'
      ? Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      : 1;
    const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

    // Camera travels smoothly across all sections
    const targetY = -progress * 34;
    cameraTargetY.current = THREE.MathUtils.lerp(cameraTargetY.current, targetY, 0.08);
    camera.position.y = cameraTargetY.current;

    // Vibrant Gradient transition from Blue to Pink
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
      <FloatingHearts count={45} area={[16, 42, 6]} colors={heartColors} speed={0.65} />

      {/* ── 3D Meme Cats Floating Across All Sections (Banana, Pop, Heart Eyes, Polite, Thumbs Up) ── */}
      <FloatingMemeCats />

      {/* ── Scene 0 (Hero): 3D Balloons & Glow ── */}
      <group position={[0, 0, 0]}>
        <BalloonHeart position={[-2.4, 1.3, -0.6]} color="#60A5FA" scale={0.85} speed={1.1} />
        <BalloonHeart position={[2.4, 1.5, -0.5]} color="#C084FC" scale={0.9} speed={0.9} />
        <BalloonHeart position={[-2.0, -1.0, -1.2]} color="#F472B6" scale={0.7} speed={1.3} />
        <BalloonHeart position={[2.0, -0.9, -1.0]} color="#FBBF24" scale={0.75} speed={1.0} />
        <Sparkles count={70} scale={[14, 10, 5]} size={3.5} speed={0.4} color="#60A5FA" />
        <Sparkles count={45} scale={[10, 8, 4]} size={2.5} speed={0.6} color="#FBBF24" />
      </group>

      {/* ── Scene 1 (Gallery): Starry Dust ── */}
      <group position={[0, -5, 0]}>
        <FloatingHearts count={25} area={[14, 8, 5]} colors={['#60A5FA', '#C084FC', '#F472B6']} speed={0.8} />
        <Sparkles count={55} scale={[12, 9, 5]} size={3} speed={0.5} color="#A78BFA" />
        <pointLight position={[0, 2, 2]} intensity={1.2} color="#A78BFA" distance={12} />
      </group>

      {/* ── Scene 2 (Our Story): Romantic Heart & Petals ── */}
      <group position={[0, -10, 0]}>
        <BigHeart position={[0, 0.6, 0]} />
        <RosePetals count={40} area={[14, 10, 5]} />
        <Sparkles count={60} scale={[12, 8, 4]} size={3} speed={0.6} color="#F472B6" />
        <pointLight position={[2, 2, 2]} intensity={1.2} color="#F472B6" distance={12} />
      </group>

      {/* ── Scene 3 (50 Shades of Cats): Sparkles & Lighting ── */}
      <group position={[0, -16, 0]}>
        <Sparkles count={60} scale={[12, 9, 5]} size={3} speed={0.9} color="#FBBF24" />
        <Sparkles count={40} scale={[8, 6, 3]} size={2.5} speed={1.2} color="#F472B6" />
        <pointLight position={[0, 3, 3]} intensity={1.4} color="#FFDAB9" distance={14} />
      </group>

      {/* ── Scene 4 (Mini Game): Cheerleader Floating Hearts ── */}
      <group position={[0, -22, 0]}>
        <FloatingHearts count={35} area={[14, 10, 5]} colors={heartColors} speed={1.1} />
        <Sparkles count={60} scale={[12, 10, 5]} size={3.5} speed={0.7} color="#FBBF24" />
      </group>

      {/* ── Scene 5 (Reasons): Sunset Rose Hearts ── */}
      <group position={[0, -28, 0]}>
        <FloatingHearts count={50} area={[14, 10, 5]} colors={heartColors} speed={0.95} />
        <Sparkles count={60} scale={[12, 10, 5]} size={3} speed={0.5} color="#EC4899" />
        <pointLight position={[3, 3, 3]} intensity={1.2} color="#EC4899" distance={12} />
      </group>

      {/* ── Scene 6 (Finale): Celebration Fireworks ── */}
      <group position={[0, -34, 0]}>
        <FloatingHearts count={75} area={[14, 12, 6]} colors={heartColors} speed={1.3} />
        <Sparkles count={95} scale={[14, 12, 6]} size={4.5} speed={0.7} color="#FBBF24" />
        <Sparkles count={75} scale={[10, 10, 4]} size={3.5} speed={1.0} color="#F43F5E" />
        <pointLight position={[0, 3, 3]} intensity={2.2} color="#FBBF24" distance={18} />
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
          <color attach="background" args={['#05133d']} />
          <fog attach="fog" args={['#05133d', 8, 36]} />

          {/* Lights */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 6, 5]} intensity={0.7} color="#E0F2FE" />
          <pointLight position={[10, 10, 10]} intensity={1.0} color="#60A5FA" distance={32} />
          <pointLight position={[-10, -5, -5]} intensity={0.8} color="#F472B6" distance={28} />

          {/* Stars */}
          <Stars radius={80} depth={60} count={980} factor={4.5} saturation={0.6} fade speed={0.8} />

          {/* 3D World */}
          <World scrollY={scrollY} />
        </Suspense>
      </Canvas>
    </div>
  );
}
