'use client';

const loveQuotes = [
  { emoji: '💫', text: 'Every single moment with you feels like a dream I never want to wake up from.' },
  { emoji: '🌹', text: 'You make my world infinitely more beautiful just by being in it.' },
  { emoji: '💓', text: 'My heart beats only for you — yesterday, today, and for every tomorrow.' },
  { emoji: '🌙', text: 'You are the brightest star in my sky and the warmth in my soul.' },
];

export default function LoveSection() {
  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 py-20 relative z-10">
      {/* Title */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs tracking-wider uppercase mb-3">
          <span>💌</span>
          <span>From My Heart to Yours</span>
          <span>💌</span>
        </div>
        <h2 className="font-cursive text-3xl sm:text-5xl md:text-6xl text-pink-200 glow-text">
          My Love For You
        </h2>
        <p className="text-pink-300/80 text-sm sm:text-base mt-2 max-w-md">
          A promise that grows deeper with every passing second
        </p>
      </div>

      {/* Love Quote Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl px-3 w-full">
        {loveQuotes.map((q, i) => (
          <div
            key={i}
            className="glass-card px-6 py-6 text-center flex flex-col items-center justify-center transition-all duration-300"
          >
            <span className="text-3xl sm:text-4xl block mb-2">{q.emoji}</span>
            <p className="text-white/95 text-sm sm:text-base md:text-lg font-light leading-relaxed font-display italic">
              &ldquo;{q.text}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
