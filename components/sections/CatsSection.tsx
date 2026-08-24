'use client';

import Image from 'next/image';

const memeCats = [
  {
    image: 'banana-cat.svg',
    caption: 'When you haven\'t texted me in 0.0001 seconds (My heart gets dramatic 😿)',
  },
  {
    image: 'polite-cat.svg',
    caption: 'Me patiently and politely waiting for my Rasgulla to wake up and tell me everything :]',
  },
  {
    image: 'heart-eyes-cat.svg',
    caption: 'My honest live reaction every single time I look at your photos 💖',
  },
  {
    image: 'crying-thumbs-up-cat.svg',
    caption: 'Me holding back happy tears because you exist and you chose to love me 😭💕',
  },
  {
    image: 'pop-cat.svg',
    caption: 'My heartbeat accelerating every time your name pops up on my screen 💓',
  },
  {
    image: 'happy-dance-cat.svg',
    caption: 'Me doing a whole victory celebration every time you say "I love you" 💃✨',
  },
  {
    image: 'smug-cat.svg',
    caption: 'Me flexing to the universe that the prettiest girl in the world is mine 😉👑',
  },
  {
    image: 'cat-kiss.svg',
    caption: 'Sending 10,000 virtual kisses to my sweetest Rasgulla every single day 💋',
  },
  {
    image: 'chonk-cat.svg',
    caption: 'Full of love, soft cuddles, and endless warmth for you 🍯🧡',
  },
];

export default function CatsSection() {
  const basePath = process.env.NODE_ENV === 'production' ? '/LOVE-FOR-BARSANA' : '';

  return (
    <section
      id="cats"
      className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 py-20 relative z-10"
    >
      {/* Title */}
      <div className="text-center mb-8 max-w-xl">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs tracking-widest uppercase mb-3 shadow-md">
          <span>🐾</span>
          <span>50 Shades of Cats</span>
          <span>🐾</span>
        </div>
        <h2 className="font-luxury font-bold text-4xl sm:text-6xl md:text-7xl gradient-text glow-text">
          50 Shades of Cats
        </h2>
        <p className="text-pink-200/85 text-xs sm:text-sm md:text-base mt-2 font-normal">
          Every mood of our love accurately represented by the internet&apos;s cutest cats 🐱❤️
        </p>
      </div>

      {/* Grid of 9 Clean Aesthetic Cat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-5 max-w-5xl px-2 w-full">
        {memeCats.map((m, i) => (
          <div
            key={i}
            className="meme-card p-4 sm:p-5 flex flex-col items-center text-center cursor-pointer group shadow-xl"
          >
            {/* Cute Cat Illustration */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-3 transform group-hover:scale-115 transition-transform duration-300">
              <Image
                src={`${basePath}/images/${m.image}`}
                alt="Cute Cat"
                fill
                className="object-contain drop-shadow-md"
              />
            </div>

            {/* Caption */}
            <p className="text-white/95 text-xs sm:text-sm font-medium leading-relaxed text-center">
              {m.caption}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom text */}
      <div className="mt-8 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <p className="text-amber-200 text-xs sm:text-sm font-medium tracking-wide">
          🐾 100% Certified Cutest Rasgulla in the Universe 🐾
        </p>
      </div>
    </section>
  );
}
