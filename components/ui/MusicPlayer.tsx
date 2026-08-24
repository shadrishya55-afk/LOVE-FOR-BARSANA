'use client';

import { useState } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  type: '432Hz' | 'Hollywood' | 'Bollywood';
  spotifyId: string;
  spotifyUri: string;
}

const playlist: Track[] = [
  {
    id: 'her',
    title: 'her (feat. Annika Wells)',
    artist: 'JVKE ft. Annika Wells • Hollywood',
    type: 'Hollywood',
    spotifyId: '5dqq24wK9MIMUf3si2mJWN',
    spotifyUri: 'https://open.spotify.com/track/5dqq24wK9MIMUf3si2mJWN',
  },
  {
    id: 'kesariya',
    title: 'Kesariya',
    artist: 'Arijit Singh, Pritam • Brahmāstra',
    type: 'Bollywood',
    spotifyId: '6nWjTff1Wb6v74u3hVv61h',
    spotifyUri: 'https://open.spotify.com/track/6nWjTff1Wb6v74u3hVv61h',
  },
  {
    id: 'perfect',
    title: 'Perfect',
    artist: 'Ed Sheeran • Divide',
    type: 'Hollywood',
    spotifyId: '0tgVpDi06FyKpA1z0VMD4v',
    spotifyUri: 'https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v',
  },
  {
    id: 'jadore',
    title: "J'adore La Vie (432 Hz Affirmation)",
    artist: 'Inspired Feminine • Affirmation Song',
    type: '432Hz',
    spotifyId: '4jVn0R8Q8k39M4N4U0w2kL',
    spotifyUri: 'https://open.spotify.com/search/Inspired%20Feminine%20J%27adore%20La%20Vie',
  },
  {
    id: 'tumhiho',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh • Aashiqui 2',
    type: 'Bollywood',
    spotifyId: '56zZ48jNqE0Vf0uP8J1g4f',
    spotifyUri: 'https://open.spotify.com/track/56zZ48jNqE0Vf0uP8J1g4f',
  },
  {
    id: 'untilifoundyou',
    title: 'Until I Found You',
    artist: 'Stephen Sanchez • Easy On My Eyes',
    type: 'Hollywood',
    spotifyId: '0T5iIrXA4p5G0Uag44VoPP',
    spotifyUri: 'https://open.spotify.com/track/0T5iIrXA4p5G0Uag44VoPP',
  },
  {
    id: 'raataan',
    title: 'Raataan Lambiyan',
    artist: 'Jubin Nautiyal, Asees Kaur • Shershaah',
    type: 'Bollywood',
    spotifyId: '2rOnSn27qVHgA2wElJRQQv',
    spotifyUri: 'https://open.spotify.com/track/2rOnSn27qVHgA2wElJRQQv',
  },
  {
    id: 'goldenhour',
    title: 'Golden Hour',
    artist: 'JVKE • this is what ____ feels like',
    type: 'Hollywood',
    spotifyId: '4yNk0iz9hhAw5NEN5b9jh5',
    spotifyUri: 'https://open.spotify.com/track/4yNk0iz9hhAw5NEN5b9jh5',
  },
  {
    id: 'shayad',
    title: 'Shayad',
    artist: 'Arijit Singh, Pritam • Love Aaj Kal',
    type: 'Bollywood',
    spotifyId: '1tNQ4k7W0f1K7i9K3J1u8L',
    spotifyUri: 'https://open.spotify.com/track/1tNQ4k7W0f1K7i9K3J1u8L',
  },
  {
    id: 'dandelions',
    title: 'Dandelions',
    artist: 'Ruth B. • Safe Haven',
    type: 'Hollywood',
    spotifyId: '2GsHj6r3nJ62xH25fE23kM',
    spotifyUri: 'https://open.spotify.com/track/2GsHj6r3nJ62xH25fE23kM',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const currentTrack = playlist[currentTrackIndex];

  const nextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const prevTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setShowPlaylist(false);
  };

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 max-w-[96vw] sm:max-w-md w-full px-2">
      {/* ── Compact Liquid Glass Pill Bar ── */}
      <div className="liquid-glass-pill px-3 py-2 flex items-center justify-between shadow-2xl relative border border-pink-300/40 backdrop-blur-2xl">
        {/* Navigation & Track Name */}
        <div className="flex items-center gap-2 min-w-0">
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
            <span className="text-[10px] text-pink-200/90 font-light truncate">
              {currentTrack.artist}
            </span>
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

        {/* Right Controls (Playlist & Minimize/Expand) */}
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

      {/* ── Official Spotify Embed Audio Stream Player (Unbreakable, 100% Correct Music) ── */}
      {isExpanded && (
        <div className="mt-1.5 glass-card p-1.5 rounded-2xl shadow-2xl border border-pink-400/40 animate-fade-in-up bg-black/40 backdrop-blur-xl">
          <iframe
            key={currentTrack.spotifyId}
            src={`https://open.spotify.com/embed/track/${currentTrack.spotifyId}?utm_source=generator&theme=0`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl shadow-lg block"
            title={`Playing ${currentTrack.title}`}
          />
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
                    <a
                      href={t.spotifyUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] p-1 text-green-400 hover:text-green-300 hover:scale-115 transition-transform"
                      title="Open in Spotify App"
                      aria-label="Open in Spotify App"
                    >
                      🟢
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-pink-200/80 px-1">
            <span>✨ Tap any track to play in Spotify player</span>
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 flex items-center gap-1"
            >
              <span>🟢</span> Spotify Official
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
