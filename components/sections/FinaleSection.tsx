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
      {/* Waving 3D cat */}
      <CuteCat
        position={[isMobile ? 0 : 2.5, isMobile ? -1.8 : -1.2, 0]}
        color="#FFA07A"
        scale={isMobile ? 0.95 : 1.2}
        variant="waving"
      />

      {/* Sparkles celebration */}
      <Sparkles
        count={isMobile ? 40 : 80}
        scale={[viewport.width, viewport.height, 6]}
        size={isMobile ? 3 : 5}
        speed={0.5}
        color="#FFD700"
      />
      <Sparkles
        count={isMobile ? 30 : 60}
        scale={[viewport.width * 0.8, viewport.height * 0.8, 4]}
        size={3}
        speed={0.8}
        color="#FF69B4"
      />
      <Sparkles
        count={isMobile ? 20 : 40}
        scale={[viewport.width * 0.6, viewport.height * 0.6, 3]}
        size={2}
        speed={1.2}
        color="#C084FC"
      />

      {/* Floating hearts celebration */}
      <FloatingHearts
        count={isMobile ? 30 : 60}
        area={[viewport.width, viewport.height * 1.2, 5]}
        colors={['#FF6B9D', '#FF1493', '#FFD700', '#C084FC', '#FF69B4', '#E91E63']}
        speed={1.2}
      />

      {/* Celebration lights */}
      <pointLight position={[0, 3, 3]} intensity={1.5} color="#FFD700" distance={12} />
      <pointLight position={[-3, -1, 2]} intensity={0.8} color="#FF1493" distance={10} />
      <pointLight position={[3, 1, 1]} intensity={0.6} color="#C084FC" distance={8} />
    </group>
  );
}

/* ═══════════════════════  HTML OVERLAY  ═══════════════════════ */

export function FinaleOverlay() {
  return (
    <div
      className="section-overlay justify-center gap-6"
      style={{ top: `${SECTION * 100}vh` }}
    >
      <div className="text-center px-4">
        <p className="text-white/60 text-sm md:text-base tracking-[0.3em] uppercase mb-4 fade-in-up">
          with all my heart
        </p>

        <h1
          className="font-cursive text-4xl md:text-6xl lg:text-7xl glow-text text-pink-200 mb-3 fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          I Love You
        </h1>

        <h2
          className="font-display text-xl md:text-3xl text-love-gold glow-gold tracking-wider fade-in-up font-semibold"
          style={{ animationDelay: '0.8s' }}
        >
          Barsana Mukhopadhyay
        </h2>

        <div
          className="mt-8 fade-in-up"
          style={{ animationDelay: '1.2s' }}
        >
          <p className="text-white/80 text-base md:text-lg font-light leading-relaxed max-w-md mx-auto font-display italic">
            &ldquo;In all the world, there is no heart for me like yours.
            In all the world, there is no love for you like mine.&rdquo;
          </p>
        </div>

        <div
          className="mt-10 flex items-center justify-center gap-3 text-2xl md:text-3xl fade-in-up"
          style={{ animationDelay: '1.6s' }}
        >
          <span className="animate-pulse-heart">💕</span>
          <span className="text-white/80 text-base md:text-lg font-light tracking-widest">
            Forever &amp; Always
          </span>
          <span className="animate-pulse-heart">💕</span>
        </div>
      </div>

      <p className="absolute bottom-6 text-white/20 text-xs tracking-widest">
        made with all my love 💕
      </p>
    </div>
  );
}
