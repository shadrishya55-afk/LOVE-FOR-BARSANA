'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import FloatingHearts from '../three/FloatingHearts';
import CuteCat from '../three/CuteCat';

/* ═══════════════════════  3D CONTENT  ═══════════════════════ */

const SECTION = 4;
const TOTAL = 5;

export function FinaleSection3D() {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const isMobile = viewport.width < 6;
  const yOffset = -SECTION * viewport.height;

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = scroll.range(SECTION / TOTAL, 1 / TOTAL);
    groupRef.current.position.y = yOffset;
    const s = Math.min(1, progress * 2.5);
    groupRef.current.scale.setScalar(Math.max(s, 0.01));
  });

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {/* Waving 3D Cat with warm colors */}
      <CuteCat
        position={[isMobile ? 0 : 2.6, isMobile ? -1.9 : -1.2, 0]}
        color="#FFA07A"
        scale={isMobile ? 0.95 : 1.25}
        variant="waving"
      />

      {/* Sparkles celebration */}
      <Sparkles
        count={isMobile ? 45 : 90}
        scale={[viewport.width, viewport.height, 6]}
        size={isMobile ? 3 : 5}
        speed={0.5}
        color="#FFD700"
      />
      <Sparkles
        count={isMobile ? 35 : 70}
        scale={[viewport.width * 0.85, viewport.height * 0.85, 4]}
        size={3}
        speed={0.8}
        color="#FF69B4"
      />
      <Sparkles
        count={isMobile ? 25 : 45}
        scale={[viewport.width * 0.6, viewport.height * 0.6, 3]}
        size={2}
        speed={1.2}
        color="#C084FC"
      />

      {/* Floating hearts celebration */}
      <FloatingHearts
        count={isMobile ? 35 : 65}
        area={[viewport.width, viewport.height * 1.2, 5]}
        colors={['#FF6B9D', '#FF1493', '#FFD700', '#C084FC', '#FF69B4', '#FFA07A']}
        speed={1.2}
      />

      {/* Celebration lights */}
      <pointLight position={[0, 3, 3]} intensity={1.6} color="#FFD700" distance={12} />
      <pointLight position={[-3, -1, 2]} intensity={0.9} color="#FF1493" distance={10} />
      <pointLight position={[3, 1, 1]} intensity={0.8} color="#C084FC" distance={8} />
    </group>
  );
}

/* ═══════════════════════  HTML OVERLAY  ═══════════════════════ */

export function FinaleOverlay() {
  return (
    <div
      className="section-overlay justify-center gap-4 sm:gap-6"
      style={{ top: `${SECTION * 100}vh` }}
    >
      <div className="text-center px-4 max-w-xl">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs tracking-widest uppercase mb-3 fade-in-up">
          <span>👑</span>
          <span>To My Beloved Rasgulla</span>
          <span>👑</span>
        </div>

        <h1
          className="font-cursive text-4xl sm:text-6xl md:text-7xl lg:text-8xl glow-text text-pink-200 mb-2 fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          I Love You
        </h1>

        <h2
          className="font-display text-2xl sm:text-4xl md:text-5xl gradient-gold glow-gold tracking-wider fade-in-up font-bold"
          style={{ animationDelay: '0.8s' }}
        >
          Barsana Mukhopadhyay
        </h2>

        <div
          className="mt-6 sm:mt-8 fade-in-up"
          style={{ animationDelay: '1.2s' }}
        >
          <p className="text-white/85 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-md mx-auto font-display italic">
            &ldquo;In all the world, there is no heart for me like yours.
            In all the world, there is no love for you like mine.&rdquo;
          </p>
        </div>

        <div
          className="mt-8 sm:mt-10 flex items-center justify-center gap-3 text-2xl sm:text-3xl fade-in-up"
          style={{ animationDelay: '1.6s' }}
        >
          <span className="animate-pulse-heart">💕</span>
          <span className="text-pink-200 text-sm sm:text-lg font-medium tracking-widest uppercase">
            Forever &amp; Always Yours
          </span>
          <span className="animate-pulse-heart">💕</span>
        </div>
      </div>

      <p className="absolute bottom-5 text-white/30 text-[11px] tracking-widest">
        Made with all my love for Barsana 🍯✨
      </p>
    </div>
  );
}
