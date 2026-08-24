'use client';

import { useState, useEffect, useRef } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  type: 'Bollywood' | 'Hollywood' | '432Hz';
  youtubeId: string;
  spotifyId?: string;
}

const playlist: Track[] = [
  {
    id: 'jadore',
    title: "J'adore La Vie (432 Hz)",
    artist: 'Inspired Feminine • Affirmation Song',
    type: '432Hz',
    youtubeId: 'qf46jT1h18c',
    spotifyId: 'track/3yTqV9YQ2aK82qM1t22L8Z',
  },
  {
    id: 'kesariya',
    title: 'Kesariya',
    artist: 'Arijit Singh, Pritam • Brahmastra',
    type: 'Bollywood',
    youtubeId: 'BddP6PYo2gs',
    spotifyId: 'track/6nWjTff1Wb6v74u3hVv61h',
  },
  {
    id: 'perfect',
    title: 'Perfect',
    artist: 'Ed Sheeran • Divide',
    type: 'Hollywood',
    youtubeId: '2Vv-BfVoq4g',
    spotifyId: 'track/0tgVpDi06FyKpA1z0VMD4v',
  },
  {
    id: 'tumhiho',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh • Aashiqui 2',
    type: 'Bollywood',
    youtubeId: 'IJq0yyWOh1E',
    spotifyId: 'track/56zZ48jNqE0Vf0uP8J1g4f',
  },
  {
    id: 'untilifoundyou',
    title: 'Until I Found You',
    artist: 'Stephen Sanchez • Easy On My Eyes',
    type: 'Hollywood',
    youtubeId: 'GxldQ9eX2wo',
    spotifyId: 'track/0T5iIrXA4p5G0Uag44VoPP',
  },
  {
    id: 'raataan',
    title: 'Raataan Lambiyan',
    artist: 'Jubin Nautiyal, Asees Kaur • Shershaah',
    type: 'Bollywood',
    youtubeId: 'gvyUuxdRdR4',
    spotifyId: 'track/2rOnSn27qVHgA2wElJRQQv',
  },
  {
    id: 'goldenhour',
    title: 'Golden Hour',
    artist: 'JVKE • this is what ____ feels like',
    type: 'Hollywood',
    youtubeId: 'PEM0Vs8jf1w',
    spotifyId: 'track/4yNk0iz9hhAw5NEN5b9jh5',
  },
  {
    id: 'shayad',
    title: 'Shayad',
    artist: 'Arijit Singh, Pritam • Love Aaj Kal',
    type: 'Bollywood',
    youtubeId: 'bhh_ZqQvh_E',
    spotifyId: 'track/1tNQ4k7W0f1K7i9K3J1u8L',
  },
  {
    id: 'dandelions',
    title: 'Dandelions',
    artist: 'Ruth B. • Safe Haven',
    type: 'Hollywood',
    youtubeId: 'W8a4sUabCUo',
    spotifyId: 'track/2GsHj6r3nJ62xH25fE23kM',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);

  const currentTrack = playlist[currentTrackIndex];
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const togglePlay = () => {
    if (!isPlayerLoaded) {
      setIsPlayerLoaded(true);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIdx);
    setIsPlayerLoaded(true);
    setIsPlaying(true);
  };

  const prevTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIdx);
    setIsPlayerLoaded(true);
    setIsPlaying(true);
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setShowPlaylist(false);
    setIsPlayerLoaded(true);
    setIsPlaying(true);
  };

  // Construct official YouTube stream embed URL with autoplay parameter
  const embedSrc = isPlayerLoaded && isPlaying
    ? `https://www.youtube-nocookie.com/embed/${currentTrack.youtubeId}?autoplay=1&enablejsapi=1&playsinline=1&controls=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`
    : `https://www.youtube-nocookie.com/embed/${currentTrack.youtubeId}?autoplay=0&enablejsapi=1&playsinline=1&controls=1`;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-[96vw] sm:max-w-md w-auto">
      {/* Liquid Glass Pill Player */}
      <div className="liquid-glass-pill px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2.5 shadow-2xl relative border border-pink-300/40">
        {/* Previous Button */}
        <button
          onClick={prevTrack}
          className="text-white/60 hover:text-white p-1 transition-colors text-xs active:scale-90"
          title="Previous Track"
          aria-label="Previous Track"
        >
          ⏮
        </button>

        {/* Play/Pause Button with Pulse Glow */}
        <button
          onClick={togglePlay}
          className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 border border-pink-300/60 shadow-lg active:scale-95 transition-transform flex-shrink-0 cursor-pointer"
          title={isPlaying ? 'Pause Music' : 'Play Music'}
          aria-label="Toggle Playback"
        >
          {isPlaying ? (
            <span className="text-white text-xs font-bold animate-pulse">❚❚</span>
          ) : (
            <span className="text-white text-xs ml-0.5 font-bold">▶</span>
          )}
          {isPlaying && (
            <span className="absolute inset-0 rounded-full bg-pink-400/40 animate-ping" />
          )}
        </button>

        {/* Next Button */}
        <button
          onClick={nextTrack}
          className="text-white/60 hover:text-white p-1 transition-colors text-xs active:scale-90"
          title="Next Track"
          aria-label="Next Track"
        >
          ⏭
        </button>

        {/* Track Details & Playlist Toggle */}
        <div
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="flex flex-col text-left cursor-pointer min-w-[130px] sm:min-w-[170px] max-w-[190px] group"
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
            {isPlaying ? currentTrack.artist : 'Tap to Play Exact Song 🎵'}
          </span>
        </div>

        {/* Soundwave Visualizer / Playlist Dropdown Indicator */}
        <button
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="flex items-end gap-0.8 h-4 px-1.5 py-0.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
          title="Open Romantic Playlist"
          aria-label="Open Romantic Playlist"
        >
          {[35, 75, 50, 95, 60].map((h, i) => (
            <span
              key={i}
              className="w-0.8 rounded-full bg-gradient-to-t from-pink-400 to-amber-300 transition-all duration-300"
              style={{
                height: isPlaying ? `${h}%` : '20%',
                animation: isPlaying
                  ? `soundWave 1.2s ease-in-out infinite alternate ${i * 0.15}s`
                  : 'none',
              }}
            />
          ))}
          <span className="text-[10px] text-white/60 ml-1">▼</span>
        </button>
      </div>

      {/* Embedded Real Audio/Video Stream Player (Seamless hidden / mini mode) */}
      {isPlayerLoaded && (
        <div
          className={`overflow-hidden transition-all duration-300 mt-2 rounded-2xl glass-card border border-pink-400/40 shadow-2xl ${
            showPlaylist ? 'hidden' : 'block'
          }`}
          style={{ width: '100%', height: isPlaying ? '80px' : '0px' }}
        >
          <iframe
            ref={iframeRef}
            src={embedSrc}
            title={currentTrack.title}
            className="w-full h-full border-0 rounded-2xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )}

      {/* Romantic Playlist Dropdown Modal */}
      {showPlaylist && (
        <div className="absolute top-14 left-0 right-0 glass-card p-3.5 shadow-2xl border border-pink-300/50 animate-fade-in-up z-50">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/15">
            <span className="text-xs font-bold text-amber-200 uppercase tracking-widest flex items-center gap-1.5">
              <span>💖</span> Romantic Playlist (Bollywood &amp; Hollywood)
            </span>
            <button
              onClick={() => setShowPlaylist(false)}
              className="text-white/60 hover:text-white text-xs px-1.5 py-0.5 rounded-full hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
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

          <div className="mt-2.5 pt-2 border-t border-white/10 text-center">
            <span className="text-[10px] text-pink-200/80 font-medium">
              ✨ Tap any song to instantly play the official audio ✨
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
