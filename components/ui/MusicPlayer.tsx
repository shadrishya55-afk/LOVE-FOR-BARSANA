'use client';

import { useState } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  type: '432Hz' | 'Hollywood' | 'Bollywood';
  youtubeId: string;
  duration: string;
}

const playlist: Track[] = [
  {
    id: 'jadore',
    title: "J'adore La Vie (432 Hz Affirmation)",
    artist: 'Inspired Feminine • 432 Hz Affirmation',
    type: '432Hz',
    youtubeId: 'BkSAZCRdmO8',
    duration: '3:45',
  },
  {
    id: 'her',
    title: 'her (feat. Annika Wells)',
    artist: 'JVKE ft. Annika Wells • Hollywood',
    type: 'Hollywood',
    youtubeId: 'KCi_sf9Y8c4',
    duration: '2:58',
  },
  {
    id: 'kesariya',
    title: 'Kesariya',
    artist: 'Arijit Singh, Pritam • Brahmāstra',
    type: 'Bollywood',
    youtubeId: 'BddP6PYo2gs',
    duration: '4:28',
  },
  {
    id: 'perfect',
    title: 'Perfect',
    artist: 'Ed Sheeran • Divide',
    type: 'Hollywood',
    youtubeId: '2Vv-BfVoq4g',
    duration: '4:23',
  },
  {
    id: 'tumhiho',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh • Aashiqui 2',
    type: 'Bollywood',
    youtubeId: 'IJq0yyWOh1E',
    duration: '4:22',
  },
  {
    id: 'untilifoundyou',
    title: 'Until I Found You',
    artist: 'Stephen Sanchez • Easy On My Eyes',
    type: 'Hollywood',
    youtubeId: 'GxldQ9eX2wo',
    duration: '2:57',
  },
  {
    id: 'raataan',
    title: 'Raataan Lambiyan',
    artist: 'Jubin Nautiyal, Asees Kaur • Shershaah',
    type: 'Bollywood',
    youtubeId: 'gvyUuxdRdR4',
    duration: '3:50',
  },
  {
    id: 'goldenhour',
    title: 'Golden Hour',
    artist: 'JVKE • this is what ____ feels like',
    type: 'Hollywood',
    youtubeId: 'PEM0Vs8jf1w',
    duration: '3:29',
  },
  {
    id: 'shayad',
    title: 'Shayad',
    artist: 'Arijit Singh, Pritam • Love Aaj Kal',
    type: 'Bollywood',
    youtubeId: 'bhh_ZqQvh_E',
    duration: '4:07',
  },
  {
    id: 'dandelions',
    title: 'Dandelions',
    artist: 'Ruth B. • Safe Haven',
    type: 'Hollywood',
    youtubeId: 'W8a4sUabCUo',
    duration: '3:53',
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
    <div className="fixed top-2.5 sm:top-4 left-1/2 -translate-x-1/2 z-50 max-w-[98vw] sm:max-w-xl w-full px-2">
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

      {/* ── Ultra-Sleek Dynamic Island Glass Capsule ── */}
      <div className="liquid-glass-pill px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between shadow-2xl relative border border-white/25 hover:border-pink-300/50 backdrop-blur-3xl transition-all duration-300 group">
        {/* Left: Spinning Holographic Vinyl & Play Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          {/* Holographic Spinning Vinyl Record */}
          <div
            onClick={togglePlay}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full relative flex items-center justify-center cursor-pointer shadow-lg flex-shrink-0 transition-transform ${
              isPlaying ? 'scale-105' : 'hover:scale-105'
            }`}
          >
            <div
              className={`w-full h-full rounded-full bg-gradient-to-tr from-neutral-900 via-purple-950 to-pink-900 border-2 border-pink-400/60 flex items-center justify-center shadow-inner ${
                isPlaying ? 'animate-spin-slow' : ''
              }`}
            >
              {/* Vinyl grooves */}
              <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-pink-500 to-amber-400 flex items-center justify-center">
                  <span className="text-[7px]">🍯</span>
                </div>
              </div>
            </div>
            {/* Center mini play badge */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/25 rounded-full backdrop-blur-[0.5px]">
              <span className="text-xs text-white drop-shadow-md">
                {isPlaying ? '⏸' : '▶'}
              </span>
            </div>
          </div>

          {/* Manual Play / Pause Button with Shimmer Gradient */}
          <button
            onClick={togglePlay}
            className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/40 flex items-center gap-1.5 text-white font-bold text-xs sm:text-sm shadow-xl active:scale-95 transition-all cursor-pointer flex-shrink-0 ${
              isPlaying
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-emerald-500/40'
                : 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 shadow-pink-500/40 hover:scale-105'
            }`}
            title={isPlaying ? 'Pause Music' : 'Play Music'}
            aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
          >
            <span className="text-xs leading-none">{isPlaying ? '⏸' : '▶'}</span>
            <span className="text-[10px] sm:text-xs tracking-wider uppercase font-semibold font-luxury">
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </span>
          </button>

          {/* Previous Song */}
          <button
            onClick={prevTrack}
            className="text-white/70 hover:text-white p-1 transition-colors text-xs sm:text-sm active:scale-90 cursor-pointer flex-shrink-0"
            title="Previous Song"
            aria-label="Previous Song"
          >
            ⏮
          </button>

          {/* Song Details (No Truncation / Fits Mobile Cleanly) */}
          <div
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="flex flex-col text-left cursor-pointer min-w-0 flex-1 pr-1"
          >
            <div className="flex flex-wrap items-center gap-1.5 leading-tight">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide font-luxury group-hover:text-pink-200 transition-colors break-words">
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

            <div className="flex items-center gap-2 leading-tight mt-0.5">
              <span className="text-[9px] sm:text-[10px] text-pink-200/90 font-light break-words">
                {currentTrack.artist}
              </span>

              {/* Dynamic Sound Spectrum Frequency Visualizer */}
              {isPlaying && (
                <div className="flex items-center gap-0.5 flex-shrink-0 ml-0.5">
                  <span className="w-1 h-2.5 bg-pink-400 rounded-full animate-soundWave" />
                  <span className="w-1 h-4 bg-rose-400 rounded-full animate-soundWave [animation-delay:150ms]" />
                  <span className="w-1 h-3 bg-amber-400 rounded-full animate-soundWave [animation-delay:300ms]" />
                  <span className="w-1 h-2 bg-purple-400 rounded-full animate-soundWave [animation-delay:450ms]" />
                </div>
              )}
            </div>
          </div>

          {/* Next Song */}
          <button
            onClick={nextTrack}
            className="text-white/70 hover:text-white p-1 transition-colors text-xs sm:text-sm active:scale-90 cursor-pointer flex-shrink-0"
            title="Next Song"
            aria-label="Next Song"
          >
            ⏭
          </button>
        </div>

        {/* Right: Playlist Dropdown Trigger */}
        <div className="flex items-center gap-1.5 flex-shrink-0 pl-1.5">
          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-pink-500/30 border border-white/25 hover:border-pink-300/50 text-[11px] sm:text-xs font-bold text-pink-200 flex items-center gap-1 transition-all cursor-pointer shadow-md"
            title="Open Playlist FOR HER"
          >
            <span className="text-xs">📜</span>
            <span className="hidden sm:inline font-luxury">FOR HER</span>
            <span className="text-[8px]">▼</span>
          </button>
        </div>
      </div>

      {/* ── Luxury Frosted Glass Playlist Modal ── */}
      {showPlaylist && (
        <div className="absolute top-14 left-2 right-2 glass-card p-4 sm:p-5 shadow-2xl border border-pink-300/50 animate-fade-in-up z-50 max-w-lg mx-auto bg-black/80 backdrop-blur-3xl">
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/15">
            <div className="flex items-center gap-2">
              <span className="text-lg">💖</span>
              <span className="text-xs sm:text-sm font-bold text-amber-200 uppercase tracking-widest font-luxury">
                FOR HER (Curated for Barsana)
              </span>
            </div>
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
                  className={`px-3.5 py-2.5 rounded-2xl text-left cursor-pointer flex items-center justify-between transition-all gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-500/50 via-purple-600/50 to-indigo-600/50 border border-pink-300/70 text-white shadow-lg scale-[1.01]'
                      : 'hover:bg-white/10 text-white/85 bg-white/5 border border-white/10'
                  }`}
                >
                  {/* Track Info */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 break-words font-luxury">
                      {isSelected ? (
                        <span className="text-pink-300 flex-shrink-0 animate-pulse">▶</span>
                      ) : (
                        <span className="text-white/40 text-[10px] flex-shrink-0 font-mono">0{idx + 1}</span>
                      )}
                      {t.title}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-white/70 break-words mt-0.5 pl-4">
                      {t.artist}
                    </span>
                  </div>

                  {/* Badge & Duration */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        t.type === 'Bollywood'
                          ? 'text-amber-300 bg-amber-400/20 border-amber-300/40'
                          : t.type === 'Hollywood'
                          ? 'text-blue-300 bg-blue-400/20 border-blue-300/40'
                          : 'text-pink-300 bg-pink-400/20 border-pink-300/40'
                      }`}
                    >
                      {t.type}
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">{t.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-xs text-pink-200/80 px-1">
            <span>✨ Tap any track to play in background</span>
            <span className="text-amber-300 font-semibold font-luxury">10 Handpicked Songs 💕</span>
          </div>
        </div>
      )}
    </div>
  );
}
