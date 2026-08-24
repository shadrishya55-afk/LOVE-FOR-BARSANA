'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import FloatingHearts from '../three/FloatingHearts';

/* ═══════════════════════  3D CONTENT  ═══════════════════════ */

const SECTION = 3;
const TOTAL = 5;

export function ReasonsSection3D() {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const isMobile = viewport.width < 6;
  const yOffset = -SECTION * viewport.height;

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = scroll.range(SECTION / TOTAL, 1 / TOTAL);
    groupRef.current.position.y = yOffset;
    const s = Math.min(1, progress * 3);
    groupRef.current.scale.setScalar(Math.max(s, 0.01));
  });

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {/* Floating hearts */}
      <FloatingHearts
        count={isMobile ? 25 : 55}
        area={[viewport.width, viewport.height, 5]}
        colors={['#FF6B9D', '#FF1493', '#C084FC', '#FFD700', '#FF69B4', '#FFA07A']}
        speed={0.85}
      />

      {/* Multi-layer sparkles */}
      <Sparkles
        count={isMobile ? 30 : 60}
        scale={[viewport.width * 0.9, viewport.height * 0.9, 5]}
        size={2.5}
        speed={0.4}
        color="#C084FC"
      />
      <Sparkles
        count={isMobile ? 20 : 40}
        scale={[viewport.width * 0.6, viewport.height * 0.6, 3]}
        size={1.8}
        speed={0.7}
        color="#FFD700"
      />

      {/* Atmospheric lighting */}
      <pointLight position={[3, 3, 3]} intensity={0.9} color="#C084FC" distance={10} />
      <pointLight position={[-3, -2, 2]} intensity={0.7} color="#FF1493" distance={8} />
      <pointLight position={[0, -1, 3]} intensity={0.6} color="#FFB347" distance={8} />
    </group>
  );
}

/* ═══════════════════════  HTML OVERLAY  ═══════════════════════ */

const reasons = [
  { emoji: '🍯', text: 'You are my sweetest Rasgulla — soft, kind-hearted, and bringing endless warmth.' },
  { emoji: '✨', text: 'Your smile lights up even my darkest days in an instant.' },
  { emoji: '💖', text: 'The way you care and love makes me the luckiest person alive.' },
  { emoji: '🌸', text: 'Your laugh is my absolute favorite sound in the world.' },
  { emoji: '🌙', text: 'You understand me and believe in me even when I doubt myself.' },
  { emoji: '💫', text: 'Every moment spent with you becomes a treasured memory.' },
  { emoji: '👑', text: 'You are not just my girlfriend, you are my home and my forever.' },
];

export function ReasonsOverlay() {
  return (
    <div
      className="section-overlay justify-center gap-3 sm:gap-4 py-8"
      style={{ top: `${SECTION * 100}vh` }}
    >
      {/* Title */}
      <div className="text-center mb-1">
        <h2 className="font-cursive text-2xl sm:text-4xl md:text-5xl gradient-text glow-text text-center">
          Why You Mean The World To Me
        </h2>
        <p className="text-pink-200/70 text-xs sm:text-sm mt-1">
          Just a few of the infinite reasons I adore you 🍯💕
        </p>
      </div>

      {/* Reasons list */}
      <div className="flex flex-col gap-2 sm:gap-2.5 max-w-sm sm:max-w-lg md:max-w-xl px-3 w-full">
        {reasons.map((r, i) => (
          <div
            key={i}
            className="glass-card px-3.5 py-2.5 sm:py-3 flex items-center gap-3 fade-in-up"
            style={{ animationDelay: `${0.1 + i * 0.15}s` }}
          >
            <span className="text-lg sm:text-2xl flex-shrink-0">{r.emoji}</span>
            <p className="text-white/95 text-xs sm:text-sm md:text-base font-light leading-relaxed">
              {r.text}
            </p>
          </div>
        ))}
      </div>

      <p className="text-amber-200/70 text-xs tracking-widest mt-1">
        ...and I fall in love with you more every single day 💗
      </p>
    </div>
  );
}
