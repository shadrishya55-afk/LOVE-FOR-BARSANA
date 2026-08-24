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
      {/* Lots of floating hearts */}
      <FloatingHearts
        count={isMobile ? 25 : 50}
        area={[viewport.width, viewport.height, 5]}
        colors={['#FF6B9D', '#FF1493', '#C084FC', '#FFD700', '#FF69B4']}
        speed={0.8}
      />

      {/* Multi-layer sparkles */}
      <Sparkles
        count={isMobile ? 25 : 50}
        scale={[viewport.width * 0.9, viewport.height * 0.9, 5]}
        size={2.5}
        speed={0.3}
        color="#C084FC"
      />
      <Sparkles
        count={isMobile ? 15 : 30}
        scale={[viewport.width * 0.5, viewport.height * 0.5, 3]}
        size={1.5}
        speed={0.6}
        color="#FFD700"
      />

      {/* Lights */}
      <pointLight position={[3, 3, 3]} intensity={0.8} color="#C084FC" distance={10} />
      <pointLight position={[-3, -2, 2]} intensity={0.6} color="#FF1493" distance={8} />
    </group>
  );
}

/* ═══════════════════════  HTML OVERLAY  ═══════════════════════ */

const reasons = [
  '💛 Your smile lights up my entire day',
  '💜 You make everything so much better',
  '❤️ Your laugh is my favourite sound',
  '💗 You are the strongest person I know',
  '🧡 Every day with you is a new adventure',
  '💖 You believe in me when I don\'t',
  '💕 You are my home, my peace, my everything',
];

export function ReasonsOverlay() {
  return (
    <div
      className="section-overlay justify-center gap-6"
      style={{ top: `${SECTION * 100}vh` }}
    >
      {/* Title */}
      <h2 className="font-cursive text-2xl md:text-4xl gradient-text mb-2 text-center">
        Reasons I Love You
      </h2>

      {/* Reasons list */}
      <div className="flex flex-col gap-3 max-w-sm md:max-w-md px-4">
        {reasons.map((r, i) => (
          <div
            key={i}
            className="glass-card px-4 py-3 fade-in-up"
            style={{ animationDelay: `${0.1 + i * 0.2}s` }}
          >
            <p className="text-white/90 text-sm md:text-base font-light text-center leading-relaxed">
              {r}
            </p>
          </div>
        ))}
      </div>

      {/* Closing */}
      <p className="text-white/40 text-xs tracking-widest mt-2">
        ...and a million more 💗
      </p>
    </div>
  );
}
