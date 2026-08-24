'use client';

import { useState, useEffect, useRef } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  type: 'Bollywood' | 'Hollywood' | '432Hz';
  bpm: number;
  notes: number[];
}

const playlist: Track[] = [
  {
    id: 'jadore',
    title: "J'adore La Vie",
    artist: '432 Hz Affirmative Love',
    type: '432Hz',
    bpm: 65,
    notes: [432, 540, 648, 864, 648, 540, 432, 324],
  },
  {
    id: 'kesariya',
    title: 'Kesariya (Acoustic Romance)',
    artist: 'Arijit Singh • Bollywood',
    type: 'Bollywood',
    bpm: 78,
    notes: [392, 440, 523, 587, 659, 587, 523, 440],
  },
  {
    id: 'perfect',
    title: 'Perfect (Romantic Piano)',
    artist: 'Ed Sheeran • Hollywood',
    type: 'Hollywood',
    bpm: 63,
    notes: [440, 493, 554, 659, 739, 659, 554, 493],
  },
  {
    id: 'tumhiho',
    title: 'Tum Hi Ho (Soulful Heart)',
    artist: 'Aashiqui 2 • Bollywood',
    type: 'Bollywood',
    bpm: 70,
    notes: [349, 392, 440, 523, 440, 392, 349, 293],
  },
  {
    id: 'untilifoundyou',
    title: 'Until I Found You (Vintage Love)',
    artist: 'Stephen Sanchez • Hollywood',
    type: 'Hollywood',
    bpm: 68,
    notes: [493, 554, 659, 739, 830, 739, 659, 554],
  },
  {
    id: 'raataan',
    title: 'Raataan Lambiyan (Lofi Chill)',
    artist: 'Shershaah • Bollywood',
    type: 'Bollywood',
    bpm: 75,
    notes: [392, 440, 493, 587, 659, 587, 493, 440],
  },
  {
    id: 'goldenhour',
    title: 'Golden Hour (Dreamscape)',
    artist: 'JVKE • Hollywood',
    type: 'Hollywood',
    bpm: 80,
    notes: [523, 587, 659, 783, 880, 783, 659, 587],
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const noteIndexRef = useRef(0);

  const currentTrack = playlist[currentTrackIndex];

  // Initialize Web Audio Context
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.connect(ctx.destination);

      audioContextRef.current = ctx;
      gainNodeRef.current = gainNode;
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return { ctx: audioContextRef.current, gainNode: gainNodeRef.current };
  };

  // Play continuous melodic arpeggios of the selected track
  const startMelody = (track: Track) => {
    stopMelody();
    const audio = getAudioContext();
    if (!audio.ctx || !audio.gainNode) return;

    const ctx = audio.ctx;
    const gainNode = audio.gainNode;
    gainNode.gain.setTargetAtTime(0.14, ctx.currentTime, 0.2);

    const intervalMs = (60 / track.bpm) * 500;

    const playNextNote = () => {
      if (!audioContextRef.current) return;
      const t = audioContextRef.current.currentTime;
      const freq = track.notes[noteIndexRef.current % track.notes.length];
      noteIndexRef.current++;

      // Lead Melody Note (Warm Sine)
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      // Harmonizer / Sub-octave (Soft Triangle)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(freq * 0.5, t);

      // Envelope ADSR
      const duration = intervalMs / 1000;
      noteGain.gain.setValueAtTime(0.001, t);
      noteGain.gain.exponentialRampToValueAtTime(0.08, t + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.001, t + duration * 0.95);

      subGain.gain.setValueAtTime(0.001, t);
      subGain.gain.exponentialRampToValueAtTime(0.03, t + 0.05);
      subGain.gain.exponentialRampToValueAtTime(0.001, t + duration * 0.95);

      osc.connect(noteGain);
      noteGain.connect(gainNode);
      subOsc.connect(subGain);
      subGain.connect(gainNode);

      osc.start(t);
      subOsc.start(t);
      osc.stop(t + duration);
      subOsc.stop(t + duration);

      timerRef.current = setTimeout(playNextNote, intervalMs);
    };

    playNextNote();
  };

  const stopMelody = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (audioContextRef.current && gainNodeRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(0.0001, audioContextRef.current.currentTime, 0.3);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopMelody();
    } else {
      setIsPlaying(true);
      startMelody(currentTrack);
    }
  };

  const nextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIdx);
    noteIndexRef.current = 0;
    if (isPlaying) {
      startMelody(playlist[nextIdx]);
    }
  };

  const prevTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIdx);
    noteIndexRef.current = 0;
    if (isPlaying) {
      startMelody(playlist[prevIdx]);
    }
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setShowPlaylist(false);
    noteIndexRef.current = 0;
    setIsPlaying(true);
    startMelody(playlist[index]);
  };

  useEffect(() => {
    return () => {
      stopMelody();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-[96vw] sm:max-w-md w-auto">
      {/* Liquid Glass Pill Player */}
      <div className="liquid-glass-pill px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2.5 shadow-2xl relative">
        {/* Previous Button */}
        <button
          onClick={prevTrack}
          className="text-white/60 hover:text-white p-1 transition-colors text-xs"
          title="Previous Track"
          aria-label="Previous Track"
        >
          ⏮
        </button>

        {/* Play/Pause Button with Pulse Aura */}
        <button
          onClick={togglePlay}
          className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 border border-pink-300/60 shadow-lg active:scale-95 transition-transform flex-shrink-0"
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
          className="text-white/60 hover:text-white p-1 transition-colors text-xs"
          title="Next Track"
          aria-label="Next Track"
        >
          ⏭
        </button>

        {/* Track Details & Playlist Toggle */}
        <div
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="flex flex-col text-left cursor-pointer min-w-[130px] sm:min-w-[170px] max-w-[200px]"
        >
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-xs font-bold text-white tracking-wide truncate">
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
            {isPlaying ? currentTrack.artist : 'Tap to Play / Change Playlist 🎵'}
          </span>
        </div>

        {/* Soundwave Visualizer / Playlist Dropdown Indicator */}
        <button
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="flex items-end gap-0.8 h-4 px-1.5 py-0.5 rounded-md hover:bg-white/10 transition-colors"
          title="Open Playlist"
          aria-label="Open Playlist"
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

      {/* Romantic Playlist Dropdown Modal */}
      {showPlaylist && (
        <div className="absolute top-14 left-0 right-0 glass-card p-3 shadow-2xl border border-pink-300/40 animate-fade-in-up z-50">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/15">
            <span className="text-xs font-bold text-amber-200 uppercase tracking-widest flex items-center gap-1.5">
              <span>💖</span> Romantic Playlist (Bollywood &amp; Hollywood)
            </span>
            <button
              onClick={() => setShowPlaylist(false)}
              className="text-white/60 hover:text-white text-xs px-1.5"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1">
            {playlist.map((t, idx) => {
              const isSelected = currentTrackIndex === idx;
              return (
                <div
                  key={t.id}
                  onClick={() => selectTrack(idx)}
                  className={`px-2.5 py-2 rounded-xl text-left cursor-pointer flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-500/40 to-purple-600/40 border border-pink-300/50 text-white'
                      : 'hover:bg-white/10 text-white/80'
                  }`}
                >
                  <div className="flex flex-col truncate pr-2">
                    <span className="text-xs font-semibold truncate text-white">
                      {isSelected ? '▶ ' : ''}
                      {t.title}
                    </span>
                    <span className="text-[10px] text-white/60 truncate">{t.artist}</span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${
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
        </div>
      )}
    </div>
  );
}
