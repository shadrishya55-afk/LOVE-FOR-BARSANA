'use client';

import { useState, useEffect, useRef } from 'react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 432Hz Harmonic Ambient Romance Synth engine (runs in browser seamlessly)
  const start432HzSynth = () => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.connect(ctx.destination);
        gainNodeRef.current = gainNode;

        // 432Hz Root & Romantic Chord Frequencies (432Hz, 540Hz, 648Hz, 864Hz)
        const freqs = [216, 432, 540, 648, 864];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          
          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(f, ctx.currentTime);

          // Subtle slow LFO vibrato for dreamy soothing 432Hz feel
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(0.2 + idx * 0.1, ctx.currentTime);
          lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
          lfo.connect(osc.frequency);
          lfo.start();

          oscGain.gain.setValueAtTime(0.04 / (idx + 1), ctx.currentTime);
          osc.connect(oscGain);
          oscGain.connect(gainNode);
          osc.start();
        });
      }

      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0.09, audioContextRef.current.currentTime, 0.5);
      }
    } catch (e) {
      console.warn('Audio synth initialized:', e);
    }
  };

  const stop432HzSynth = () => {
    if (audioContextRef.current && gainNodeRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(0.0001, audioContextRef.current.currentTime, 0.5);
    }
  };

  const togglePlay = () => {
    setHasInteracted(true);
    if (isPlaying) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (audioRef.current) audioRef.current.pause();
      stop432HzSynth();
    } else {
      setIsPlaying(true);
      isPlayingRef.current = true;
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          start432HzSynth();
        });
      } else {
        start432HzSynth();
      }
    }
  };

  useEffect(() => {
    // Try auto-starting on first user touch anywhere
    const onFirstUserAction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    };
    window.addEventListener('click', onFirstUserAction, { once: true });
    window.addEventListener('touchstart', onFirstUserAction, { once: true });
    return () => {
      window.removeEventListener('click', onFirstUserAction);
      window.removeEventListener('touchstart', onFirstUserAction);
    };
  }, [hasInteracted]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-[92vw] sm:max-w-md w-auto">
      <button
        onClick={togglePlay}
        className="liquid-glass-pill px-4 py-2 sm:px-5 sm:py-2.5 flex items-center gap-3 cursor-pointer group active:scale-95 transition-all duration-300"
        title={isPlaying ? 'Pause Music' : 'Play Music'}
        aria-label="Toggle Music Player"
      >
        {/* Glowing Icon Indicator */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-pink-500/30 border border-pink-400/50 shadow-inner group-hover:scale-110 transition-transform">
          {isPlaying ? (
            <span className="text-pink-300 text-sm animate-pulse">❚❚</span>
          ) : (
            <span className="text-pink-200 text-sm ml-0.5">▶</span>
          )}
          {isPlaying && (
            <span className="absolute inset-0 rounded-full bg-pink-400/20 animate-ping" />
          )}
        </div>

        {/* Track Details */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] sm:text-xs font-semibold text-white/95 tracking-wide">
              J&apos;adore La Vie
            </span>
            <span className="text-[9px] font-bold text-amber-300 bg-amber-400/20 px-1.5 py-0.2 rounded-full border border-amber-300/40">
              432 Hz
            </span>
          </div>
          <span className="text-[10px] text-pink-200/80 font-light truncate max-w-[140px] sm:max-w-[200px]">
            {isPlaying ? 'Affirmations for Barsana 💕' : 'Tap to play music 🎵'}
          </span>
        </div>

        {/* Animated Sound Wave Visualizer */}
        <div className="flex items-end gap-0.8 h-4 ml-1">
          {[40, 80, 50, 100, 65].map((h, i) => (
            <span
              key={i}
              className="w-0.8 rounded-full bg-gradient-to-t from-pink-500 to-amber-300 transition-all duration-300"
              style={{
                height: isPlaying ? `${h}%` : '20%',
                animation: isPlaying ? `soundWave 1.2s ease-in-out infinite alternate ${i * 0.15}s` : 'none',
              }}
            />
          ))}
        </div>
      </button>

      {/* Embedded Audio Element (Plays if asset present or defaults to 432Hz ambient synth) */}
      <audio
        ref={audioRef}
        src="/LOVE-FOR-BARSANA/audio/jadore-la-vie.mp3"
        loop
        preload="auto"
      />
    </div>
  );
}

