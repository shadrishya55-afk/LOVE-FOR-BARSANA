'use client';

import Image from 'next/image';
import { useState } from 'react';

const photos = [
  {
    src: '/images/barsana-garden.jpg',
    title: 'Garden Serenity 🌿',
    tag: 'Ethereal Grace',
    description:
      'Standing amidst the lush green blossoms, your natural grace completely outshone nature itself. The subtle sunlight highlighting your hair and the gentle elegance in your posture will forever be etched into my heart.',
    catSticker: 'heart-eyes-cat.svg',
  },
  {
    src: '/images/barsana-city.png',
    title: 'City Lights & Starlight ✨',
    tag: 'Pure Elegance',
    description:
      'Surrounded by the vibrant bustling neon lights of the city, you were the only sight my eyes could see. That floral dress and your captivating smile transformed a simple evening into an unforgettable memory.',
    catSticker: 'crying-thumbs-up-cat.svg',
  },
  {
    src: '/images/barsana-helmet.jpg',
    title: 'Carefree & Playful 🌸',
    tag: 'Sweetest Smile',
    description:
      'Resting on the soft grass with your helmet in lap, casually looking through your phone — this effortlessly adorable, candid moment captures the pure, genuine joy you bring into my world every day.',
    catSticker: 'banana-cat.svg',
  },
  {
    src: '/images/barsana-bike.jpg',
    title: 'Biker Girl Magic 🏍️',
    tag: 'My Heartbeat',
    description:
      'That radiant smile while sitting on the motorcycle is the exact reason I fall in love with you over and over again. Your infectious laugh and adventurous spirit make every journey feel magical.',
    catSticker: 'happy-dance-cat.svg',
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
      <div className="text-center mb-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs sm:text-sm tracking-widest uppercase mb-3 shadow-md">
          <span>📸</span>
          <span>Her Cherished Moments</span>
          <span>📸</span>
        </div>
        <h2 className="font-luxury font-bold text-4xl sm:text-6xl md:text-7xl gradient-text glow-text">
          Moments of My Rasgulla
        </h2>
        <p className="text-blue-100/90 text-sm sm:text-base mt-2 font-normal">
          Every photograph of you is my favorite masterpiece in the entire universe 🍯💖
        </p>
      </div>

      {/* Grid of Polaroid Glass Photo Cards with Justified Descriptions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl px-3 w-full">
        {photos.map((p, i) => (
          <div
            key={i}
            onClick={() => setSelectedPhoto(`${basePath}${p.src}`)}
            className="glass-card p-4 flex flex-col items-center text-left cursor-pointer group hover:-translate-y-2 transition-all duration-300 relative shadow-2xl"
          >
            {/* Peeking Mini Cat Sticker on Top Corner */}
            <div className="absolute -top-4 -right-3 w-12 h-12 z-20 transform group-hover:scale-125 transition-transform drop-shadow-xl">
              <Image
                src={`${basePath}/images/${p.catSticker}`}
                alt="Cat Reaction"
                fill
                className="object-contain"
              />
            </div>

            {/* Photo Container */}
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-white/20 shadow-md bg-love-sapphire mb-3.5">
              <Image
                src={`${basePath}${p.src}`}
                alt={p.title}
                fill
                className="object-cover object-center transform group-hover:scale-108 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-xs text-white/95 font-medium tracking-wide">
                  🔍 Tap to view full size
                </span>
              </div>
            </div>

            {/* Photo Info with Justified Text */}
            <div className="w-full px-1 flex flex-col flex-grow">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="font-luxury font-bold text-lg sm:text-xl text-pink-200 truncate">
                  {p.title}
                </h3>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/40 flex-shrink-0">
                  {p.tag}
                </span>
              </div>
              <p className="text-white/85 text-xs font-normal leading-relaxed text-justify">
                {p.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
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
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 backdrop-blur-md transition-colors text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
