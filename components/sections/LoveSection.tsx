'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import RosePetals from '../three/RosePetals';

/* ═══════════════════════  3D CONTENT  ═══════════════════════ */

const SECTION = 1;
const TOTAL = 5;

function BigHeart() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scroll = useScroll();

  const heartShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.5);
    s.bezierCurveTo(0, 0.5, -0.1, 0.35, -0.25, 0.35);
    s.bezierCurveTo(-0.55, 0.35, -0.55, 0.65, -0.55, 0.65);
    s.bezierCurveTo(-0.55, 0.85, -0.35, 1.07, 0, 1.25);
    s.bezierCurveTo(0.35, 1.07, 0.55, 0.85, 0.55, 0.65);
    s.bezierCurveTo(0.55, 0.65, 0.55, 0.35, 0.25, 0.35);
    s.bezierCurveTo(0.1, 0.35, 0, 0.5, 0, 0.5);
    return s;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.4,
      bevelEnabled: true,
      bevelSegments: 5,
      bevelSize: 0.08,
      bevelThickness: 0.06,
    }),
    [],
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const progress = scroll.range(SECTION / TOTAL, 1 / TOTAL);

    // Continuous rotation
    meshRef.current.rotation.y = t * 0.3;
    // Pulse
    const pulse = 1 + Math.sin(t * 2) * 0.05;
    meshRef.current.scale.setScalar(pulse * (0.5 + progress * 0.5));
  });

  return (
    <mesh ref={meshRef} rotation={[0, 0, Math.PI]} position={[0, 0.8, 0]}>
      <extrudeGeometry args={[heartShape, extrudeSettings]} />
      <meshStandardMaterial
        color="#FF1493"
        emissive="#FF1493"
        emissiveIntensity={0.5}
        metalness={0.25}
        roughness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function LoveSection3D() {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const isMobile = viewport.width < 6;
  const yOffset = -SECTION * viewport.height;

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = scroll.range(SECTION / TOTAL, 1 / TOTAL);
    groupRef.current.position.y = yOffset;
    // Fade in via scale
    const s = Math.min(1, progress * 3);
    groupRef.current.scale.setScalar(Math.max(s, 0.01));
  });

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {/* Big rotating heart */}
      <group scale={isMobile ? 1.6 : 2.5}>
        <BigHeart />
      </group>

      {/* Rose petals */}
      <RosePetals
        count={isMobile ? 20 : 40}
        area={[viewport.width, viewport.height, 5]}
      />

      {/* Warm sparkles */}
      <Sparkles
        count={isMobile ? 25 : 50}
        scale={[viewport.width * 0.7, viewport.height * 0.7, 4]}
        size={2}
        speed={0.3}
        color="#FF69B4"
      />

      {/* Accent lights */}
      <pointLight position={[2, 2, 2]} intensity={0.8} color="#FF1493" distance={8} />
      <pointLight position={[-2, -1, 2]} intensity={0.6} color="#C084FC" distance={8} />
    </group>
  );
}

/* ═══════════════════════  HTML OVERLAY  ═══════════════════════ */

const loveQuotes = [
  { emoji: '💫', text: 'Every moment with you feels like a dream' },
  { emoji: '🌹', text: 'You make my world more beautiful just by being in it' },
  { emoji: '💓', text: 'My heart beats only for you' },
  { emoji: '🌙', text: 'You are the best thing that ever happened to me' },
];

export function LoveOverlay() {
  return (
    <div
      className="section-overlay justify-around py-16"
      style={{ top: `${SECTION * 100}vh` }}
    >
      {/* Title */}
      <h2 className="font-cursive text-2xl md:text-4xl text-pink-200 glow-text text-center">
        My Love for You
      </h2>

      {/* Quotes */}
      <div className="flex flex-col gap-5 md:gap-6 max-w-sm md:max-w-md px-4">
        {loveQuotes.map((q, i) => (
          <div
            key={i}
            className="glass-card px-5 py-4 text-center fade-in-up"
            style={{ animationDelay: `${0.3 + i * 0.4}s` }}
          >
            <span className="text-xl md:text-2xl block mb-1">{q.emoji}</span>
            <p className="text-white/90 text-sm md:text-base font-light leading-relaxed font-display italic">
              &ldquo;{q.text}&rdquo;
            </p>
          </div>
        ))}
      </div>

      <div />
    </div>
  );
}
