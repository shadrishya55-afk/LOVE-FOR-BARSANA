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
    artist: 'Inspired Feminine • 432 Hz Affirmation',
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
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

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
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 max-w-[96vw] sm:max-w-md w-full px-2">
      {/* ── Compact Frosted Liquid Glass Top Bar ── */}
      <div className="liquid-glass-pill px-3.5 py-2.5 flex items-center justify-between shadow-2xl relative border border-pink-300/40 backdrop-blur-2xl">
        {/* Play/Pause & Song Navigation */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 border border-white/40 flex items-center justify-center text-white text-xs shadow-lg active:scale-90 transition-transform cursor-pointer flex-shrink-0"
            title={isPlaying ? 'Pause Music' : 'Play Music'}
            aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <button
            onClick={prevTrack}
            className="text-white/70 hover:text-white p-1 transition-colors text-xs active:scale-90 cursor-pointer"
            title="Previous Song"
            aria-label="Previous Song"
          >
            ⏮
          </button>

          <div
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="flex flex-col text-left cursor-pointer truncate group"
          >
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-xs font-bold text-white tracking-wide truncate group-hover:text-pink-200 transition-colors">
                {currentTrack.title}
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border flex-shrink-0 ${
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
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[10px] text-pink-200/90 font-light truncate">
                {currentTrack.artist}
              </span>
              {isPlaying && (
                <span className="flex items-center gap-0.5 flex-shrink-0">
                  <span className="w-1 h-2.5 bg-pink-400 rounded-full animate-pulse" />
                  <span className="w-1 h-3.5 bg-rose-400 rounded-full animate-pulse delay-75" />
                  <span className="w-1 h-2 bg-amber-400 rounded-full animate-pulse delay-150" />
                </span>
              )}
            </div>
          </div>

          <button
            onClick={nextTrack}
            className="text-white/70 hover:text-white p-1 transition-colors text-xs active:scale-90 cursor-pointer"
            title="Next Song"
            aria-label="Next Song"
          >
            ⏭
          </button>
        </div>

        {/* Right Action Buttons (Playlist & Minimize/Expand) */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="px-2 py-1 rounded-lg bg-pink-500/25 hover:bg-pink-500/40 border border-pink-300/40 text-[11px] font-bold text-pink-200 flex items-center gap-1 transition-all cursor-pointer"
            title="Open Playlist FOR HER"
          >
            <span>📜</span>
            <span className="hidden sm:inline">FOR HER</span>
            <span className="text-[9px]">▼</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white text-xs transition-colors cursor-pointer"
            title={isExpanded ? 'Minimize Player' : 'Expand Player'}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* ── Exact Official YouTube Audio/Video Player ── */}
      {isExpanded && isPlaying && (
        <div className="mt-1.5 glass-card p-1.5 rounded-2xl shadow-2xl border border-pink-400/40 animate-fade-in-up bg-black/60 backdrop-blur-xl">
          <div className="relative w-full aspect-video max-h-[190px] rounded-xl overflow-hidden shadow-inner bg-black">
            <iframe
              key={currentTrack.youtubeId}
              src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1&enablejsapi=1&rel=0&playsinline=1`}
              width="100%"
              height="100%"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full object-cover block border-0"
              title={`Playing ${currentTrack.title}`}
            />
          </div>
          <div className="flex items-center justify-between px-2 pt-1.5 text-[10px] text-pink-200/80">
            <span>🎵 Playing exact song for Barsana</span>
            <a
              href={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-200 flex items-center gap-1 underline"
            >
              <span>▶</span> YouTube Full
            </a>
          </div>
        </div>
      )}

      {/* ── Playlist FOR HER Dropdown Modal ── */}
      {showPlaylist && (
        <div className="absolute top-14 left-2 right-2 glass-card p-3.5 shadow-2xl border border-pink-300/50 animate-fade-in-up z-50">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/15">
            <span className="text-xs font-bold text-amber-200 uppercase tracking-widest flex items-center gap-1.5 font-luxury">
              <span>💖</span> FOR HER (Playlist for Barsana)
            </span>
            <button
              onClick={() => setShowPlaylist(false)}
              className="text-white/60 hover:text-white text-xs px-1.5 py-0.5 rounded-full hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
            {playlist.map((t, idx) => {
              const isSelected = currentTrackIndex === idx;
              return (
                <div
                  key={t.id}
                  onClick={() => selectTrack(idx)}
                  className={`px-3 py-2 rounded-xl text-left cursor-pointer flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-500/50 to-purple-600/50 border border-pink-300/60 text-white shadow-md scale-[1.01]'
                      : 'hover:bg-white/10 text-white/85'
                  }`}
                >
                  <div className="flex flex-col truncate pr-2">
                    <span className="text-xs font-semibold truncate text-white flex items-center gap-1">
                      {isSelected && <span className="text-pink-300">▶</span>}
                      {t.title}
                    </span>
                    <span className="text-[10px] text-white/70 truncate">{t.artist}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
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
                </div>
              );
            })}
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-pink-200/80 px-1">
            <span>✨ Tap any track to play immediately</span>
            <span className="text-pink-300">10 Handpicked Songs 💕</span>
          </div>
        </div>
      )}
    </div>
  );
}
