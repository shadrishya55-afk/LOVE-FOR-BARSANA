'use client';

const reasons = [
  { emoji: '🍯', text: 'You are my sweetest Rasgulla — soft, kind-hearted, and bringing endless warmth into my life.' },
  { emoji: '✨', text: 'Your radiant smile lights up even my darkest days in a single second.' },
  { emoji: '💖', text: 'The way you care and love makes me the luckiest, happiest person alive.' },
  { emoji: '🌸', text: 'Your laugh is my absolute favorite sound in the entire world.' },
  { emoji: '🌙', text: 'You understand me, listen to me, and believe in me even when I doubt myself.' },
  { emoji: '💫', text: 'Every moment spent talking with you becomes my most treasured memory.' },
  { emoji: '👑', text: 'You are not just my girlfriend, you are my home, my peace, and my forever.' },
];

export default function ReasonsSection() {
  return (
    <section id="reasons" className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 py-20 relative z-10">
      {/* Title */}
      <div className="text-center mb-8 max-w-xl">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs tracking-wider uppercase mb-3">
          <span>💖</span>
          <span>Endless Reasons</span>
          <span>💖</span>
        </div>
        <h2 className="font-cursive text-3xl sm:text-5xl md:text-6xl gradient-text glow-text">
          Why You Mean The World To Me
        </h2>
        <p className="text-pink-200/80 text-sm sm:text-base mt-2">
          Just a few of the infinite reasons I adore you, my Rasgulla 🍯💕
        </p>
      </div>

      {/* Reasons list */}
      <div className="flex flex-col gap-3 max-w-2xl px-3 w-full">
        {reasons.map((r, i) => (
          <div
            key={i}
            className="glass-card px-4 py-3.5 sm:py-4 flex items-center gap-3.5 text-left transition-all duration-300"
          >
            <span className="text-2xl sm:text-3xl flex-shrink-0">{r.emoji}</span>
            <p className="text-white/95 text-xs sm:text-sm md:text-base font-light leading-relaxed">
              {r.text}
            </p>
          </div>
        ))}
      </div>

      <p className="text-amber-200/80 text-xs sm:text-sm tracking-widest mt-6 font-medium">
        ...and I fall in love with you more every single day 💗
      </p>
    </section>
  );
}
