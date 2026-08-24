'use client';

import Image from 'next/image';

export default function HeroSection() {
  const basePath = process.env.NODE_ENV === 'production' ? '/LOVE-FOR-BARSANA' : '';

  return (
    <section
      id="hero"
      className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 py-16 relative"
    >
      <div className="flex flex-col items-center justify-center max-w-xl w-full z-10">
        {/* Rasgulla Honey Badge */}
        <div className="rasgulla-badge px-6 py-2 mb-6 flex items-center gap-2.5 shadow-xl">
          <span className="text-xl">🍯</span>
          <span className="text-amber-200 text-xs sm:text-sm font-bold tracking-widest uppercase">
            She&apos;s My Beloved Rasgulla
          </span>
          <span className="text-xl">✨</span>
        </div>

        {/* Her Photo Framed in Glowing Mala / Garland */}
        <div className="relative mb-6 group">
          <div className="mala-ring w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56">
            <div className="mala-beads" />
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-amber-300/80 shadow-2xl bg-love-sapphire">
              <Image
                src={`${basePath}/images/barsana.jpg`}
                alt="Barsana Mukhopadhyay"
                fill
                priority
                className="object-cover object-center transform group-hover:scale-108 transition-transform duration-500"
                sizes="(max-width: 768px) 208px, 224px"
              />
            </div>
          </div>

          {/* Floating mini heart badges around portrait */}
          <div className="absolute -top-1 -right-2 bg-pink-500/95 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xl border border-white/30 animate-bounce">
            💕 Mine Forever
          </div>
          <div className="absolute -bottom-2 -left-2 bg-amber-500/95 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xl border border-white/30">
            🌸 My Sweetest
          </div>
        </div>

        {/* Name in Luxury Serif & Calligraphy */}
        <h1 className="font-luxury font-bold text-5xl sm:text-7xl md:text-8xl gradient-text glow-text tracking-wide leading-none mb-1">
          BARSANA
        </h1>
        <h2 className="font-luxury font-semibold text-2xl sm:text-4xl md:text-5xl text-pink-300 glow-text tracking-[0.2em] mt-1">
          MUKHOPADHYAY
        </h2>

        {/* Well-Formatted, Justified Romantic Tribute */}
        <div className="glass-card p-5 sm:p-6 mt-6 max-w-lg w-full text-justify text-white/90 shadow-2xl border border-white/20">
          <p className="text-xs sm:text-sm md:text-base font-normal leading-relaxed text-justify">
            Soft, sweet, and overflowing with pure warmth — just like a authentic <span className="text-amber-300 font-semibold">Rasgulla</span>, you melt away every sorrow and make my entire existence sweet. You are the poetry in my ordinary days, the calm in every storm, and the love I will treasure for all my lifetimes.
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 flex flex-col items-center gap-1.5 animate-float z-10">
        <p className="text-blue-200/70 text-xs tracking-[0.25em] uppercase font-medium">Scroll down to explore our universe</p>
        <span className="text-xl">👇💕</span>
      </div>
    </section>
  );
}
