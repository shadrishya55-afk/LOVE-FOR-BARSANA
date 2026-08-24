'use client';

import { useState } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  type: '432Hz' | 'Hollywood' | 'Bollywood';
  youtubeId: string;
}

const playlist: Track[] = [
  {
    id: 'jadore',
    title: "J'adore La Vie (432 Hz Affirmation)",
    artist: 'Inspired Feminine • 432 Hz Affirmation Song',
    type: '432Hz',
    youtubeId: 'BkSAZCRdmO8',
  },
  {
    id: 'her',
    title: 'her (feat. Annika Wells)',
    artist: 'JVKE ft. Annika Wells • Hollywood',
    type: 'Hollywood',
    youtubeId: 'KCi_sf9Y8c4',
  },
  {
    id: 'kesariya',
    title: 'Kesariya',
    artist: 'Arijit Singh, Pritam • Brahmāstra',
    type: 'Bollywood',
    youtubeId: 'BddP6PYo2gs',
  },
  {
    id: 'perfect',
    title: 'Perfect',
    artist: 'Ed Sheeran • Divide',
    type: 'Hollywood',
    youtubeId: '2Vv-BfVoq4g',
  },
  {
    id: 'tumhiho',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh • Aashiqui 2',
    type: 'Bollywood',
    youtubeId: 'IJq0yyWOh1E',
  },
  {
    id: 'untilifoundyou',
    title: 'Until I Found You',
    artist: 'Stephen Sanchez • Easy On My Eyes',
    type: 'Hollywood',
    youtubeId: 'GxldQ9eX2wo',
  },
  {
    id: 'raataan',
    title: 'Raataan Lambiyan',
    artist: 'Jubin Nautiyal, Asees Kaur • Shershaah',
    type: 'Bollywood',
    youtubeId: 'gvyUuxdRdR4',
  },
  {
    id: 'goldenhour',
    title: 'Golden Hour',
    artist: 'JVKE • this is what ____ feels like',
    type: 'Hollywood',
    youtubeId: 'PEM0Vs8jf1w',
  },
  {
    id: 'shayad',
    title: 'Shayad',
    artist: 'Arijit Singh, Pritam • Love Aaj Kal',
    type: 'Bollywood',
    youtubeId: 'bhh_ZqQvh_E',
  },
  {
    id: 'dandelions',
    title: 'Dandelions',
    artist: 'Ruth B. • Safe Haven',
    type: 'Hollywood',
    youtubeId: 'W8a4sUabCUo',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const currentTrack = playlist[currentTrackIndex];

  const nextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const prevTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setShowPlaylist(false);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed top-2.5 sm:top-4 left-1/2 -translate-x-1/2 z-50 max-w-[98vw] sm:max-w-lg w-full px-2">
      {/* ── Completely Hidden Background YouTube Audio Stream Engine ── */}
      {isPlaying && (
        <div className="absolute -top-[9999px] -left-[9999px] w-1 h-1 opacity-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <iframe
            key={currentTrack.youtubeId}
            src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1&enablejsapi=1&rel=0&playsinline=1`}
            width="1"
            height="1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            title={`Audio Stream ${currentTrack.title}`}
          />
        </div>
      )}

      {/* ── Pure Liquid Glass Header Bar ── */}
      <div className="liquid-glass-pill px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between shadow-2xl relative border border-pink-300/40 backdrop-blur-2xl">
        {/* Left Side: Manual Play Button & Prev/Next Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
          {/* Manual Play / Pause Button with Glow & Text */}
          <button
            onClick={togglePlay}
            className={`px-3 py-1.5 rounded-full border border-white/50 flex items-center gap-1.5 text-white font-bold text-xs sm:text-sm shadow-xl active:scale-95 transition-all cursor-pointer flex-shrink-0 ${
              isPlaying
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/40 animate-pulse'
                : 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-pink-500/40 hover:scale-105'
            }`}
            title={isPlaying ? 'Pause Music' : 'Manual Play Music'}
            aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
          >
            <span>{isPlaying ? '⏸' : '▶'}</span>
            <span className="text-[11px] sm:text-xs tracking-wider uppercase font-semibold">
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </span>
          </button>

          {/* Previous Song */}
          <button
            onClick={prevTrack}
            className="text-white/80 hover:text-white p-1 transition-colors text-xs sm:text-sm active:scale-90 cursor-pointer flex-shrink-0"
            title="Previous Song"
            aria-label="Previous Song"
          >
            ⏮
          </button>

          {/* Song Title & Artist (Fits Mobile Cleanly, No Ellipsis) */}
          <div
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="flex flex-col text-left cursor-pointer min-w-0 flex-1 group pr-1"
          >
            <div className="flex flex-wrap items-center gap-1 leading-tight">
              <span className="text-[11px] sm:text-xs md:text-sm font-bold text-white tracking-wide group-hover:text-pink-200 transition-colors break-words">
                {currentTrack.title}
              </span>
              <span
                className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded-full border flex-shrink-0 ${
                  currentTrack.type === 'Bollywood'
                    ? 'text-amber-300 bg-amber-400/20 border-amber-300/40'
                    : currentTrack.type === 'Hollywood'
                    ? 'text-blue-300 bg-blue-400/20 border-blue-300/40'
                    : 'text-pink-300 bg-pink-400/20 border-pink-300/40'
                }`}
              >
                {currentTrack.type}
              </span>
            </div>
            <div className="flex items-center gap-1.5 leading-tight mt-0.5">
              <span className="text-[9px] sm:text-[10px] text-pink-200/90 font-light break-words">
                {currentTrack.artist}
              </span>
              {isPlaying && (
                <span className="flex items-center gap-0.5 flex-shrink-0 ml-1">
                  <span className="w-1 h-2.5 bg-pink-400 rounded-full animate-pulse" />
                  <span className="w-1 h-3.5 bg-rose-400 rounded-full animate-pulse delay-75" />
                  <span className="w-1 h-2 bg-amber-400 rounded-full animate-pulse delay-150" />
                </span>
              )}
            </div>
          </div>

          {/* Next Song */}
          <button
            onClick={nextTrack}
            className="text-white/80 hover:text-white p-1 transition-colors text-xs sm:text-sm active:scale-90 cursor-pointer flex-shrink-0"
            title="Next Song"
            aria-label="Next Song"
          >
            ⏭
          </button>
        </div>

        {/* Right Side: Playlist Selector Button */}
        <div className="flex items-center gap-1.5 flex-shrink-0 pl-1.5">
          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="px-2.5 py-1.5 rounded-xl bg-pink-500/25 hover:bg-pink-500/40 border border-pink-300/40 text-[11px] sm:text-xs font-bold text-pink-200 flex items-center gap-1 transition-all cursor-pointer shadow-md"
            title="Open Playlist FOR HER"
          >
            <span>📜</span>
            <span className="hidden sm:inline font-luxury">FOR HER</span>
            <span className="text-[9px]">▼</span>
          </button>
        </div>
      </div>

      {/* ── Playlist FOR HER Dropdown Modal ── */}
      {showPlaylist && (
        <div className="absolute top-14 left-2 right-2 glass-card p-4 shadow-2xl border border-pink-300/50 animate-fade-in-up z-50 max-w-lg mx-auto">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/15">
            <span className="text-xs sm:text-sm font-bold text-amber-200 uppercase tracking-widest flex items-center gap-1.5 font-luxury">
              <span>💖</span> FOR HER (Playlist for Barsana)
            </span>
            <button
              onClick={() => setShowPlaylist(false)}
              className="text-white/60 hover:text-white text-xs px-2 py-0.5 rounded-full hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
            {playlist.map((t, idx) => {
              const isSelected = currentTrackIndex === idx;
              return (
                <div
                  key={t.id}
                  onClick={() => selectTrack(idx)}
                  className={`px-3.5 py-2.5 rounded-xl text-left cursor-pointer flex items-center justify-between transition-all gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-500/50 to-purple-600/50 border border-pink-300/60 text-white shadow-md scale-[1.01]'
                      : 'hover:bg-white/10 text-white/85'
                  }`}
                >
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5 break-words">
                      {isSelected && <span className="text-pink-300 flex-shrink-0">▶</span>}
                      {t.title}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-white/70 break-words mt-0.5">
                      {t.artist}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${
                      t.type === 'Bollywood'
                        ? 'text-amber-300 bg-amber-400/20 border-amber-300/40'
                        : t.type === 'Hollywood'
                        ? 'text-blue-300 bg-blue-400/20 border-blue-300/40'
                        : 'text-pink-300 bg-pink-400/20 border-pink-300/40'
                    }`}
                  >
                    {t.type}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-xs text-pink-200/80 px-1">
            <span>✨ Tap any track to play in background</span>
            <span className="text-pink-300 font-semibold">10 Handpicked Songs 💕</span>
          </div>
        </div>
      )}
    </div>
  );
}
