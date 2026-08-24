'use client';

import Image from 'next/image';

const memeCats = [
  {
    image: 'banana-cat.svg',
    tag: '🍌 Banana Cat Meme',
    caption: 'When you haven\'t texted me in 0.0001 seconds (Emotional damage 😿)',
  },
  {
    image: 'polite-cat.svg',
    tag: '🤵 Polite Ollie Cat',
    caption: 'Me politely waiting for my Rasgulla to wake up and tell me about her day :]',
  },
  {
    image: 'heart-eyes-cat.svg',
    tag: '😻 Heart Eyes Meme',
    caption: 'My honest live reaction every time I look at your photos 💖',
  },
  {
    image: 'crying-thumbs-up-cat.svg',
    tag: '👍 Crying Thumbs Up',
    caption: 'Me holding back happy tears because you exist and you\'re mine 😭💕',
  },
  {
    image: 'pop-cat.svg',
    tag: '😮 Pop Cat (POP POP)',
    caption: 'My heartbeat accelerating every time you send a voice note 💓',
  },
  {
    image: 'happy-dance-cat.svg',
    tag: '💃 Happy Happy Cat',
    caption: 'Me doing a victory dance whenever you say "I love you" 🕺✨',
  },
];

export default function CatsSection() {
  const basePath = process.env.NODE_ENV === 'production' ? '/LOVE-FOR-BARSANA' : '';

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 py-20 relative z-10">
      {/* Title */}
      <div className="text-center mb-8 max-w-xl">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs tracking-wider uppercase mb-3">
          <span>🐾</span>
          <span>Instagram Cat Memes For You</span>
          <span>🐾</span>
        </div>
        <h2 className="font-cursive text-3xl sm:text-5xl md:text-6xl text-yellow-200 glow-gold">
          The Cats Are Obsessed With You!
        </h2>
        <p className="text-pink-200/80 text-sm sm:text-base mt-2">
          Every viral cat meme accurately describes how crazy I am about you 🐱❤️
        </p>
      </div>

      {/* Grid of Instagram Cat Memes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 max-w-4xl px-2 w-full">
        {memeCats.map((m, i) => (
          <div
            key={i}
            className="meme-card p-3.5 sm:p-5 flex flex-col items-center text-center cursor-pointer group shadow-xl"
          >
            {/* Meme Avatar / SVG */}
            <div className="relative w-16 h-16 sm:w-22 sm:h-22 md:w-24 md:h-24 mb-3 transform group-hover:scale-110 transition-transform duration-300">
              <Image
                src={`${basePath}/images/${m.image}`}
                alt={m.tag}
                fill
                className="object-contain drop-shadow-md"
              />
            </div>

            {/* Meme Tag */}
            <span className="text-[10px] sm:text-xs font-bold text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full mb-2 border border-amber-300/40">
              {m.tag}
            </span>

            {/* Caption */}
            <p className="text-white/95 text-xs sm:text-sm font-medium leading-snug">
              {m.caption}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom text */}
      <div className="mt-8 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
        <p className="text-amber-200 text-xs sm:text-sm font-medium tracking-wide">
          🐾 100% Certified Purr-fect Girlfriend &amp; Cutest Rasgulla 🐾
        </p>
      </div>
    </section>
  );
}
