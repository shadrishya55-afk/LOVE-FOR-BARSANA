'use client';

import { useState, useRef, useEffect } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  type: '432Hz' | 'Hollywood' | 'Bollywood';
  spotifyId: string;
  audioUrl: string; // Reliable direct audio stream
}

const playlist: Track[] = [
  {
    id: 'jadore',
    title: "J'adore La Vie (432 Hz Affirmation)",
    artist: 'Inspired Feminine • Healing Frequencies',
    type: '432Hz',
    spotifyId: '5Z0nS9fMeqm5C57yWJ7E4o',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-432hz-112196.mp3',
  },
  {
    id: 'her',
    title: 'her (feat. Annika Wells)',
    artist: 'JVKE ft. Annika Wells • Hollywood',
    type: 'Hollywood',
    spotifyId: '7K3y5M29qE2oDqV6g8fQyX',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=romantic-piano-10781.mp3',
  },
  {
    id: 'kesariya',
    title: 'Kesariya (Romantic Reprise)',
    artist: 'Arijit Singh, Pritam • Brahmāstra',
    type: 'Bollywood',
    spotifyId: '6nWjTff1Wb6v74u3hVv61h',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_42f026046e.mp3?filename=indian-flute-romantic-124978.mp3',
  },
  {
    id: 'perfect',
    title: 'Perfect (Acoustic Strings)',
    artist: 'Ed Sheeran • Romantic Symphony',
    type: 'Hollywood',
    spotifyId: '0tgVpDi06FyKpA1z0VMD4v',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=sweet-love-acoustic-guitar-15886.mp3',
  },
  {
    id: 'tumhiho',
    title: 'Tum Hi Ho (Soulful Melody)',
    artist: 'Arijit Singh • Aashiqui 2',
    type: 'Bollywood',
    spotifyId: '56zZ48jNqE0Vf0uP8J1g4f',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2023/04/10/audio_5a21db5976.mp3?filename=soulful-piano-ambient-146312.mp3',
  },
  {
    id: 'untilifoundyou',
    title: 'Until I Found You',
    artist: 'Stephen Sanchez • Easy On My Eyes',
    type: 'Hollywood',
    spotifyId: '0T5iIrXA4p5G0Uag44VoPP',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f753ef.mp3?filename=vintage-love-ballad-122941.mp3',
  },
  {
    id: 'raataan',
    title: 'Raataan Lambiyan',
    artist: 'Jubin Nautiyal, Asees Kaur • Shershaah',
    type: 'Bollywood',
    spotifyId: '2rOnSn27qVHgA2wElJRQQv',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3?filename=romantic-night-ambient-116564.mp3',
  },
  {
    id: 'goldenhour',
    title: 'Golden Hour (Lofi Piano)',
    artist: 'JVKE • this is what ____ feels like',
    type: 'Hollywood',
    spotifyId: '4yNk0iz9hhAw5NEN5b9jh5',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db390771cb.mp3?filename=golden-hour-lofi-chill-110855.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showSpotifyEmbed, setShowSpotifyEmbed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = playlist[currentTrackIndex];

  // Initialize and handle audio playback
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.audioUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.75;
    } else {
      audioRef.current.src = currentTrack.audioUrl;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(true);
      });
    }
  };

  const nextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIdx);
    setIsPlaying(true);
  };

  const prevTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIdx);
    setIsPlaying(true);
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setShowPlaylist(false);
    setIsPlaying(true);
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-[96vw] sm:max-w-md w-auto">
      {/* ── Pure Aesthetic Liquid Glass Pill Player ── */}
      <div className="liquid-glass-pill px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2.5 shadow-2xl relative border border-pink-300/40 backdrop-blur-2xl">
        {/* Previous Button */}
        <button
          onClick={prevTrack}
          className="text-white/70 hover:text-white p-1 transition-colors text-xs active:scale-90 cursor-pointer"
          title="Previous Song"
          aria-label="Previous Song"
        >
          ⏮
        </button>

        {/* Play/Pause Button with Glowing Aura */}
        <button
          onClick={togglePlay}
          className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 border border-pink-300/60 shadow-lg active:scale-95 transition-transform flex-shrink-0 cursor-pointer"
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
          className="text-white/70 hover:text-white p-1 transition-colors text-xs active:scale-90 cursor-pointer"
          title="Next Song"
          aria-label="Next Song"
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
            {isPlaying ? currentTrack.artist : 'Tap to Play "FOR HER" 🎵'}
          </span>
        </div>

        {/* Soundwave Visualizer / Playlist Toggle */}
        <button
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="flex items-end gap-0.8 h-4 px-1.5 py-0.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
          title="Open Playlist FOR HER"
          aria-label="Open Playlist FOR HER"
        >
          {[35, 75, 50, 95, 60].map((h, i) => (
            <span
              key={i}
              className="w-0.8 rounded-full bg-gradient-to-t from-pink-400 via-rose-300 to-amber-300 transition-all duration-300"
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

      {/* ── Spotify Official Player Drawer Toggle Button ── */}
      {showSpotifyEmbed && (
        <div className="mt-2 glass-card p-2 rounded-2xl shadow-2xl border border-green-500/40 animate-fade-in-up">
          <div className="flex justify-between items-center px-1 mb-1">
            <span className="text-[11px] font-bold text-green-400 flex items-center gap-1">
              <span>🟢</span> Spotify Official Stream
            </span>
            <button
              onClick={() => setShowSpotifyEmbed(false)}
              className="text-white/60 hover:text-white text-xs px-1.5 py-0.5 rounded-full hover:bg-white/10"
            >
              ✕ Close
            </button>
          </div>
          <iframe
            src={`https://open.spotify.com/embed/track/${currentTrack.spotifyId}?utm_source=generator&theme=0`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl shadow-lg"
          />
        </div>
      )}

      {/* ── Playlist FOR HER Dropdown Modal ── */}
      {showPlaylist && (
        <div className="absolute top-14 left-0 right-0 glass-card p-3.5 shadow-2xl border border-pink-300/50 animate-fade-in-up z-50">
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentTrackIndex(idx);
                        setShowSpotifyEmbed(true);
                      }}
                      className="text-[11px] px-1.5 py-0.5 bg-green-500/20 hover:bg-green-500/40 text-green-300 border border-green-500/40 rounded-full flex items-center gap-1 transition-all"
                      title="Open in Spotify player"
                    >
                      <span>🟢</span> Spotify
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-pink-200/80 px-1">
            <span>✨ Tap song for instant audio</span>
            <button
              onClick={() => setShowSpotifyEmbed(!showSpotifyEmbed)}
              className="text-green-400 hover:text-green-300 underline cursor-pointer"
            >
              {showSpotifyEmbed ? 'Hide Spotify' : 'Open Spotify Player'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
