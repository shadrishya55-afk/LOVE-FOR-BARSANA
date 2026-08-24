'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import CuteCat from '../three/CuteCat';

/* ═══════════════════════  3D CONTENT  ═══════════════════════ */

const SECTION = 2;
const TOTAL = 5;

export function CatsSection3D() {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const isMobile = viewport.width < 6;
  const yOffset = -SECTION * viewport.height;

  const spread = isMobile ? 0.6 : 1;

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = scroll.range(SECTION / TOTAL, 1 / TOTAL);
    groupRef.current.position.y = yOffset;
    const s = Math.min(1, progress * 3);
    groupRef.current.scale.setScalar(Math.max(s, 0.01));
  });

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {/* Three cute cats */}
      <CuteCat
        position={[-2.5 * spread, -0.5, 0]}
        color="#FFA07A"
        scale={isMobile ? 0.9 : 1.2}
        variant="sitting"
      />
      <CuteCat
        position={[0, 0.3, 0.5]}
        color="#DDA0DD"
        scale={isMobile ? 1 : 1.4}
        variant="waving"
      />
      <CuteCat
        position={[2.5 * spread, -0.8, -0.5]}
        color="#87CEEB"
        scale={isMobile ? 0.85 : 1.1}
        variant="sleeping"
      />

      {/* Fun sparkles */}
      <Sparkles
        count={isMobile ? 20 : 45}
        scale={[viewport.width * 0.8, viewport.height * 0.7, 4]}
        size={isMobile ? 2 : 3}
        speed={0.8}
        color="#FFD700"
      />
      <Sparkles
        count={isMobile ? 10 : 25}
        scale={[viewport.width * 0.6, viewport.height * 0.5, 3]}
        size={2}
        speed={1.2}
        color="#FF69B4"
      />

      {/* Warm lighting */}
      <pointLight position={[0, 3, 3]} intensity={1} color="#FFDAB9" distance={10} />
      <pointLight position={[-3, -1, 2]} intensity={0.5} color="#DDA0DD" distance={8} />
    </group>
  );
}

/* ═══════════════════════  HTML OVERLAY  ═══════════════════════ */

const catPuns = [
  { emoji: '😻', text: "You're absolutely purr-fect!" },
  { emoji: '🐱', text: "I'm not kitten — you're amazing!" },
  { emoji: '😸', text: "You've got to be kitten me with that smile!" },
  { emoji: '💕', text: "I love you meow and furever!" },
];

export function CatsOverlay() {
  return (
    <div
      className="section-overlay justify-between py-14"
      style={{ top: `${SECTION * 100}vh` }}
    >
      {/* Title */}
      <div className="text-center">
        <h2 className="font-cursive text-2xl md:text-4xl text-yellow-200 glow-gold">
          Even the Cats Agree...
        </h2>
        <p className="text-white/50 text-xs md:text-sm mt-2 tracking-wider">
          🐾 you&apos;re the best human ever 🐾
        </p>
      </div>

      {/* Puns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-w-lg px-4">
        {catPuns.map((p, i) => (
          <div
            key={i}
            className="glass-card px-4 py-3 text-center fade-in-up"
            style={{ animationDelay: `${0.2 + i * 0.3}s` }}
          >
            <span className="text-2xl md:text-3xl block mb-1">{p.emoji}</span>
            <p className="text-white/85 text-sm md:text-base font-medium">{p.text}</p>
          </div>
        ))}
      </div>

      <div />
    </div>
  );
}
