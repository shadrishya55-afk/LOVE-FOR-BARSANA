'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import Image from 'next/image';
import BalloonHeart from '../three/BalloonHeart';
import FloatingHearts from '../three/FloatingHearts';

/* ═══════════════════════  3D CONTENT  ═══════════════════════ */

const SECTION = 0;
const TOTAL = 5;

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

export function HeroSection3D() {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  const isMobile = viewport.width < 6;
  const yOffset = -SECTION * viewport.height;

  // Responsive spread of balloon hearts orbiting her photo
  const spread = isMobile ? 0.75 : 1.25;
  const balloons: { pos: [number, number, number]; s: number }[] = [
    { pos: [-2.4 * spread, 1.3, -0.6], s: 0.8 },
    { pos: [2.5 * spread, 1.4, -0.5], s: 0.85 },
    { pos: [-2.1 * spread, -1.1, -1.2], s: 0.65 },
    { pos: [2.2 * spread, -1.0, -1.0], s: 0.7 },
    { pos: [-1.2 * spread, 2.2, -1.0], s: 0.6 },
    { pos: [1.3 * spread, 2.3, -1.3], s: 0.55 },
    { pos: [-3.2 * spread, 0.1, -1.8], s: 0.55 },
    { pos: [3.3 * spread, 0.0, -1.6], s: 0.6 },
  ];

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = scroll.range(SECTION / TOTAL, 1 / TOTAL);
    groupRef.current.position.y = yOffset - progress * 2.2;
    const s = 1 - progress * 0.2;
    groupRef.current.scale.setScalar(Math.max(s, 0.4));
  });

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {/* ── Balloon hearts floating around her portrait ── */}
      {balloons.map((b, i) => (
        <BalloonHeart
          key={i}
          position={b.pos}
          color={heartColors[i % heartColors.length]}
          scale={b.s * (isMobile ? 0.75 : 1)}
          speed={0.9 + (i % 3) * 0.4}
        />
      ))}

      {/* ── Golden & Rose Sparkles ── */}
      <Sparkles
        count={isMobile ? 40 : 80}
        scale={[viewport.width * 0.95, viewport.height * 0.95, 4]}
        size={isMobile ? 2.5 : 4}
        speed={0.4}
        color="#FFD700"
      />
      <Sparkles
        count={isMobile ? 25 : 50}
        scale={[viewport.width * 0.8, viewport.height * 0.8, 3]}
        size={2}
        speed={0.6}
        color="#FF69B4"
      />

      {/* ── Floating mini hearts ── */}
      <FloatingHearts
        count={isMobile ? 20 : 35}
        area={[viewport.width * 0.9, viewport.height * 0.9, 3]}
      />

      {/* ── Warm spotlight ── */}
      <pointLight position={[0, 2, 3]} intensity={1.2} color="#FFE4E1" distance={15} />
      <pointLight position={[-3, -1, 2]} intensity={0.7} color="#FF69B4" distance={10} />
      <pointLight position={[3, -1, 2]} intensity={0.7} color="#FFD700" distance={10} />
    </group>
  );
}

/* ═══════════════════════  HTML OVERLAY  ═══════════════════════ */

export function HeroOverlay() {
  const basePath = process.env.NODE_ENV === 'production' ? '/LOVE-FOR-BARSANA' : '';

  return (
    <div
      className="section-overlay justify-center items-center text-center px-4"
      style={{ top: `${SECTION * 100}vh` }}
    >
      <div className="flex flex-col items-center justify-center -mt-4 max-w-lg w-full">
        {/* Rasgulla Badge */}
        <div className="rasgulla-badge px-5 py-1.5 mb-4 flex items-center gap-2">
          <span className="text-xl">🍯</span>
          <span className="text-amber-200 text-xs sm:text-sm font-semibold tracking-wider uppercase">
            She&apos;s My Beloved Rasgulla
          </span>
          <span className="text-xl">✨</span>
        </div>

        {/* Her Photo Framed in Glowing Mala / Garland */}
        <div className="relative mb-4 group">
          <div className="mala-ring w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48">
            <div className="mala-beads" />
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-amber-300/80 shadow-2xl bg-love-deep">
              <Image
                src={`${basePath}/images/barsana.jpg`}
                alt="Barsana Mukhopadhyay"
                fill
                priority
                className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 176px, 192px"
              />
            </div>
          </div>

          {/* Floating mini heart badges around portrait */}
          <div className="absolute -top-1 -right-1 bg-pink-500/90 text-white text-xs px-2 py-0.5 rounded-full shadow-lg border border-white/30 animate-bounce">
            💕 Mine
          </div>
          <div className="absolute -bottom-2 -left-2 bg-amber-500/90 text-white text-xs px-2 py-0.5 rounded-full shadow-lg border border-white/30">
            🌸 Sweetest
          </div>
        </div>

        {/* Name */}
        <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl gradient-text glow-text tracking-wider leading-tight">
          BARSANA
        </h1>
        <h2 className="font-display font-semibold text-xl sm:text-3xl md:text-4xl text-pink-300 glow-text tracking-[0.18em] mt-0.5">
          MUKHOPADHYAY
        </h2>

        {/* Sweet Bengali sweet tribute */}
        <p className="text-pink-200/95 text-xs sm:text-sm md:text-base text-center max-w-sm sm:max-w-md leading-relaxed font-light tracking-wide mt-3 px-2">
          💖 Soft, sweet, and pure joy — just like a <span className="text-amber-300 font-medium">Rasgulla</span>, you make my whole world sweeter every single day.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 flex flex-col items-center gap-1.5 animate-float">
        <p className="text-white/50 text-[11px] tracking-[0.25em] uppercase">Scroll down with love</p>
        <span className="text-lg">💕</span>
        <div className="w-px h-6 bg-gradient-to-b from-pink-400 to-transparent" />
      </div>
    </div>
  );
}
