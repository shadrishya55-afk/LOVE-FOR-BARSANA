'use client';

import Image from 'next/image';

const coupleMilestones = [
  { emoji: '♾️', title: 'Infinite Love', desc: 'Every single heartbeat is yours' },
  { emoji: '🍯', title: 'Beloved Rasgulla', desc: 'The sweetest person in the universe' },
  { emoji: '🔒', title: 'Forever & Always', desc: 'Locked into my soul for eternity' },
];

export default function OurStorySection() {
  const basePath = process.env.NODE_ENV === 'production' ? '/LOVE-FOR-BARSANA' : '';

  return (
    <section
      id="our-story"
      className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 py-20 relative z-10"
    >
      {/* Title */}
      <div className="text-center mb-8 max-w-xl">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-pink-500/25 to-purple-600/25 border border-pink-400/40 text-pink-200 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 shadow-lg">
          <span>💑</span>
          <span>Our Designated Love Space</span>
          <span>💑</span>
        </div>
        <h2 className="font-cursive text-3xl sm:text-5xl md:text-6xl gradient-text glow-text">
          Us Together, Always
        </h2>
        <p className="text-pink-200/85 text-sm sm:text-base mt-2">
          My absolute favorite place in the entire world is standing right next to you.
        </p>
      </div>

      {/* Main Couple Feature Card */}
      <div className="glass-card p-5 sm:p-8 max-w-2xl w-full flex flex-col items-center text-center relative group shadow-2xl border border-pink-300/30">
        {/* Kissing Cats Meme Badge on Corner */}
        <div className="absolute -top-6 -right-4 sm:-right-6 w-16 h-16 sm:w-20 sm:h-20 z-20 transform group-hover:scale-125 transition-transform drop-shadow-xl">
          <Image
            src={`${basePath}/images/cat-kiss.svg`}
            alt="Kissing Cats"
            fill
            className="object-contain"
          />
        </div>

        {/* Couple Photo Container with Glowing Frame */}
        <div className="relative w-full max-w-md aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden border-2 border-pink-400/70 shadow-2xl bg-love-deep/60 mb-6">
          <Image
            src={`${basePath}/images/our-story.png`}
            alt="Barsana & Me"
            fill
            priority
            className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 500px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-5 text-left">
            <span className="text-amber-300 text-xs font-bold tracking-widest uppercase mb-1">
              ✨ You &amp; Me Forever ✨
            </span>
            <p className="text-white text-base sm:text-xl font-display font-semibold leading-snug">
              Every day with you is my favorite adventure.
            </p>
          </div>
        </div>

        {/* Romantic Promise */}
        <div className="px-2 max-w-lg mb-6">
          <p className="text-pink-100 text-sm sm:text-base font-light leading-relaxed font-display italic">
            &ldquo;In a sea of billions of people, my eyes will always search for you. In a world full of noise, your laughter is my peace and your smile is my sunshine.&rdquo;
          </p>
        </div>

        {/* Couple Stats & Milestones Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full pt-4 border-t border-white/15">
          {coupleMilestones.map((m, i) => (
            <div
              key={i}
              className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center text-center"
            >
              <span className="text-xl sm:text-2xl mb-1">{m.emoji}</span>
              <h4 className="text-xs sm:text-sm font-semibold text-amber-300 mb-0.5">
                {m.title}
              </h4>
              <p className="text-[10px] sm:text-xs text-white/70 font-light">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
