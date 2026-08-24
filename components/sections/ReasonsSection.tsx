'use client';

const reasons = [
  {
    emoji: '🍯',
    title: 'My Sweetest Rasgulla',
    text: 'You embody genuine sweetness and innocence — soft, deeply caring, and filling every single day with immense joy and peace.',
  },
  {
    emoji: '✨',
    title: 'Your Radiant Smile',
    text: 'A single glimpse of your smile instantly dissolves every trace of stress, fatigue, and doubt, lighting up my soul in an instant.',
  },
  {
    emoji: '💖',
    title: 'Your Caring Heart',
    text: 'The profound empathy and gentle care with which you treat me makes me realize how truly blessed and lucky I am every second.',
  },
  {
    emoji: '🌸',
    title: 'Your Laughter',
    text: 'Your laugh is like celestial music — infectious, beautiful, and the exact melody I want playing in my life forever.',
  },
  {
    emoji: '🌙',
    title: 'My Greatest Anchor',
    text: 'You understand the deepest corners of my mind, stand by my side, and believe in my dreams even when the world feels uncertain.',
  },
  {
    emoji: '💫',
    title: 'Treasured Moments',
    text: 'Whether we are sharing adventurous road trips or quiet peaceful glances, every second with you becomes a cherished memory.',
  },
  {
    emoji: '👑',
    title: 'My Forever & Always',
    text: 'You are not just my beloved girlfriend; you are my best friend, my safe haven, my soulmate, and my ultimate home.',
  },
];

export default function ReasonsSection() {
  return (
    <section
      id="reasons"
      className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 py-20 relative z-10"
    >
      {/* Title */}
      <div className="text-center mb-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs sm:text-sm tracking-widest uppercase mb-3 shadow-md">
          <span>💖</span>
          <span>Endless Devotion</span>
          <span>💖</span>
        </div>
        <h2 className="font-luxury font-bold text-4xl sm:text-6xl md:text-7xl gradient-text glow-text">
          Why You Mean The World To Me
        </h2>
        <p className="text-pink-200/85 text-sm sm:text-base mt-2 font-normal">
          Just seven of the countless reasons why I love you unconditionally, my sweet Rasgulla 🍯💕
        </p>
      </div>

      {/* Reasons list with Justified Descriptions */}
      <div className="flex flex-col gap-3.5 max-w-3xl px-3 w-full">
        {reasons.map((r, i) => (
          <div
            key={i}
            className="glass-card px-5 py-4 sm:py-4.5 flex items-start gap-4 text-left transition-all duration-300 shadow-xl border border-pink-300/20"
          >
            <span className="text-2xl sm:text-3xl flex-shrink-0 mt-0.5">{r.emoji}</span>
            <div className="flex flex-col w-full">
              <h3 className="font-luxury font-bold text-base sm:text-lg text-amber-300 mb-0.5">
                {r.title}
              </h3>
              <p className="text-white/90 text-xs sm:text-sm font-normal leading-relaxed text-justify">
                {r.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-amber-200/90 text-xs sm:text-sm tracking-widest mt-8 font-semibold">
        ...and with every passing sunrise, my love for you grows exponentially 💗
      </p>
    </section>
  );
}
