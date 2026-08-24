'use client';

export default function FinaleSection() {
  return (
    <section
      id="finale"
      className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 py-24 relative z-10"
    >
      <div className="text-center px-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-amber-400/25 border border-amber-300/50 text-amber-200 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-6 shadow-xl">
          <span>👑</span>
          <span>To My Beloved Rasgulla</span>
          <span>👑</span>
        </div>

        <h1 className="font-cursive text-5xl sm:text-7xl md:text-8xl lg:text-9xl glow-text text-pink-200 mb-2 leading-tight">
          I Love You
        </h1>

        <h2 className="font-luxury font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl gradient-gold glow-gold tracking-wide mt-2">
          Barsana Mukhopadhyay
        </h2>

        <div className="mt-8 sm:mt-10 glass-card p-6 sm:p-9 max-w-xl mx-auto shadow-2xl border border-pink-300/30 text-justify text-white/95">
          <p className="text-sm sm:text-base md:text-lg font-light leading-relaxed font-luxury italic text-center mb-4">
            &ldquo;In all the world, there is no heart for me like yours.
            In all the world, there is no love for you like mine.&rdquo;
          </p>
          <p className="text-xs sm:text-sm font-normal leading-relaxed text-justify text-white/85 pt-3 border-t border-white/15">
            Thank you for being the most loving, wonderful, and extraordinary partner. Through every high and low, I promise to stand beside you, hold your hand, make you laugh, and love you more and more each day.
          </p>
        </div>

        <div className="mt-8 sm:mt-12 flex items-center justify-center gap-4 text-2xl sm:text-4xl">
          <span className="animate-pulse-heart">💕</span>
          <span className="text-pink-200 text-base sm:text-xl font-bold tracking-[0.2em] uppercase font-luxury">
            Forever &amp; Always Yours
          </span>
          <span className="animate-pulse-heart">💕</span>
        </div>
      </div>

      {/* Playful & Loving Website Credit Tag */}
      <div className="mt-16 flex flex-col items-center gap-2">
        <div className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500/30 to-purple-600/30 border border-pink-300/40 backdrop-blur-md shadow-2xl">
          <p className="text-xs sm:text-sm md:text-base font-bold text-amber-200 tracking-wider uppercase">
            🚀 WEBSITE MADE BY HER ANNOYING PARTNER 💕
          </p>
        </div>
        <p className="text-white/40 text-[11px] tracking-widest mt-1">
          (Who loves you more than anything in this galaxy 🪐🍯)
        </p>
      </div>
    </section>
  );
}
