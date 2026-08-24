'use client';

import Image from 'next/image';

export default function HeroSection() {
  const basePath = process.env.NODE_ENV === 'production' ? '/LOVE-FOR-BARSANA' : '';

  return (
    <section id="hero" className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 py-16 relative">
      <div className="flex flex-col items-center justify-center max-w-lg w-full z-10">
        {/* Rasgulla Badge */}
        <div className="rasgulla-badge px-5 py-2 mb-5 flex items-center gap-2 shadow-lg">
          <span className="text-xl">🍯</span>
          <span className="text-amber-200 text-xs sm:text-sm font-bold tracking-wider uppercase">
            She&apos;s My Beloved Rasgulla
          </span>
          <span className="text-xl">✨</span>
        </div>

        {/* Her Photo Framed in Glowing Mala / Garland */}
        <div className="relative mb-5 group">
          <div className="mala-ring w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52">
            <div className="mala-beads" />
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-amber-300/80 shadow-2xl bg-love-deep">
              <Image
                src={`${basePath}/images/barsana.jpg`}
                alt="Barsana Mukhopadhyay"
                fill
                priority
                className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 192px, 208px"
              />
            </div>
          </div>

          {/* Floating mini heart badges around portrait */}
          <div className="absolute -top-1 -right-1 bg-pink-500/95 text-white text-xs px-2.5 py-0.5 rounded-full shadow-lg border border-white/30 animate-bounce">
            💕 Mine
          </div>
          <div className="absolute -bottom-2 -left-2 bg-amber-500/95 text-white text-xs px-2.5 py-0.5 rounded-full shadow-lg border border-white/30">
            🌸 Sweetest
          </div>
        </div>

        {/* Name */}
        <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl gradient-text glow-text tracking-wider leading-tight">
          BARSANA
        </h1>
        <h2 className="font-display font-semibold text-2xl sm:text-4xl md:text-5xl text-pink-300 glow-text tracking-[0.18em] mt-1">
          MUKHOPADHYAY
        </h2>

        {/* Sweet Bengali sweet tribute */}
        <p className="text-pink-200/95 text-sm sm:text-base md:text-lg text-center max-w-sm sm:max-w-md leading-relaxed font-light tracking-wide mt-4 px-2">
          💖 Soft, sweet, and pure joy — just like a <span className="text-amber-300 font-semibold">Rasgulla</span>, you make my whole world sweeter every single day.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 flex flex-col items-center gap-1.5 animate-float z-10">
        <p className="text-white/60 text-xs tracking-[0.25em] uppercase">Scroll down with love</p>
        <span className="text-xl">👇💕</span>
      </div>
    </section>
  );
}
