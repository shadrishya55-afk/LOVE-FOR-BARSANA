'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import BalloonHeart from '../three/BalloonHeart';
import FloatingHearts from '../three/FloatingHearts';

/* ═══════════════════════  3D CONTENT  ═══════════════════════ */

const SECTION = 0;
const TOTAL = 5;

const heartColors = [
  '#FF6B9D',
  '#FF1493',
  '#FF69B4',
  '#C084FC',
  '#FFB6C1',
  '#FFD700',
  '#E91E63',
  '#AB47BC',
];

export function HeroSection3D() {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  const isMobile = viewport.width < 6;
  const yOffset = -SECTION * viewport.height;

  // Balloon positions — responsive spread
  const spread = isMobile ? 0.7 : 1.1;
  const balloons: { pos: [number, number, number]; s: number }[] = [
    { pos: [-2.6 * spread, 1.4, -0.8], s: 0.75 },
    { pos: [2.8 * spread, 1.6, -0.5], s: 0.85 },
    { pos: [-2.0 * spread, -0.9, -1.5], s: 0.65 },
    { pos: [2.3 * spread, -0.7, -1.2], s: 0.7 },
    { pos: [-1.1 * spread, 2.2, -1.0], s: 0.6 },
    { pos: [1.3 * spread, 2.4, -1.5], s: 0.55 },
    { pos: [-3.2 * spread, 0.2, -2.0], s: 0.5 },
    { pos: [3.4 * spread, 0.1, -1.8], s: 0.55 },
  ];

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = scroll.range(SECTION / TOTAL, 1 / TOTAL);
    groupRef.current.position.y = yOffset - progress * 2;
    const s = 1 - progress * 0.15;
    groupRef.current.scale.setScalar(Math.max(s, 0.5));
  });

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {/* ── Balloon hearts floating around her name ── */}
      {balloons.map((b, i) => (
        <BalloonHeart
          key={i}
          position={b.pos}
          color={heartColors[i % heartColors.length]}
          scale={b.s * (isMobile ? 0.75 : 1)}
          speed={1 + (i % 3) * 0.4}
        />
      ))}

      {/* ── Sparkles ── */}
      <Sparkles
        count={isMobile ? 35 : 70}
        scale={[viewport.width * 0.9, viewport.height * 0.9, 4]}
        size={isMobile ? 2.5 : 3.5}
        speed={0.4}
        color="#FFD700"
      />

      {/* ── Floating mini hearts ── */}
      <FloatingHearts
        count={isMobile ? 18 : 30}
        area={[viewport.width * 0.9, viewport.height * 0.9, 3]}
      />
    </group>
  );
}

/* ═══════════════════════  HTML OVERLAY  ═══════════════════════ */

export function HeroOverlay() {
  return (
    <div
      className="section-overlay justify-center items-center text-center px-4"
      style={{ top: `${SECTION * 100}vh` }}
    >
      <div className="flex flex-col items-center justify-center -mt-8">
        <p className="text-pink-300/90 text-sm md:text-lg font-light tracking-[0.3em] uppercase mb-3 animate-float">
          ✨ For My Beloved ✨
        </p>

        <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl gradient-text glow-text tracking-wider leading-tight">
          BARSANA
        </h1>

        <h2 className="font-display font-semibold text-2xl sm:text-4xl md:text-5xl text-pink-300 glow-text tracking-[0.18em] mt-1">
          MUKHOPADHYAY
        </h2>

        <p
          className="text-pink-200/90 text-sm md:text-lg text-center max-w-md leading-relaxed font-light tracking-wide mt-6 fade-in-up"
          style={{ animationDelay: '0.8s' }}
        >
          💕 A 3D universe of love, made just for you 💕
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 flex flex-col items-center gap-2 animate-float">
        <p className="text-white/50 text-xs tracking-[0.25em] uppercase">Scroll down</p>
        <span className="text-xl">💕</span>
        <div className="w-px h-8 bg-gradient-to-b from-pink-400 to-transparent" />
      </div>
    </div>
  );
}
