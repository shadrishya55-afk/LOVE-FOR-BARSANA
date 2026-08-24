'use client';

import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2500);
    const hideTimer = setTimeout(() => setVisible(false), 3300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-[100]"
      style={{
        background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #0a0015 70%)',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.8s ease-out',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      {/* Pulsing heart */}
      <div className="text-7xl md:text-8xl animate-pulse-heart select-none">💕</div>

      {/* Loading text */}
      <p className="text-pink-300 text-lg md:text-xl mt-8 tracking-[0.2em] font-light">
        Loading your surprise
      </p>

      {/* Bouncing dots */}
      <div className="flex gap-2 mt-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-pink-400"
            style={{
              animation: 'bounce 1.4s infinite ease-in-out both',
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle bottom text */}
      <p className="absolute bottom-8 text-white/20 text-xs tracking-widest">
        made with ❤️
      </p>
    </div>
  );
}
