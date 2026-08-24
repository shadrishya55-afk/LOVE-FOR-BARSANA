'use client';

import Image from 'next/image';
import { useState } from 'react';

const photos = [
  {
    src: '/images/barsana-garden.jpg',
    title: 'Garden Sunshine 🌿',
    subtitle: 'Looking ethereal and pure, lighting up everything around her.',
    catSticker: 'heart-eyes-cat.svg',
    catTag: 'Goddess vibe ✨',
  },
  {
    src: '/images/barsana-city.png',
    title: 'City Lights & Starlight ✨',
    subtitle: 'The prettiest girl in the world, outshining every neon light.',
    catSticker: 'crying-thumbs-up-cat.svg',
    catTag: 'Too gorgeous 😭',
  },
  {
    src: '/images/barsana-helmet.jpg',
    title: 'Cute Biker Girl 🏍️',
    subtitle: 'Relaxing on the grass — the sweetest, most adorable sight.',
    catSticker: 'banana-cat.svg',
    catTag: 'My whole heart 💕',
  },
  {
    src: '/images/barsana-bike.jpg',
    title: 'That Priceless Smile 🌸',
    subtitle: 'Her happy smile that makes my entire heart skip a thousand beats.',
    catSticker: 'happy-dance-cat.svg',
    catTag: 'Pure joy 💃',
  },
];

export default function GallerySection() {
  const basePath = process.env.NODE_ENV === 'production' ? '/LOVE-FOR-BARSANA' : '';
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <section
      id="gallery"
      className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 py-20 relative z-10"
    >
      {/* Title */}
      <div className="text-center mb-10 max-w-xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs tracking-wider uppercase mb-3">
          <span>📸</span>
          <span>Her Photo Album</span>
          <span>📸</span>
        </div>
        <h2 className="font-cursive text-3xl sm:text-5xl md:text-6xl gradient-text glow-text">
          Moments of My Rasgulla
        </h2>
        <p className="text-pink-200/80 text-sm sm:text-base mt-2">
          Every picture of you is my favorite masterpiece in the world 🍯💖
        </p>
      </div>

      {/* Grid of Polaroid Glass Photo Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl px-3 w-full">
        {photos.map((p, i) => (
          <div
            key={i}
            onClick={() => setSelectedPhoto(`${basePath}${p.src}`)}
            className="glass-card p-3.5 flex flex-col items-center text-left cursor-pointer group hover:-translate-y-2 transition-all duration-300 relative"
          >
            {/* Peeking Mini Cat Sticker on Top Corner */}
            <div className="absolute -top-4 -right-3 w-12 h-12 z-20 transform group-hover:scale-125 transition-transform drop-shadow-lg">
              <Image
                src={`${basePath}/images/${p.catSticker}`}
                alt="Cat Reaction"
                fill
                className="object-contain"
              />
            </div>

            {/* Photo Container */}
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-white/20 shadow-md bg-love-deep/50 mb-3">
              <Image
                src={`${basePath}${p.src}`}
                alt={p.title}
                fill
                className="object-cover object-center transform group-hover:scale-108 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-xs text-white/90 font-medium tracking-wide">
                  🔍 Tap to view full size
                </span>
              </div>
            </div>

            {/* Photo Info */}
            <div className="w-full px-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-display font-semibold text-base sm:text-lg text-pink-200 truncate">
                  {p.title}
                </h3>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/30 flex-shrink-0">
                  {p.catTag}
                </span>
              </div>
              <p className="text-white/80 text-xs font-light leading-relaxed">
                {p.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-2xl max-h-[88vh] w-full h-full flex items-center justify-center">
            <Image
              src={selectedPhoto}
              alt="Barsana Full Size"
              fill
              className="object-contain rounded-2xl shadow-2xl"
              priority
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2.5 backdrop-blur-md transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
