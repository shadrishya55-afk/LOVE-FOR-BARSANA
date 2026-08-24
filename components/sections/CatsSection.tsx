'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import Image from 'next/image';
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

  const spread = isMobile ? 0.65 : 1.15;

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = scroll.range(SECTION / TOTAL, 1 / TOTAL);
    groupRef.current.position.y = yOffset;
    const s = Math.min(1, progress * 3);
    groupRef.current.scale.setScalar(Math.max(s, 0.01));
  });

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {/* 3D Cute Cats with different colors/variants */}
      <CuteCat
        position={[-2.6 * spread, -0.6, 0.2]}
        color="#FFA07A"
        scale={isMobile ? 0.9 : 1.25}
        variant="sitting"
      />
      <CuteCat
        position={[0, 0.4, 0.5]}
        color="#F48FB1"
        scale={isMobile ? 1.05 : 1.45}
        variant="waving"
      />
      <CuteCat
        position={[2.6 * spread, -0.8, -0.3]}
        color="#FFE082"
        scale={isMobile ? 0.85 : 1.15}
        variant="sleeping"
      />

      {/* Sparkles */}
      <Sparkles
        count={isMobile ? 25 : 55}
        scale={[viewport.width * 0.85, viewport.height * 0.75, 4]}
        size={isMobile ? 2.5 : 3.5}
        speed={0.8}
        color="#FFD700"
      />
      <Sparkles
        count={isMobile ? 15 : 30}
        scale={[viewport.width * 0.6, viewport.height * 0.5, 3]}
        size={2}
        speed={1.1}
        color="#FF69B4"
      />

      {/* Lighting */}
      <pointLight position={[0, 3, 3]} intensity={1.2} color="#FFDAB9" distance={10} />
      <pointLight position={[-3, -1, 2]} intensity={0.6} color="#F48FB1" distance={8} />
      <pointLight position={[3, -1, 2]} intensity={0.6} color="#FFE082" distance={8} />
    </group>
  );
}

/* ═══════════════════════  HTML OVERLAY  ═══════════════════════ */

const memeCats = [
  {
    image: 'banana-cat.svg',
    tag: '🍌 Banana Cat Meme',
    caption: 'When you haven\'t texted me in 0.0001 seconds (Emotional damage 😿)',
  },
  {
    image: 'polite-cat.svg',
    tag: '🤵 Polite Ollie Cat',
    caption: 'Me politely waiting for my Rasgulla to wake up and tell me about her day :]',
  },
  {
    image: 'heart-eyes-cat.svg',
    tag: '😻 Heart Eyes Meme',
    caption: 'My honest live reaction every time I look at your photos 💖',
  },
  {
    image: 'crying-thumbs-up-cat.svg',
    tag: '👍 Crying Thumbs Up',
    caption: 'Me holding back happy tears because you exist and you\'re mine 😭💕',
  },
  {
    image: 'pop-cat.svg',
    tag: '😮 Pop Cat (POP POP)',
    caption: 'My heartbeat accelerating every time you send a voice note 💓',
  },
  {
    image: 'happy-dance-cat.svg',
    tag: '💃 Happy Happy Cat',
    caption: 'Me doing a victory dance whenever you say "I love you" 🕺✨',
  },
];

export function CatsOverlay() {
  const basePath = process.env.NODE_ENV === 'production' ? '/LOVE-FOR-BARSANA' : '';

  return (
    <div
      className="section-overlay justify-center py-8 sm:py-12"
      style={{ top: `${SECTION * 100}vh` }}
    >
      {/* Title */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs tracking-wider uppercase mb-2">
          <span>🐾</span>
          <span>Instagram Cat Memes for You</span>
          <span>🐾</span>
        </div>
        <h2 className="font-cursive text-2xl sm:text-4xl md:text-5xl text-yellow-200 glow-gold">
          The Cats Are Obsessed With You Too!
        </h2>
        <p className="text-pink-200/70 text-xs sm:text-sm mt-1">
          Every meme cat accurately represents my love for you 🐱❤️
        </p>
      </div>

      {/* Grid of Instagram Cat Memes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 max-w-2xl px-3 w-full">
        {memeCats.map((m, i) => (
          <div
            key={i}
            className="meme-card p-2.5 sm:p-3.5 flex flex-col items-center text-center cursor-pointer group"
          >
            {/* Meme Avatar / SVG */}
            <div className="relative w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 mb-2 transform group-hover:scale-110 transition-transform duration-300">
              <Image
                src={`${basePath}/images/${m.image}`}
                alt={m.tag}
                fill
                className="object-contain drop-shadow-lg"
              />
            </div>

            {/* Meme Tag */}
            <span className="text-[10px] sm:text-xs font-semibold text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded-md mb-1.5 border border-amber-300/30">
              {m.tag}
            </span>

            {/* Caption */}
            <p className="text-white/90 text-[11px] sm:text-xs font-medium leading-snug">
              {m.caption}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom text */}
      <p className="text-white/40 text-[11px] sm:text-xs tracking-widest mt-4">
        🐾 Certified 100% Purr-fect Girlfriend 🐾
      </p>
    </div>
  );
}
