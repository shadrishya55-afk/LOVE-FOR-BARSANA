'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Sparkles, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import BalloonHeart from '../three/BalloonHeart';
import FloatingHearts from '../three/FloatingHearts';

/* ═══════════════════════  3D CONTENT  ═══════════════════════ */

const SECTION = 0;
const TOTAL = 5;

const heartColors = ['#FF6B9D', '#FF1493', '#FF69B4', '#C084FC', '#FFB6C1', '#FFD700', '#E91E63', '#AB47BC'];

export function HeroSection3D() {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  const isMobile = viewport.width < 6;
  const yOffset = -SECTION * viewport.height;

  // Balloon positions — responsive
  const spread = isMobile ? 0.65 : 1;
  const balloons: { pos: [number, number, number]; s: number }[] = [
    { pos: [-2.8 * spread, 1.5, -1], s: 0.7 },
    { pos: [3 * spread, 1.8, -0.6], s: 0.8 },
    { pos: [-2.2 * spread, -0.8, -2], s: 0.6 },
    { pos: [2.5 * spread, -0.5, -1.5], s: 0.65 },
    { pos: [-1.2 * spread, 2.3, -1.2], s: 0.55 },
    { pos: [1.5 * spread, 2.5, -2], s: 0.5 },
  ];

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = scroll.range(SECTION / TOTAL, 1 / TOTAL);
    // Gently push content up as user scrolls away
    groupRef.current.position.y = yOffset - progress * 2;
    // Slight zoom-out
    const s = 1 - progress * 0.15;
    groupRef.current.scale.setScalar(Math.max(s, 0.5));
  });

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {/* ── Name ── */}
      <Text
        position={[0, 0.6, 0]}
        fontSize={isMobile ? 0.5 : 0.9}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
        material-emissive="#FFD700"
        material-emissiveIntensity={0.5}
        material-toneMapped={false}
      >
        BARSANA
      </Text>
      <Text
        position={[0, -0.2, 0]}
        fontSize={isMobile ? 0.22 : 0.38}
        color="#FF69B4"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
        material-emissive="#FF69B4"
        material-emissiveIntensity={0.4}
        material-toneMapped={false}
      >
        MUKHOPADHYAY
      </Text>

      {/* ── Balloon hearts ── */}
      {balloons.map((b, i) => (
        <BalloonHeart
          key={i}
          position={b.pos}
          color={heartColors[i % heartColors.length]}
          scale={b.s * (isMobile ? 0.7 : 1)}
          speed={1 + (i % 3) * 0.5}
        />
      ))}

      {/* ── Sparkles ── */}
      <Sparkles
        count={isMobile ? 30 : 60}
        scale={[viewport.width * 0.8, viewport.height * 0.8, 4]}
        size={isMobile ? 2 : 3}
        speed={0.4}
        color="#FFD700"
      />

      {/* ── Floating mini hearts ── */}
      <FloatingHearts
        count={isMobile ? 15 : 25}
        area={[viewport.width * 0.9, viewport.height * 0.9, 3]}
      />
    </group>
  );
}

/* ═══════════════════════  HTML OVERLAY  ═══════════════════════ */

export function HeroOverlay() {
  return (
    <div
      className="section-overlay"
      style={{ top: `${SECTION * 100}vh` }}
    >
      {/* Push content to bottom */}
      <div className="flex-1" />

      <p
        className="text-pink-200/90 text-base md:text-xl text-center max-w-md leading-relaxed font-light tracking-wide fade-in-up"
        style={{ animationDelay: '1.5s' }}
      >
        ✨ This website is made with love, just for you ✨
      </p>

      {/* Scroll indicator */}
      <div className="mt-10 mb-8 flex flex-col items-center gap-2 animate-float">
        <p className="text-white/40 text-xs tracking-[0.25em] uppercase">Scroll down</p>
        <span className="text-lg">💕</span>
        <div className="w-px h-6 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </div>
  );
}
