'use client';

export default function FinaleSection() {
  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 py-20 relative z-10">
      <div className="text-center px-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs sm:text-sm tracking-widest uppercase mb-5">
          <span>👑</span>
          <span>To My Beloved Rasgulla</span>
          <span>👑</span>
        </div>

        <h1 className="font-cursive text-4xl sm:text-6xl md:text-7xl lg:text-8xl glow-text text-pink-200 mb-3">
          I Love You
        </h1>

        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl gradient-gold glow-gold tracking-wider font-bold">
          Barsana Mukhopadhyay
        </h2>

        <div className="mt-8 sm:mt-10 glass-card p-6 sm:p-8 max-w-lg mx-auto">
          <p className="text-white/95 text-sm sm:text-base md:text-lg font-light leading-relaxed font-display italic">
            &ldquo;In all the world, there is no heart for me like yours.
            In all the world, there is no love for you like mine.&rdquo;
          </p>
        </div>

        <div className="mt-8 sm:mt-10 flex items-center justify-center gap-3 text-2xl sm:text-3xl">
          <span className="animate-pulse-heart">💕</span>
          <span className="text-pink-200 text-sm sm:text-lg font-bold tracking-widest uppercase">
            Forever &amp; Always Yours
          </span>
          <span className="animate-pulse-heart">💕</span>
        </div>
      </div>

      <p className="mt-12 text-white/40 text-xs tracking-widest">
        Made with all my love for Barsana 🍯✨
      </p>
    </section>
  );
}
