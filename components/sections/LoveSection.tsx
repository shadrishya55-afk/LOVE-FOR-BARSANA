'use client';

const loveNotes = [
  {
    emoji: '💫',
    title: 'A Dream Come True',
    text: 'Every single waking moment spent thinking of you feels like a dream so enchanting that I never wish to wake. You have rewritten what love means to my soul.',
  },
  {
    emoji: '🌹',
    title: 'Endless Beauty',
    text: 'You make my world infinitely more magnificent simply by breathing within it. Your kindness, your gentle soul, and your pure heart radiate brighter than the morning sun.',
  },
  {
    emoji: '💓',
    title: 'The Beat of My Heart',
    text: 'My heart has chosen its permanent home in you. Yesterday, today, tomorrow, and across all conceivable futures, my pulse belongs entirely to you.',
  },
  {
    emoji: '🌙',
    title: 'My Guiding Light',
    text: 'When the night grows dark and the world feels overwhelming, thinking of your sweet smile instantly illuminates my path with calm serenity and unconditional warmth.',
  },
];

export default function LoveSection() {
  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 py-20 relative z-10">
      {/* Title */}
      <div className="mb-10 text-center max-w-2xl">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs sm:text-sm tracking-widest uppercase mb-3 shadow-md">
          <span>💌</span>
          <span>From My Heart to Yours</span>
          <span>💌</span>
        </div>
        <h2 className="font-luxury font-bold text-4xl sm:text-6xl md:text-7xl text-pink-200 glow-text">
          Letters of My Heart
        </h2>
        <p className="text-pink-200/85 text-sm sm:text-base mt-2 font-normal">
          A collection of eternal promises written with devotion for my sweetest Rasgulla
        </p>
      </div>

      {/* Love Quote Cards with Justified Texts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-7 max-w-4xl px-3 w-full">
        {loveNotes.map((q, i) => (
          <div
            key={i}
            className="glass-card p-6 sm:p-7 text-left flex flex-col justify-between transition-all duration-300 shadow-2xl border border-pink-300/25"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl sm:text-4xl">{q.emoji}</span>
                <h3 className="font-luxury font-bold text-xl sm:text-2xl text-amber-200">
                  {q.title}
                </h3>
              </div>
              <p className="text-white/90 text-xs sm:text-sm md:text-base font-normal leading-relaxed text-justify">
                &ldquo;{q.text}&rdquo;
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
