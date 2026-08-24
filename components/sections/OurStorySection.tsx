'use client';

import Image from 'next/image';

const coupleMilestones = [
  { emoji: '♾️', title: 'Infinite Love', desc: 'Every single heartbeat beats in rhythm with yours' },
  { emoji: '🍯', title: 'Beloved Rasgulla', desc: 'The sweetest, most precious soul in the world' },
  { emoji: '🔒', title: 'Forever & Always', desc: 'Locked into each other’s destiny for eternity' },
];

export default function OurStorySection() {
  const basePath = process.env.NODE_ENV === 'production' ? '/LOVE-FOR-BARSANA' : '';

  return (
    <section
      id="our-story"
      className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 py-20 relative z-10"
    >
      {/* Title */}
      <div className="text-center mb-8 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/25 to-pink-500/25 border border-pink-400/40 text-pink-200 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 shadow-lg">
          <span>💑</span>
          <span>Our Designated Love Space</span>
          <span>💑</span>
        </div>
        <h2 className="font-luxury font-bold text-4xl sm:text-6xl md:text-7xl gradient-text glow-text">
          Us Together, Hand in Hand
        </h2>
        <p className="text-pink-100/90 text-sm sm:text-base mt-2">
          Two souls, one heartbeat, and an infinite universe of shared memories.
        </p>
      </div>

      {/* Main Couple Feature Card with Justified Romantic Narrative */}
      <div className="glass-card p-6 sm:p-9 max-w-2xl w-full flex flex-col items-center text-center relative group shadow-2xl border border-pink-300/30">
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
        <div className="relative w-full max-w-md aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden border-2 border-pink-400/70 shadow-2xl bg-love-sapphire mb-6">
          <Image
            src={`${basePath}/images/our-story.png`}
            alt="Barsana & Me"
            fill
            priority
            className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 500px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-left">
            <span className="text-amber-300 text-xs font-bold tracking-widest uppercase mb-1">
              ✨ You &amp; Me Forever ✨
            </span>
            <p className="text-white text-base sm:text-xl font-luxury font-bold leading-snug">
              Every day spent by your side is my greatest blessing.
            </p>
          </div>
        </div>

        {/* Rich Justified Romantic Story Paragraph */}
        <div className="w-full text-justify text-white/90 mb-6 bg-white/5 p-4 sm:p-5 rounded-xl border border-white/10">
          <p className="text-xs sm:text-sm md:text-base font-normal leading-relaxed text-justify">
            In a world inhabited by billions of people, my eyes will instinctively search only for you. From our late-night conversations to our spontaneous laughs and quiet moments, every second in your presence feels like coming home. You have brought a sweetness into my life that nothing else could ever replace.
          </p>
        </div>

        {/* Couple Stats & Milestones Grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full pt-4 border-t border-white/15">
          {coupleMilestones.map((m, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center text-center"
            >
              <span className="text-2xl sm:text-3xl mb-1.5">{m.emoji}</span>
              <h4 className="text-xs sm:text-sm font-bold text-amber-300 mb-0.5">
                {m.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-white/80 font-light leading-snug">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
