'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ── Types & Interfaces ──
interface Collectible {
  x: number;
  y: number;
  type: 'rasgulla' | 'heart' | 'star';
  collected: boolean;
  pulse: number;
  zone: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  minX: number;
  maxX: number;
  walkFrame: number;
  zone: number;
  type: 'calico' | 'cyber' | 'angel';
  facing: 'left' | 'right';
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  isMoving?: boolean;
  vx?: number;
  vy?: number;
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
  zone: 1 | 2 | 3;
  type?: 'moss' | 'neon' | 'crystal' | 'cloud';
}

interface BouncePad {
  x: number;
  y: number;
  width: number;
  height: number;
  bounceForce: number;
  springAnimation: number; // For squish-and-bounce spring visual
}

interface Checkpoint {
  id: number;
  x: number;
  y: number;
  spawnX: number;
  spawnY: number;
  activated: boolean;
  name: string;
  glowPhase: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'star' | 'heart' | 'ring';
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
  fontSize?: number;
}

interface SakuraPetal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  spinSpeed: number;
  swaySpeed: number;
  swayAmp: number;
  swayPhase: number;
  alpha: number;
}

interface Cloud {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  layer: number;
  alpha: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  color: string;
  twinkleSpeed: number;
  phase: number;
}

export default function LovePlatformer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'won' | 'lost'>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [rasgullasCollected, setRasgullasCollected] = useState(0);
  const [heartsCollected, setHeartsCollected] = useState(0);
  const [currentZoneName, setCurrentZoneName] = useState('Twilight Meadow');
  const [activeCheckpointName, setActiveCheckpointName] = useState('Meadow Entrance');
  const [combo, setCombo] = useState(1);

  // Audio Context Ref for 16-Bit Chiptune Web Audio Synthesizer
  const sfxContextRef = useRef<AudioContext | null>(null);

  const playSfx = useCallback((type: 'jump' | 'doubleJump' | 'dash' | 'bounce' | 'checkpoint' | 'collect' | 'win' | 'hit') => {
    try {
      if (!sfxContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        sfxContextRef.current = new AudioCtx();
      }
      const ctx = sfxContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const t = ctx.currentTime;

      if (type === 'jump') {
        // 8-bit square jump sweep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(580, t + 0.12);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.12);
      } else if (type === 'doubleJump') {
        // High-pitched magical 16-bit chime arpeggio
        const notes = [523.25, 659.25, 1046.5];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + i * 0.04);
          gain.gain.setValueAtTime(0.15, t + i * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + i * 0.04);
          osc.stop(t + i * 0.04 + 0.1);
        });
      } else if (type === 'dash') {
        // Filtered fast noise sweep + laser tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(750, t);
        osc.frequency.exponentialRampToValueAtTime(120, t + 0.15);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.15);
      } else if (type === 'bounce') {
        // Springy boing frequency glide with vibrato
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, t);
        osc.frequency.exponentialRampToValueAtTime(780, t + 0.22);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.22);
      } else if (type === 'checkpoint') {
        // Celestial 4-note bell chime (E5 -> G#5 -> B5 -> E6)
        const notes = [659.25, 830.61, 987.77, 1318.51];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + idx * 0.08);
          gain.gain.setValueAtTime(0.18, t + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + idx * 0.08);
          osc.stop(t + idx * 0.08 + 0.35);
        });
      } else if (type === 'collect') {
        // Sparkle coin ping (F#6 -> C#7)
        const notes = [1479.98, 2217.46];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + idx * 0.045);
          gain.gain.setValueAtTime(0.14, t + idx * 0.045);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.045 + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + idx * 0.045);
          osc.stop(t + idx * 0.045 + 0.12);
        });
      } else if (type === 'hit') {
        // 8-bit crunchy impact
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(170, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.22);
        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.22);
      } else if (type === 'win') {
        // Glorious 16-bit Victory Fanfare Arpeggio
        const fanfare = [
          { f: 523.25, time: 0.00, dur: 0.18 }, // C5
          { f: 659.25, time: 0.12, dur: 0.18 }, // E5
          { f: 783.99, time: 0.24, dur: 0.18 }, // G5
          { f: 1046.5, time: 0.36, dur: 0.30 }, // C6
          { f: 880.00, time: 0.60, dur: 0.16 }, // A5
          { f: 1046.5, time: 0.74, dur: 0.20 }, // C6
          { f: 1318.5, time: 0.92, dur: 0.65 }, // E6 triumph!
        ];
        fanfare.forEach((n) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(n.f, t + n.time);
          gain.gain.setValueAtTime(0.2, t + n.time);
          gain.gain.exponentialRampToValueAtTime(0.001, t + n.time + n.dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + n.time);
          osc.stop(t + n.time + n.dur);
        });
      }
    } catch {
      // Audio context fallback if muted / not initialized yet
    }
  }, []);

  // Controls state
  const keysRef = useRef({ left: false, right: false, up: false, dash: false });

  // Game World Constants (Expanded to 3200px across 3 Zones!)
  const worldWidth = 3200;
  const worldHeight = 400;

  // ── LEVEL DESIGN: 3 GORGEOUS ZONES ACROSS 3200PX ──
  // Zone 1: Twilight Meadow (0 - 1050px)
  // Zone 2: Neon Cloudways (1050 - 2150px)
  // Zone 3: Celestial Citadel (2150 - 3200px)

  const initialPlatforms: Platform[] = [
    // ── Zone 1: Twilight Meadow (Moss & Floating Stone Isles) ──
    { x: 0, y: 350, width: 300, height: 50, zone: 1, type: 'moss' },
    { x: 340, y: 290, width: 160, height: 22, zone: 1, type: 'moss' },
    { x: 550, y: 230, width: 150, height: 22, zone: 1, type: 'moss' },
    { x: 740, y: 280, width: 140, height: 22, isMoving: true, vx: 1.0, minX: 720, maxX: 880, zone: 1, type: 'moss' },
    { x: 920, y: 340, width: 220, height: 40, zone: 1, type: 'moss' }, // Checkpoint 1 Island

    // ── Zone 2: Neon Cloudways (Translucent Neon Glass & Floating Clouds) ──
    { x: 1180, y: 290, width: 150, height: 20, zone: 2, type: 'neon' },
    { x: 1380, y: 220, width: 140, height: 20, isMoving: true, vx: 1.4, minX: 1360, maxX: 1540, zone: 2, type: 'neon' },
    { x: 1570, y: 270, width: 130, height: 20, zone: 2, type: 'cloud' },
    { x: 1740, y: 210, width: 140, height: 20, isMoving: true, vy: 0.8, minY: 180, maxY: 250, zone: 2, type: 'crystal' },
    { x: 1920, y: 280, width: 130, height: 20, zone: 2, type: 'neon' },
    { x: 2090, y: 340, width: 200, height: 40, zone: 2, type: 'neon' }, // Checkpoint 2 Island

    // ── Zone 3: Celestial Citadel (Radiant Golden Crystal Pedestals & Bridges) ──
    { x: 2330, y: 290, width: 140, height: 22, zone: 3, type: 'crystal' },
    { x: 2510, y: 230, width: 130, height: 22, isMoving: true, vx: 1.2, minX: 2490, maxX: 2650, zone: 3, type: 'crystal' },
    { x: 2680, y: 280, width: 130, height: 22, zone: 3, type: 'crystal' },
    { x: 2850, y: 220, width: 140, height: 22, zone: 3, type: 'crystal' },
    { x: 3020, y: 330, width: 280, height: 60, zone: 3, type: 'crystal' }, // Climax Victory Citadel
  ];

  // Trampoline Super Bounce Pads (Spring loaded ⬆⚡)
  const initialBouncePads: BouncePad[] = [
    { x: 240, y: 340, width: 38, height: 12, bounceForce: -14.2, springAnimation: 0 },
    { x: 860, y: 330, width: 38, height: 12, bounceForce: -14.6, springAnimation: 0 },
    { x: 1320, y: 280, width: 38, height: 12, bounceForce: -14.8, springAnimation: 0 },
    { x: 1870, y: 270, width: 38, height: 12, bounceForce: -15.0, springAnimation: 0 },
    { x: 2460, y: 280, width: 38, height: 12, bounceForce: -15.0, springAnimation: 0 },
  ];

  // Checkpoints: Glowing Heart Lanterns (🏮)
  const initialCheckpoints: Checkpoint[] = [
    { id: 1, x: 980, y: 285, spawnX: 950, spawnY: 280, activated: false, name: 'Meadow Heart Shrine', glowPhase: 0 },
    { id: 2, x: 2150, y: 285, spawnX: 2120, spawnY: 280, activated: false, name: 'Neon Cloud Shrine', glowPhase: 1.5 },
  ];

  // Collectibles (Golden Rasgullas 🍯, Radiant Hearts 💖, Celestial Stars ⭐)
  const initialCollectibles: Collectible[] = [
    // Zone 1
    { x: 120, y: 300, type: 'rasgulla', collected: false, pulse: 0, zone: 1 },
    { x: 410, y: 240, type: 'heart', collected: false, pulse: 1, zone: 1 },
    { x: 620, y: 180, type: 'rasgulla', collected: false, pulse: 2, zone: 1 },
    { x: 800, y: 210, type: 'star', collected: false, pulse: 3, zone: 1 },

    // Zone 2
    { x: 1250, y: 240, type: 'rasgulla', collected: false, pulse: 4, zone: 2 },
    { x: 1440, y: 160, type: 'heart', collected: false, pulse: 5, zone: 2 },
    { x: 1630, y: 210, type: 'rasgulla', collected: false, pulse: 6, zone: 2 },
    { x: 1800, y: 150, type: 'heart', collected: false, pulse: 7, zone: 2 },
    { x: 1980, y: 220, type: 'star', collected: false, pulse: 8, zone: 2 },

    // Zone 3
    { x: 2390, y: 230, type: 'rasgulla', collected: false, pulse: 9, zone: 3 },
    { x: 2570, y: 170, type: 'heart', collected: false, pulse: 10, zone: 3 },
    { x: 2740, y: 220, type: 'rasgulla', collected: false, pulse: 11, zone: 3 },
    { x: 2920, y: 160, type: 'heart', collected: false, pulse: 12, zone: 3 },
    { x: 3060, y: 260, type: 'star', collected: false, pulse: 13, zone: 3 },
  ];

  // Enemies: Cute Slower Meme Cats (Speed 0.6 to 0.8 with wagging tails, ear twitches, cute faces!)
  const initialObstacles: Obstacle[] = [
    // Zone 1: Ginger Calico Cats (Speed 0.65)
    { x: 390, y: 266, width: 28, height: 24, speed: 0.65, minX: 355, maxX: 485, walkFrame: 0, zone: 1, type: 'calico', facing: 'right' },
    { x: 590, y: 206, width: 28, height: 24, speed: 0.70, minX: 565, maxX: 685, walkFrame: 1.5, zone: 1, type: 'calico', facing: 'right' },

    // Zone 2: Cyber/Neon Lavender Cats with Glowing Bell (Speed 0.72)
    { x: 1220, y: 266, width: 28, height: 24, speed: 0.72, minX: 1195, maxX: 1315, walkFrame: 2.2, zone: 2, type: 'cyber', facing: 'right' },
    { x: 1610, y: 246, width: 28, height: 24, speed: 0.75, minX: 1585, maxX: 1685, walkFrame: 0.8, zone: 2, type: 'cyber', facing: 'right' },

    // Zone 3: Celestial Angel Cats with Tiny Golden Halo (Speed 0.78)
    { x: 2360, y: 266, width: 28, height: 24, speed: 0.76, minX: 2345, maxX: 2455, walkFrame: 1.2, zone: 3, type: 'angel', facing: 'right' },
    { x: 2710, y: 256, width: 28, height: 24, speed: 0.78, minX: 2695, maxX: 2795, walkFrame: 3.1, zone: 3, type: 'angel', facing: 'right' },
  ];

  // Background Scenery Elements: Starfield, Sakura Petals, Clouds
  const initialStars: Star[] = Array.from({ length: 90 }, (_, i) => ({
    x: (i * 37) % worldWidth,
    y: (i * 29) % 240,
    radius: (i % 3) * 0.7 + 0.8,
    color: ['#FFD700', '#F472B6', '#60A5FA', '#FFFFFF', '#C084FC'][i % 5],
    twinkleSpeed: 0.02 + (i % 5) * 0.015,
    phase: i * 0.5,
  }));

  const initialSakura: SakuraPetal[] = Array.from({ length: 35 }, (_, i) => ({
    x: Math.random() * worldWidth,
    y: Math.random() * worldHeight,
    vx: 0.4 + Math.random() * 0.6,
    vy: 0.6 + Math.random() * 0.8,
    size: 4 + Math.random() * 4,
    angle: Math.random() * Math.PI * 2,
    spinSpeed: (Math.random() - 0.5) * 0.04,
    swaySpeed: 0.02 + Math.random() * 0.03,
    swayAmp: 15 + Math.random() * 20,
    swayPhase: Math.random() * Math.PI * 2,
    alpha: 0.4 + Math.random() * 0.4,
  }));

  const initialClouds: Cloud[] = [
    { x: 80, y: 60, width: 140, height: 45, speed: 0.12, layer: 1, alpha: 0.35 },
    { x: 420, y: 110, width: 180, height: 55, speed: 0.18, layer: 2, alpha: 0.45 },
    { x: 820, y: 50, width: 160, height: 50, speed: 0.14, layer: 1, alpha: 0.35 },
    { x: 1280, y: 90, width: 210, height: 60, speed: 0.20, layer: 2, alpha: 0.5 },
    { x: 1720, y: 40, width: 170, height: 50, speed: 0.12, layer: 1, alpha: 0.35 },
    { x: 2180, y: 80, width: 220, height: 65, speed: 0.22, layer: 2, alpha: 0.55 },
    { x: 2680, y: 50, width: 190, height: 55, speed: 0.15, layer: 1, alpha: 0.4 },
  ];

  // Game Engine State Ref
  const gameRef = useRef({
    player: {
      x: 50,
      y: 290,
      width: 28,
      height: 48,
      vx: 0,
      vy: 0,
      isGrounded: false,
      canDoubleJump: true,
      facing: 'right' as 'left' | 'right',
      walkFrame: 0,
      dashCooldown: 0,
      dashTimer: 0,
      invulnerableTimer: 0,
      squashStretch: 1.0, // Dynamic squash/stretch on jump/land
      scarfNodes: [
        { x: 50, y: 308 },
        { x: 46, y: 310 },
        { x: 40, y: 312 },
        { x: 34, y: 314 },
      ],
    },
    goal: {
      x: 3100,
      y: 270,
      width: 36,
      height: 60,
    },
    lastCheckpoint: {
      x: 50,
      y: 290,
      name: 'Meadow Entrance',
    },
    platforms: [...initialPlatforms],
    bouncePads: [...initialBouncePads],
    checkpoints: [...initialCheckpoints],
    collectibles: [...initialCollectibles],
    obstacles: [...initialObstacles],
    stars: [...initialStars],
    sakura: [...initialSakura],
    clouds: [...initialClouds],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    cameraX: 0,
    score: 0,
    lives: 3,
    rasgullas: 0,
    hearts: 0,
    combo: 1,
    comboTimer: 0,
    currentZone: 1,
  });

  // Reset / Respawn Function
  const resetGame = useCallback(() => {
    gameRef.current = {
      player: {
        x: 50,
        y: 290,
        width: 28,
        height: 48,
        vx: 0,
        vy: 0,
        isGrounded: false,
        canDoubleJump: true,
        facing: 'right',
        walkFrame: 0,
        dashCooldown: 0,
        dashTimer: 0,
        invulnerableTimer: 0,
        squashStretch: 1.0,
        scarfNodes: [
          { x: 50, y: 308 },
          { x: 46, y: 310 },
          { x: 40, y: 312 },
          { x: 34, y: 314 },
        ],
      },
      goal: {
        x: 3100,
        y: 270,
        width: 36,
        height: 60,
      },
      lastCheckpoint: {
        x: 50,
        y: 290,
        name: 'Meadow Entrance',
      },
      platforms: initialPlatforms.map((p) => ({ ...p })),
      bouncePads: initialBouncePads.map((b) => ({ ...b })),
      checkpoints: initialCheckpoints.map((c) => ({ ...c, activated: false })),
      collectibles: initialCollectibles.map((c) => ({ ...c, collected: false })),
      obstacles: initialObstacles.map((o) => ({ ...o })),
      stars: initialStars.map((s) => ({ ...s })),
      sakura: initialSakura.map((sk) => ({ ...sk })),
      clouds: initialClouds.map((cl) => ({ ...cl })),
      particles: [],
      floatingTexts: [],
      cameraX: 0,
      score: 0,
      lives: 3,
      rasgullas: 0,
      hearts: 0,
      combo: 1,
      comboTimer: 0,
      currentZone: 1,
    };
    setScore(0);
    setLives(3);
    setRasgullasCollected(0);
    setHeartsCollected(0);
    setCombo(1);
    setCurrentZoneName('Twilight Meadow');
    setActiveCheckpointName('Meadow Entrance');
    setGameState('playing');
  }, []);

  // Respawn at Checkpoint on pit fall
  const respawnAtCheckpoint = useCallback(() => {
    const g = gameRef.current;
    const p = g.player;
    p.x = g.lastCheckpoint.x;
    p.y = g.lastCheckpoint.y;
    p.vx = 0;
    p.vy = 0;
    p.invulnerableTimer = 60; // 1 second invulnerability
    p.scarfNodes.forEach((node) => {
      node.x = p.x;
      node.y = p.y + 18;
    });
    playSfx('hit');

    const nextLives = g.lives - 1;
    g.lives = nextLives;
    setLives(nextLives);

    if (nextLives <= 0) {
      setGameState('lost');
    } else {
      g.floatingTexts.push({
        x: p.x + 10,
        y: p.y - 20,
        text: 'Respawned at Checkpoint! 🏮',
        color: '#F472B6',
        alpha: 1,
        vy: -1.2,
      });
    }
  }, [playSfx]);

  // Main 60 FPS AAA Physics & Canvas Rendering Engine
  useEffect(() => {
    let animationFrameId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      const g = gameRef.current;

      if (gameState === 'playing') {
        const p = g.player;

        // Determine Current Zone
        let zoneIndex = 1;
        let zoneTitle = 'Twilight Meadow';
        if (p.x >= 2150) {
          zoneIndex = 3;
          zoneTitle = 'Celestial Citadel';
        } else if (p.x >= 1050) {
          zoneIndex = 2;
          zoneTitle = 'Neon Cloudways';
        }
        if (g.currentZone !== zoneIndex) {
          g.currentZone = zoneIndex;
          setCurrentZoneName(zoneTitle);
          // Floating Zone Announcement Text
          g.floatingTexts.push({
            x: p.x + 20,
            y: 90,
            text: `✨ Entering ${zoneTitle} ✨`,
            color: zoneIndex === 3 ? '#FDE047' : zoneIndex === 2 ? '#38BDF8' : '#F472B6',
            alpha: 1.2,
            vy: -0.6,
            fontSize: 18,
          });
        }

        // Combo Multiplier Decay Timer
        if (g.comboTimer > 0) {
          g.comboTimer--;
          if (g.comboTimer === 0 && g.combo > 1) {
            g.combo = 1;
            setCombo(1);
          }
        }

        // Physics Constants
        const moveSpeed = 4.5;
        const jumpForce = -11.4;
        const gravity = 0.49;

        // Dash Mechanics
        if (p.dashCooldown > 0) p.dashCooldown--;
        if (p.invulnerableTimer > 0) p.invulnerableTimer--;

        if (keysRef.current.dash && p.dashCooldown === 0) {
          p.dashTimer = 11;
          p.dashCooldown = 55;
          playSfx('dash');

          // Dash Speed Trail & Particles
          for (let i = 0; i < 10; i++) {
            g.particles.push({
              x: p.x + p.width / 2,
              y: p.y + p.height / 2,
              vx: (Math.random() - 0.5) * 3 - (p.facing === 'right' ? 5 : -5),
              vy: (Math.random() - 0.5) * 3,
              color: ['#F472B6', '#38BDF8', '#FDE047'][Math.floor(Math.random() * 3)],
              size: Math.random() * 4 + 2,
              alpha: 1,
              life: 0,
              maxLife: 20,
            });
          }
        }

        if (p.dashTimer > 0) {
          p.dashTimer--;
          p.vx = (p.facing === 'right' ? 1 : -1) * 11.5;
          p.vy = 0;
        } else {
          // Normal horizontal movement
          if (keysRef.current.left) {
            p.vx = -moveSpeed;
            p.facing = 'left';
            p.walkFrame += 0.22;
          } else if (keysRef.current.right) {
            p.vx = moveSpeed;
            p.facing = 'right';
            p.walkFrame += 0.22;
          } else {
            p.vx *= 0.68;
            if (Math.abs(p.vx) < 0.1) p.vx = 0;
          }

          // Jump & Double Jump
          if (keysRef.current.up) {
            if (p.isGrounded) {
              p.vy = jumpForce;
              p.isGrounded = false;
              p.canDoubleJump = true;
              p.squashStretch = 1.25; // Stretch up
              playSfx('jump');

              // Jump dust puff
              for (let i = 0; i < 6; i++) {
                g.particles.push({
                  x: p.x + p.width / 2,
                  y: p.y + p.height,
                  vx: (Math.random() - 0.5) * 4,
                  vy: -Math.random() * 2,
                  color: '#FDE047',
                  size: Math.random() * 3 + 2,
                  alpha: 1,
                  life: 0,
                  maxLife: 18,
                });
              }
              keysRef.current.up = false;
            } else if (p.canDoubleJump && p.vy > -5) {
              p.vy = jumpForce * 0.92;
              p.canDoubleJump = false;
              p.squashStretch = 1.2;
              playSfx('doubleJump');

              // Double-Jump Golden Ring VFX Shockwave
              g.particles.push({
                x: p.x + p.width / 2,
                y: p.y + p.height / 2 + 5,
                vx: 0,
                vy: 0,
                color: '#FFD700',
                size: 6,
                alpha: 1,
                life: 0,
                maxLife: 20,
                shape: 'ring',
              });

              // Radiant Starburst
              for (let i = 0; i < 14; i++) {
                const angle = (i / 14) * Math.PI * 2;
                g.particles.push({
                  x: p.x + p.width / 2,
                  y: p.y + p.height / 2,
                  vx: Math.cos(angle) * 4.5,
                  vy: Math.sin(angle) * 4.5,
                  color: ['#FFD700', '#FDE047', '#FFF'][i % 3],
                  size: 3.5,
                  alpha: 1,
                  life: 0,
                  maxLife: 24,
                  shape: 'star',
                });
              }
              keysRef.current.up = false;
            }
          }

          p.vy += gravity;
        }

        // Apply Position
        p.x += p.vx;
        p.y += p.vy;

        // Squash/Stretch recovery
        p.squashStretch += (1.0 - p.squashStretch) * 0.15;

        // Scarf Trail Physics: Tail segments follow player neck with inertial lag
        const neckX = p.x + (p.facing === 'left' ? 19 : 9);
        const neckY = p.y + 18;
        p.scarfNodes[0] = { x: neckX, y: neckY };
        for (let i = 1; i < p.scarfNodes.length; i++) {
          const prev = p.scarfNodes[i - 1];
          const curr = p.scarfNodes[i];
          const dx = prev.x - curr.x;
          const dy = prev.y - curr.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const targetDist = 7;
          if (dist > targetDist) {
            curr.x += (dx / dist) * (dist - targetDist) * 0.75;
            curr.y += (dy / dist) * (dist - targetDist) * 0.75 + Math.sin(Date.now() * 0.01 + i) * 0.3;
          }
        }

        // World Left & Right Clamping
        if (p.x < 10) p.x = 10;
        if (p.x > worldWidth - 30) p.x = worldWidth - 30;

        // Update Moving Platforms
        for (const plat of g.platforms) {
          if (plat.isMoving) {
            if (plat.vx && plat.minX && plat.maxX) {
              plat.x += plat.vx;
              if (plat.x < plat.minX || plat.x > plat.maxX) {
                plat.vx = -plat.vx;
              }
            }
            if (plat.vy && plat.minY && plat.maxY) {
              plat.y += plat.vy;
              if (plat.y < plat.minY || plat.y > plat.maxY) {
                plat.vy = -plat.vy;
              }
            }
          }
        }

        // Platform Collisions
        p.isGrounded = false;
        for (const plat of g.platforms) {
          if (
            p.x + p.width - 6 > plat.x &&
            p.x + 6 < plat.x + plat.width &&
            p.y + p.height >= plat.y &&
            p.y + p.height <= plat.y + 18 &&
            p.vy >= 0
          ) {
            p.y = plat.y - p.height;
            p.vy = 0;
            if (!p.isGrounded) {
              p.squashStretch = 0.88; // Landing squash
            }
            p.isGrounded = true;
            p.canDoubleJump = true;

            // Carry player with moving platform
            if (plat.isMoving && plat.vx) {
              p.x += plat.vx;
            }
            break;
          }
        }

        // Trampoline / Spring Pad Collision
        for (const pad of g.bouncePads) {
          if (pad.springAnimation > 0) {
            pad.springAnimation -= 0.1;
            if (pad.springAnimation < 0) pad.springAnimation = 0;
          }

          if (
            p.x + p.width - 4 > pad.x &&
            p.x + 4 < pad.x + pad.width &&
            p.y + p.height >= pad.y &&
            p.y + p.height <= pad.y + 18 &&
            p.vy >= 0
          ) {
            p.vy = pad.bounceForce;
            p.isGrounded = false;
            p.canDoubleJump = true;
            p.squashStretch = 1.35;
            pad.springAnimation = 1.0;
            playSfx('bounce');

            // Trampoline shockwave ring
            g.particles.push({
              x: pad.x + pad.width / 2,
              y: pad.y,
              vx: 0,
              vy: 0,
              color: '#EC4899',
              size: 5,
              alpha: 1,
              life: 0,
              maxLife: 22,
              shape: 'ring',
            });

            // Sparkle burst
            for (let i = 0; i < 15; i++) {
              g.particles.push({
                x: pad.x + pad.width / 2,
                y: pad.y,
                vx: (Math.random() - 0.5) * 7,
                vy: -Math.random() * 6 - 3,
                color: ['#EC4899', '#F472B6', '#FDE047'][i % 3],
                size: Math.random() * 4 + 2,
                alpha: 1,
                life: 0,
                maxLife: 26,
                shape: 'star',
              });
            }
            break;
          }
        }

        // Checkpoints Collision (🏮 Heart Lantern Shrines)
        for (const cp of g.checkpoints) {
          cp.glowPhase += 0.05;
          if (!cp.activated) {
            const dx = p.x + p.width / 2 - cp.x;
            const dy = p.y + p.height / 2 - cp.y;
            if (Math.sqrt(dx * dx + dy * dy) < 42) {
              cp.activated = true;
              g.lastCheckpoint = {
                x: cp.spawnX,
                y: cp.spawnY,
                name: cp.name,
              };
              setActiveCheckpointName(cp.name);
              playSfx('checkpoint');

              // Checkpoint celebration particles
              for (let i = 0; i < 20; i++) {
                const angle = (i / 20) * Math.PI * 2;
                g.particles.push({
                  x: cp.x,
                  y: cp.y,
                  vx: Math.cos(angle) * (3 + Math.random() * 2),
                  vy: Math.sin(angle) * (3 + Math.random() * 2),
                  color: ['#F472B6', '#FFD700', '#38BDF8'][i % 3],
                  size: 4,
                  alpha: 1,
                  life: 0,
                  maxLife: 30,
                  shape: 'heart',
                });
              }

              g.floatingTexts.push({
                x: cp.x,
                y: cp.y - 25,
                text: 'CHECKPOINT ACTIVATED! 🏮💖',
                color: '#F472B6',
                alpha: 1,
                vy: -1.3,
                fontSize: 15,
              });
            }
          }
        }

        // Falling Into Void Check
        if (p.y > worldHeight + 40) {
          respawnAtCheckpoint();
        }

        // Enemy Cats: Patrolling & Safe Collision (Speed 0.6 - 0.8 with cute AI)
        for (const obs of g.obstacles) {
          obs.x += obs.speed;
          obs.walkFrame += 0.12;

          if (obs.x < obs.minX) {
            obs.x = obs.minX;
            obs.speed = Math.abs(obs.speed);
            obs.facing = 'right';
          } else if (obs.x > obs.maxX) {
            obs.x = obs.maxX;
            obs.speed = -Math.abs(obs.speed);
            obs.facing = 'left';
          }

          // AABB Hitbox with friendly margins
          if (
            p.invulnerableTimer === 0 &&
            p.x + p.width - 7 > obs.x &&
            p.x + 7 < obs.x + obs.width &&
            p.y + p.height - 7 > obs.y &&
            p.y + 7 < obs.y + obs.height
          ) {
            playSfx('hit');
            p.vy = -7.5;
            p.vx = obs.speed > 0 ? 5.5 : -5.5;
            p.invulnerableTimer = 65; // Invulnerability frames

            const nextLives = g.lives - 1;
            g.lives = nextLives;
            setLives(nextLives);

            // Broken heart particle
            g.particles.push({
              x: p.x + p.width / 2,
              y: p.y + p.height / 2,
              vx: 0,
              vy: -2,
              color: '#EF4444',
              size: 8,
              alpha: 1,
              life: 0,
              maxLife: 25,
              shape: 'heart',
            });

            if (nextLives <= 0) {
              setGameState('lost');
            }
          }
        }

        // Collectibles Collision
        for (const col of g.collectibles) {
          if (!col.collected) {
            const dx = p.x + p.width / 2 - col.x;
            const dy = p.y + p.height / 2 - col.y;
            if (Math.sqrt(dx * dx + dy * dy) < 32) {
              col.collected = true;
              playSfx('collect');

              // Sparkle Burst
              for (let i = 0; i < 12; i++) {
                g.particles.push({
                  x: col.x,
                  y: col.y,
                  vx: (Math.random() - 0.5) * 5,
                  vy: (Math.random() - 0.5) * 5,
                  color: col.type === 'rasgulla' ? '#FBBF24' : col.type === 'heart' ? '#EC4899' : '#38BDF8',
                  size: Math.random() * 4 + 2,
                  alpha: 1,
                  life: 0,
                  maxLife: 24,
                  shape: col.type === 'heart' ? 'heart' : 'star',
                });
              }

              g.comboTimer = 180; // 3 seconds to keep combo chain alive

              if (col.type === 'rasgulla') {
                const pts = 50 * g.combo;
                g.score += pts;
                g.rasgullas += 1;
                setRasgullasCollected(g.rasgullas);
                g.floatingTexts.push({
                  x: col.x,
                  y: col.y - 12,
                  text: `+${pts} 🍯!`,
                  color: '#FBBF24',
                  alpha: 1,
                  vy: -1.2,
                });
              } else if (col.type === 'heart') {
                g.combo += 1;
                setCombo(g.combo);
                const pts = 100 * g.combo;
                g.score += pts;
                g.hearts += 1;
                setHeartsCollected(g.hearts);
                g.floatingTexts.push({
                  x: col.x,
                  y: col.y - 12,
                  text: `+${pts} 💖 (x${g.combo})!`,
                  color: '#EC4899',
                  alpha: 1,
                  vy: -1.4,
                });
              } else if (col.type === 'star') {
                const pts = 150 * g.combo;
                g.score += pts;
                g.floatingTexts.push({
                  x: col.x,
                  y: col.y - 12,
                  text: `+${pts} ⭐ STAR BONUS!`,
                  color: '#38BDF8',
                  alpha: 1,
                  vy: -1.5,
                });
              }
              setScore(g.score);
            }
          }
        }

        // Goal Check (Reach Celestial Citadel & Boyfriend 💐)
        const goal = g.goal;
        if (
          p.x + p.width > goal.x &&
          p.x < goal.x + goal.width &&
          p.y + p.height > goal.y &&
          p.y < goal.y + goal.height
        ) {
          playSfx('win');
          setGameState('won');
        }

        // Smooth Lerping AAA Camera
        const targetCamX = p.x - canvas.width * 0.36;
        g.cameraX += (Math.max(0, Math.min(targetCamX, worldWidth - canvas.width)) - g.cameraX) * 0.12;

        // Update Drifting Clouds
        for (const cl of g.clouds) {
          cl.x += cl.speed;
          if (cl.x > worldWidth + 100) cl.x = -cl.width;
        }

        // Update Falling Sakura Petals
        for (const sk of g.sakura) {
          sk.swayPhase += sk.swaySpeed;
          sk.angle += sk.spinSpeed;
          sk.x += sk.vx + Math.sin(sk.swayPhase) * 0.8;
          sk.y += sk.vy;
          if (sk.y > worldHeight + 20) {
            sk.y = -20;
            sk.x = Math.random() * worldWidth;
          }
          if (sk.x > worldWidth + 20) {
            sk.x = -20;
          }
        }

        // Update Particles
        g.particles = g.particles.filter((pt) => {
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life++;
          pt.alpha = 1 - pt.life / pt.maxLife;
          if (pt.shape === 'ring') {
            pt.size += 1.8;
          }
          return pt.life < pt.maxLife;
        });

        // Update Floating Text
        g.floatingTexts = g.floatingTexts.filter((ft) => {
          ft.y += ft.vy;
          ft.alpha -= 0.025;
          return ft.alpha > 0;
        });
      }

      // ─────────────────────────────────────────────────────────────
      // ── AAA CANVAS RENDERING PIPELINE WITH FULL GRAPHICS STACK ──
      // ─────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      const camX = g.cameraX;

      // 1. DYNAMIC ZONE SKY GRADIENT (Smooth transition based on Camera X)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (camX < 1050) {
        // Zone 1: Twilight Meadow Sky
        skyGrad.addColorStop(0, '#060B24');
        skyGrad.addColorStop(0.4, '#1B0C3B');
        skyGrad.addColorStop(0.8, '#4A0E4E');
        skyGrad.addColorStop(1, '#831843');
      } else if (camX < 2150) {
        // Zone 2: Neon Cloudways Sky
        skyGrad.addColorStop(0, '#0B0F2F');
        skyGrad.addColorStop(0.4, '#240F47');
        skyGrad.addColorStop(0.7, '#67185D');
        skyGrad.addColorStop(1, '#1E293B');
      } else {
        // Zone 3: Celestial Citadel Starry Sky
        skyGrad.addColorStop(0, '#03071E');
        skyGrad.addColorStop(0.3, '#141432');
        skyGrad.addColorStop(0.7, '#2F134A');
        skyGrad.addColorStop(1, '#5B21B6');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. TWINKLING MULTI-COLORED STARFIELD (Parallax Speed 0.05)
      for (const st of g.stars) {
        const sx = (st.x - camX * 0.05 + worldWidth) % worldWidth;
        if (sx >= -10 && sx <= canvas.width + 10) {
          const twinkle = 0.4 + 0.6 * Math.sin(Date.now() * st.twinkleSpeed + st.phase);
          ctx.fillStyle = st.color;
          ctx.globalAlpha = twinkle;
          ctx.beginPath();
          ctx.arc(sx, st.y, st.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0;

      // 3. PARALLAX DISTANT MOUNTAIN SILHOUETTES (Layer 1 - Speed 0.15)
      ctx.fillStyle = 'rgba(49, 16, 82, 0.4)';
      for (let i = 0; i < 14; i++) {
        const mx = i * 280 - (camX * 0.15) % 280;
        ctx.beginPath();
        ctx.moveTo(mx - 20, canvas.height);
        ctx.lineTo(mx + 140, 160 + (i % 3) * 20);
        ctx.lineTo(mx + 300, canvas.height);
        ctx.fill();
      }

      // 4. PARALLAX MIDGROUND NEON HILLS / CITADEL SPIRES (Layer 2 - Speed 0.3)
      ctx.fillStyle = 'rgba(157, 23, 77, 0.28)';
      for (let i = 0; i < 12; i++) {
        const mx = i * 320 - (camX * 0.3) % 320;
        ctx.beginPath();
        ctx.moveTo(mx, canvas.height);
        ctx.lineTo(mx + 160, 210 + (i % 2) * 25);
        ctx.lineTo(mx + 320, canvas.height);
        ctx.fill();
      }

      // 5. VOLUMETRIC GOD RAYS (Celestial Shimmering Light Beams)
      ctx.save();
      const rayGlow = 0.08 + Math.sin(Date.now() * 0.002) * 0.03;
      const rayGrad = ctx.createLinearGradient(0, 0, canvas.width * 0.8, canvas.height);
      rayGrad.addColorStop(0, `rgba(253, 224, 71, ${rayGlow * 1.5})`);
      rayGrad.addColorStop(0.5, `rgba(244, 114, 182, ${rayGlow})`);
      rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rayGrad;
      for (let i = 0; i < 4; i++) {
        const rayX = (i * 220 - camX * 0.18 + worldWidth) % (canvas.width + 400) - 200;
        ctx.beginPath();
        ctx.moveTo(rayX, 0);
        ctx.lineTo(rayX + 90, 0);
        ctx.lineTo(rayX + 220, canvas.height);
        ctx.lineTo(rayX + 110, canvas.height);
        ctx.fill();
      }
      ctx.restore();

      // 6. DRIFTING FLUFFY PARALLAX CLOUDS
      for (const cl of g.clouds) {
        const cx = cl.x - camX * (cl.layer === 1 ? 0.25 : 0.45);
        if (cx > -200 && cx < canvas.width + 200) {
          ctx.fillStyle = cl.layer === 1 ? 'rgba(255, 255, 255, 0.18)' : 'rgba(244, 114, 182, 0.22)';
          ctx.beginPath();
          ctx.arc(cx + 40, cl.y + 20, 25, 0, Math.PI * 2);
          ctx.arc(cx + 75, cl.y + 15, 32, 0, Math.PI * 2);
          ctx.arc(cx + 115, cl.y + 22, 26, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ──────────────────────────────────────────
      // ── WORLD SPACE RENDERING (Camera Offset) ─
      // ──────────────────────────────────────────
      ctx.translate(-camX, 0);

      // 7. FALLING SAKURA BLOSSOM PETALS (Background/Midground)
      for (const sk of g.sakura) {
        if (sk.x >= camX - 30 && sk.x <= camX + canvas.width + 30) {
          ctx.save();
          ctx.translate(sk.x, sk.y);
          ctx.rotate(sk.angle);
          ctx.fillStyle = '#FBCFE8';
          ctx.globalAlpha = sk.alpha;
          ctx.beginPath();
          ctx.ellipse(0, 0, sk.size, sk.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      ctx.globalAlpha = 1.0;

      // 8. PLATFORMS RENDERING (Zone-Themed: Mossy Twilight / Cyber Neon Glass / Golden Citadel)
      for (const plat of g.platforms) {
        if (plat.x + plat.width >= camX - 20 && plat.x <= camX + canvas.width + 20) {
          if (plat.zone === 1) {
            // Twilight Meadow: Mossy Stone Islands with Floral Edge
            const platGrad = ctx.createLinearGradient(plat.x, plat.y, plat.x, plat.y + plat.height);
            platGrad.addColorStop(0, '#2E1065');
            platGrad.addColorStop(1, '#1E1B4B');
            ctx.fillStyle = platGrad;
            ctx.strokeStyle = '#A855F7';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect ? ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 8) : ctx.rect(plat.x, plat.y, plat.width, plat.height);
            ctx.fill();
            ctx.stroke();

            // Lush Bioluminescent Moss Top
            ctx.fillStyle = '#10B981';
            ctx.fillRect(plat.x + 3, plat.y, plat.width - 6, 4);
            // Glowing Little Flowers
            for (let fx = plat.x + 12; fx < plat.x + plat.width - 10; fx += 24) {
              ctx.fillStyle = '#F472B6';
              ctx.beginPath();
              ctx.arc(fx, plat.y - 1, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          } else if (plat.zone === 2) {
            // Neon Cloudways: Translucent Cyber Glass with Pulsing Edge
            const platGrad = ctx.createLinearGradient(plat.x, plat.y, plat.x, plat.y + plat.height);
            platGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
            platGrad.addColorStop(1, 'rgba(236, 72, 153, 0.25)');
            ctx.fillStyle = platGrad;
            ctx.strokeStyle = '#38BDF8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect ? ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 8) : ctx.rect(plat.x, plat.y, plat.width, plat.height);
            ctx.fill();
            ctx.stroke();

            // Electric Cyan Top Glow
            ctx.shadowColor = '#38BDF8';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#E0F2FE';
            ctx.fillRect(plat.x + 4, plat.y, plat.width - 8, 3);
            ctx.shadowBlur = 0;
          } else {
            // Celestial Citadel: Gilded Marble & Crystal
            const platGrad = ctx.createLinearGradient(plat.x, plat.y, plat.x, plat.y + plat.height);
            platGrad.addColorStop(0, '#F59E0B');
            platGrad.addColorStop(1, '#78350F');
            ctx.fillStyle = platGrad;
            ctx.strokeStyle = '#FDE047';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect ? ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 8) : ctx.rect(plat.x, plat.y, plat.width, plat.height);
            ctx.fill();
            ctx.stroke();

            // Gold Trim Glow
            ctx.shadowColor = '#FDE047';
            ctx.shadowBlur = 12;
            ctx.fillStyle = '#FEF08A';
            ctx.fillRect(plat.x + 4, plat.y, plat.width - 8, 3.5);
            ctx.shadowBlur = 0;
          }
        }
      }

      // 9. CHECKPOINTS: GLOWING HEART LANTERN SHRINES (🏮)
      for (const cp of g.checkpoints) {
        if (cp.x >= camX - 60 && cp.x <= camX + canvas.width + 60) {
          const pulse = Math.sin(cp.glowPhase) * 3;

          // Lantern Base Post
          ctx.fillStyle = '#374151';
          ctx.fillRect(cp.x - 3, cp.y + 12, 6, 24);

          // Pagoda Roof
          ctx.fillStyle = cp.activated ? '#F59E0B' : '#9CA3AF';
          ctx.beginPath();
          ctx.moveTo(cp.x - 16, cp.y - 4);
          ctx.lineTo(cp.x, cp.y - 16);
          ctx.lineTo(cp.x + 16, cp.y - 4);
          ctx.closePath();
          ctx.fill();

          // Glowing Lantern Core
          ctx.shadowColor = cp.activated ? '#EC4899' : '#FBBF24';
          ctx.shadowBlur = cp.activated ? 20 : 8;
          ctx.fillStyle = cp.activated ? '#FDF2F8' : '#FEF3C7';
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(cp.x - 10, cp.y - 4, 20, 18, 4) : ctx.rect(cp.x - 10, cp.y - 4, 20, 18);
          ctx.fill();

          // Heart Symbol inside Lantern
          ctx.font = '14px serif';
          ctx.textAlign = 'center';
          ctx.fillText(cp.activated ? '💖' : '🏮', cp.x, cp.y + 10 + pulse * 0.3);
          ctx.shadowBlur = 0;

          // Checkpoint Name Banner
          ctx.fillStyle = cp.activated ? '#F472B6' : '#9CA3AF';
          ctx.font = 'bold 10px sans-serif';
          ctx.fillText(cp.activated ? 'SAVED 🏮' : 'CHECKPOINT', cp.x, cp.y - 20);
        }
      }

      // 10. TRAMPOLINE SUPER BOUNCE PADS (⬆⚡)
      for (const pad of g.bouncePads) {
        if (pad.x + pad.width >= camX - 20 && pad.x <= camX + canvas.width + 20) {
          const squish = pad.springAnimation * 6;
          ctx.shadowColor = '#EC4899';
          ctx.shadowBlur = 12;
          ctx.fillStyle = '#EC4899';
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(pad.x, pad.y + squish, pad.width, pad.height - squish, 6) : ctx.rect(pad.x, pad.y, pad.width, pad.height);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Bouncy Spring Chevron Symbol
          ctx.fillStyle = '#FFF';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⬆⚡', pad.x + pad.width / 2, pad.y + 9 + squish);
        }
      }

      // 11. COLLECTIBLES (Rasgullas 🍯, Love Hearts 💖, Stars ⭐)
      for (const col of g.collectibles) {
        if (!col.collected && col.x >= camX - 30 && col.x <= camX + canvas.width + 30) {
          const pulseOffset = Math.sin(Date.now() * 0.007 + col.pulse) * 5;
          const cy = col.y + pulseOffset;

          if (col.type === 'rasgulla') {
            // Sweet Rasgulla: Glistening Milk-Sweet with Syrup
            ctx.shadowColor = '#FBBF24';
            ctx.shadowBlur = 14;
            ctx.fillStyle = '#FFFBEB';
            ctx.beginPath();
            ctx.arc(col.x, cy, 11, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Golden Honey Syrup Glaze
            ctx.fillStyle = '#F59E0B';
            ctx.beginPath();
            ctx.arc(col.x - 3, cy - 3, 3.5, 0, Math.PI * 2);
            ctx.fill();
          } else if (col.type === 'heart') {
            // Radiant Love Gem
            ctx.shadowColor = '#EC4899';
            ctx.shadowBlur = 16;
            ctx.font = '22px serif';
            ctx.textAlign = 'center';
            ctx.fillText('💖', col.x, cy + 8);
            ctx.shadowBlur = 0;
          } else {
            // Celestial Star Candy
            ctx.shadowColor = '#38BDF8';
            ctx.shadowBlur = 15;
            ctx.font = '20px serif';
            ctx.textAlign = 'center';
            ctx.fillText('⭐', col.x, cy + 7);
            ctx.shadowBlur = 0;
          }
        }
      }

      // 12. ENEMY MEME CATS (Cute, Animated, Zone-specific: Calico, Cyber, Angel)
      for (const obs of g.obstacles) {
        if (obs.x + obs.width >= camX - 40 && obs.x <= camX + canvas.width + 40) {
          const ox = obs.x;
          const oy = obs.y;
          const isLeft = obs.facing === 'left';
          const legBob = Math.sin(obs.walkFrame * 2) * 2;
          const tailWag = Math.sin(obs.walkFrame * 3) * 0.4;

          ctx.save();
          ctx.translate(ox + 14, oy + 12);
          if (isLeft) ctx.scale(-1, 1);

          // Wagging Tail
          ctx.strokeStyle = obs.type === 'calico' ? '#FB923C' : obs.type === 'cyber' ? '#C084FC' : '#F3F4F6';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(-10, 2);
          ctx.quadraticCurveTo(-18, -6 + tailWag * 10, -22, -2);
          ctx.stroke();

          // Cat Body
          ctx.fillStyle = obs.type === 'calico' ? '#FB923C' : obs.type === 'cyber' ? '#C084FC' : '#F9FAFB';
          ctx.beginPath();
          ctx.ellipse(0, 0, 12, 10, 0, 0, Math.PI * 2);
          ctx.fill();

          // Pointy Ears
          ctx.fillStyle = obs.type === 'calico' ? '#EA580C' : obs.type === 'cyber' ? '#9333EA' : '#E5E7EB';
          ctx.beginPath();
          ctx.moveTo(-7, -8);
          ctx.lineTo(-12, -18);
          ctx.lineTo(-2, -10);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(2, -10);
          ctx.lineTo(8, -18);
          ctx.lineTo(11, -8);
          ctx.fill();

          // Cute Angel Halo for Celestial Zone Cats
          if (obs.type === 'angel') {
            ctx.strokeStyle = '#FDE047';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(0, -20, 8, 3, 0, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Cyber Glowing Bell Collar
          if (obs.type === 'cyber') {
            ctx.fillStyle = '#06B6D4';
            ctx.beginPath();
            ctx.arc(6, 4, 3, 0, Math.PI * 2);
            ctx.fill();
          }

          // Cute Playful Face (Eyes & Whiskers)
          ctx.fillStyle = '#111827';
          ctx.beginPath();
          ctx.arc(4, -2, 2.2, 0, Math.PI * 2);
          ctx.arc(9, -2, 2.2, 0, Math.PI * 2);
          ctx.fill();

          // Eye glints
          ctx.fillStyle = '#FFF';
          ctx.beginPath();
          ctx.arc(4.6, -2.6, 0.8, 0, Math.PI * 2);
          ctx.arc(9.6, -2.6, 0.8, 0, Math.PI * 2);
          ctx.fill();

          // Whiskers
          ctx.strokeStyle = '#374151';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(10, 0);
          ctx.lineTo(16, -2);
          ctx.moveTo(10, 2);
          ctx.lineTo(16, 4);
          ctx.stroke();

          // Cute Little Paws
          ctx.fillStyle = '#FED7AA';
          ctx.fillRect(-6 + legBob, 8, 4, 5);
          ctx.fillRect(4 - legBob, 8, 4, 5);

          ctx.restore();
        }
      }

      // 13. CLIMAX: CELESTIAL CITADEL & BOYFRIEND SPRITE 💐
      const goal = g.goal;
      const gx = goal.x;
      const gy = goal.y;
      if (gx >= camX - 100 && gx <= camX + canvas.width + 100) {
        // Celestial Gazebo & Pedestal
        ctx.fillStyle = 'rgba(236, 72, 153, 0.35)';
        ctx.strokeStyle = '#F472B6';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(gx - 20, gy + 45, 75, 18, 6) : ctx.rect(gx - 20, gy + 45, 75, 18);
        ctx.fill();
        ctx.stroke();

        // Boyfriend Sprite (Smart Blue Shirt & Dark Hair)
        ctx.fillStyle = '#2563EB';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(gx + 6, gy + 18, 22, 26, 5) : ctx.rect(gx + 6, gy + 18, 22, 26);
        ctx.fill();

        // Head & Hair
        ctx.fillStyle = '#FFE4C4';
        ctx.beginPath();
        ctx.arc(gx + 17, gy + 11, 9.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1F2937';
        ctx.beginPath();
        ctx.arc(gx + 17, gy + 8, 9.5, Math.PI, Math.PI * 2);
        ctx.fill();

        // Animated Waving Flowers 💐 & Swirling Hearts
        const flowerBob = Math.sin(Date.now() * 0.005) * 4;
        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        ctx.fillText('💐', gx + 26, gy + 24 + flowerBob);
        ctx.font = '20px serif';
        ctx.fillText('💖', gx + 17, gy - 8 + flowerBob);

        ctx.fillStyle = '#FDE047';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Barsana! My Arms Are Open! 💕', gx + 17, gy - 24);
      }

      // 14. PLAYER CHARACTER: BARSANA MUKHOPADHYAY
      const p = g.player;
      const px = p.x;
      const py = p.y;
      const isLeft = p.facing === 'left';
      const legBob = Math.sin(p.walkFrame * 2) * 4;

      // Invulnerability Blinking Effect
      if (p.invulnerableTimer === 0 || p.invulnerableTimer % 6 < 3) {
        ctx.save();
        ctx.translate(px + p.width / 2, py + p.height);
        ctx.scale(isLeft ? -1 : 1, p.squashStretch);
        ctx.translate(-p.width / 2, -p.height);

        // A. Dynamic 4-Node Scarf Trail Physics
        ctx.strokeStyle = '#F43F5E';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.width / 2, 20);
        ctx.lineTo(p.width / 2 - 14, 24 + Math.sin(Date.now() * 0.015) * 3);
        ctx.lineTo(p.width / 2 - 24, 26 + Math.sin(Date.now() * 0.015 + 1) * 4);
        ctx.stroke();

        // B. Blue Denim Pants & Shoes
        ctx.fillStyle = '#2563EB';
        ctx.fillRect(6 + legBob, 32, 6, 16);
        ctx.fillRect(16 - legBob, 32, 6, 16);

        // White Sneakers
        ctx.fillStyle = '#F9FAFB';
        ctx.fillRect(6 + legBob, 44, 7, 4);
        ctx.fillRect(16 - legBob, 44, 7, 4);

        // C. Stylish Crimson Red Top
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(4, 16, 20, 18, 5) : ctx.rect(4, 16, 20, 18);
        ctx.fill();

        // D. Head & Warm Skin Tone
        ctx.fillStyle = '#FFE4C4';
        ctx.beginPath();
        ctx.arc(14, 10, 9, 0, Math.PI * 2);
        ctx.fill();

        // E. Flowing Dark Hair with High Ponytail
        ctx.fillStyle = '#1F2937';
        ctx.beginPath();
        ctx.arc(14, 7, 9, Math.PI, Math.PI * 2);
        ctx.fill();

        // Cute Bouncing Ponytail
        const ponytailSway = Math.sin(Date.now() * 0.01 + p.walkFrame) * 3;
        ctx.beginPath();
        ctx.arc(3, 7 + ponytailSway, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // F. Chic Glasses (Black Frames + Lens Shine)
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(10, 7, 5, 5);
        ctx.strokeRect(16, 7, 5, 5);
        ctx.beginPath();
        ctx.moveTo(15, 9.5);
        ctx.lineTo(16, 9.5);
        ctx.stroke();

        // Lens Glint
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(11, 8, 2, 2);

        // G. Cheerful Smile & Blush
        ctx.strokeStyle = '#E11D48';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(14, 12, 2.5, 0, Math.PI);
        ctx.stroke();

        // Rosy Cheeks
        ctx.fillStyle = 'rgba(244, 114, 182, 0.5)';
        ctx.beginPath();
        ctx.arc(9, 12, 1.8, 0, Math.PI * 2);
        ctx.arc(19, 12, 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 15. PARTICLE VFX (Golden Rings, Starbursts, Hearts, Sparkles)
      for (const pt of g.particles) {
        ctx.fillStyle = pt.color;
        ctx.strokeStyle = pt.color;
        ctx.globalAlpha = pt.alpha;

        if (pt.shape === 'ring') {
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.stroke();
        } else if (pt.shape === 'heart') {
          ctx.font = `${Math.floor(pt.size * 2.5)}px serif`;
          ctx.textAlign = 'center';
          ctx.fillText('💖', pt.x, pt.y);
        } else {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
      }

      // 16. FLOATING SCORE & ZONE POPUPS
      for (const ft of g.floatingTexts) {
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = ft.alpha;
        ctx.font = `bold ${ft.fontSize || 13}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.globalAlpha = 1.0;
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, playSfx, respawnAtCheckpoint]);

  // Keyboard Event Listeners for Desktop (WASD / Arrows / Space / Shift / J / K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = true;
      if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') keysRef.current.up = true;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyJ' || e.code === 'KeyK') keysRef.current.dash = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = false;
      if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') keysRef.current.up = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyJ' || e.code === 'KeyK') keysRef.current.dash = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <section
      id="mini-game"
      className="min-h-screen w-full flex flex-col items-center justify-center text-center px-3 py-20 relative z-10"
    >
      {/* Title & Badge */}
      <div className="text-center mb-6 max-w-xl">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-pink-500/25 border border-pink-400/40 text-pink-300 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 shadow-lg">
          <span>🎮</span>
          <span>AAA 2D Arcade Platformer</span>
          <span>🎮</span>
        </div>
        <h2 className="font-luxury font-bold text-4xl sm:text-6xl md:text-7xl gradient-text glow-text">
          Reach Your Boyfriend!
        </h2>
        <p className="text-pink-100/90 text-xs sm:text-sm md:text-base mt-2 font-normal">
          Guide Barsana across 3,200px of celestial lands, double-jump, dash past curious cats, bounce on trampolines, and reach his arms! 💐
        </p>
      </div>

      {/* Game Container */}
      <div className="glass-card p-3 sm:p-5 max-w-3xl w-full flex flex-col items-center relative shadow-2xl border border-pink-300/40">
        {/* Game AAA HUD Bar */}
        <div className="w-full flex items-center justify-between px-3 py-2.5 bg-black/60 rounded-xl mb-3 border border-white/15 text-xs sm:text-sm font-bold backdrop-blur-md">
          {/* Health Lives */}
          <div className="flex items-center gap-1.5">
            <span className="text-pink-300 mr-1">Lives:</span>
            {[...Array(3)].map((_, i) => (
              <span key={i} className={`text-base transition-transform ${i < lives ? 'scale-110' : 'opacity-25 grayscale'}`}>
                💖
              </span>
            ))}
          </div>

          {/* Current Zone Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-amber-200">
            <span>📍</span>
            <span>{currentZoneName}</span>
          </div>

          {/* Treats & Score */}
          <div className="flex items-center gap-3">
            <span className="text-amber-300 flex items-center gap-1">
              🍯 {rasgullasCollected}/6
            </span>
            <span className="text-rose-300 flex items-center gap-1">
              💖 {heartsCollected}/5
            </span>
            {combo > 1 && (
              <span className="text-orange-400 font-extrabold animate-pulse">
                🔥 x{combo}
              </span>
            )}
            <span className="text-yellow-300 font-extrabold ml-1">
              ⭐ {score}
            </span>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="relative w-full aspect-[16/9] max-h-[380px] rounded-xl overflow-hidden border-2 border-pink-400/60 shadow-2xl bg-love-sapphire">
          <canvas
            ref={canvasRef}
            width={720}
            height={400}
            className="w-full h-full object-cover block"
          />

          {/* Start Screen Overlay */}
          {gameState === 'start' && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4">
              <span className="text-4xl mb-2 animate-bounce">🏃‍♀️💨 💕 💑</span>
              <h3 className="font-luxury font-bold text-2xl sm:text-4xl text-amber-200 mb-2">
                Help Barsana Reach Him! 🎮
              </h3>
              <p className="text-white/85 text-xs sm:text-sm max-w-md mb-5 text-center leading-relaxed">
                Journey through <span className="text-pink-300 font-bold">Twilight Meadow</span>, <span className="text-sky-300 font-bold">Neon Cloudways</span>, and the <span className="text-yellow-300 font-bold">Celestial Citadel</span>! Double-jump, use the ⚡ DASH boost, bounce high on trampolines, and light the heart lanterns!
              </p>
              <button
                onClick={resetGame}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold text-sm shadow-2xl active:scale-95 transition-transform cursor-pointer border border-white/40"
              >
                🎮 START ADVENTURE 🚀
              </button>
            </div>
          )}

          {/* Win Screen Overlay */}
          {gameState === 'won' && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-lg flex flex-col items-center justify-center p-4 animate-fade-in">
              <span className="text-5xl mb-2 animate-bounce">🎉💐💕</span>
              <h3 className="font-luxury font-bold text-2xl sm:text-4xl gradient-gold glow-gold mb-1 text-center">
                MISSION ACCOMPLISHED! ⭐⭐⭐
              </h3>
              <p className="text-pink-100 text-xs sm:text-sm max-w-md text-center mb-3 leading-relaxed">
                &ldquo;No matter the obstacles, distances, or playful cats in the universe, you will always find your safest home in my arms! I love you forever Barsana!&rdquo; 🍯💖
              </p>
              <div className="text-amber-300 font-bold text-sm mb-4">
                Final Score: {score} pts • Rasgullas: {rasgullasCollected} • Hearts: {heartsCollected}
              </div>
              <button
                onClick={resetGame}
                className="px-8 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm shadow-xl active:scale-95 transition-transform border border-white/30"
              >
                🔄 Play Again
              </button>
            </div>
          )}

          {/* Lost Screen Overlay */}
          {gameState === 'lost' && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4">
              <span className="text-4xl mb-1">😿💔</span>
              <h3 className="font-luxury font-bold text-2xl sm:text-3xl text-pink-300 mb-1">
                Almost Made It!
              </h3>
              <p className="text-white/80 text-xs sm:text-sm mb-4 text-center max-w-xs">
                Don&apos;t worry my Rasgulla, my arms are always open for you! Give it another jump! 💕
              </p>
              <button
                onClick={resetGame}
                className="px-8 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-xl active:scale-95 transition-transform border border-white/30"
              >
                🔁 Try Again
              </button>
            </div>
          )}
        </div>

        {/* On-Screen AAA Mobile Controls (D-Pad Left/Right + Dash + Jump with touch-action: none) */}
        <div
          className="w-full flex items-center justify-between px-3 pt-4 pb-1 select-none"
          style={{ touchAction: 'none' }}
        >
          {/* Direction Buttons [◀] [▶] */}
          <div className="flex items-center gap-2.5">
            <button
              onTouchStart={(e) => { e.preventDefault(); keysRef.current.left = true; }}
              onTouchEnd={(e) => { e.preventDefault(); keysRef.current.left = false; }}
              onMouseDown={() => (keysRef.current.left = true)}
              onMouseUp={() => (keysRef.current.left = false)}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/15 active:bg-pink-500/60 border border-white/30 flex items-center justify-center text-xl sm:text-2xl text-white shadow-xl active:scale-90 transition-transform cursor-pointer select-none"
              style={{ touchAction: 'none' }}
              aria-label="Move Left"
            >
              ◀
            </button>
            <button
              onTouchStart={(e) => { e.preventDefault(); keysRef.current.right = true; }}
              onTouchEnd={(e) => { e.preventDefault(); keysRef.current.right = false; }}
              onMouseDown={() => (keysRef.current.right = true)}
              onMouseUp={() => (keysRef.current.right = false)}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/15 active:bg-pink-500/60 border border-white/30 flex items-center justify-center text-xl sm:text-2xl text-white shadow-xl active:scale-90 transition-transform cursor-pointer select-none"
              style={{ touchAction: 'none' }}
              aria-label="Move Right"
            >
              ▶
            </button>
          </div>

          {/* Action Buttons: [⚡ DASH] + [⬆ JUMP] */}
          <div className="flex items-center gap-3">
            {/* Dash Button */}
            <button
              onTouchStart={(e) => { e.preventDefault(); keysRef.current.dash = true; }}
              onTouchEnd={(e) => { e.preventDefault(); keysRef.current.dash = false; }}
              onMouseDown={() => (keysRef.current.dash = true)}
              onMouseUp={() => (keysRef.current.dash = false)}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 border border-amber-300/50 flex flex-col items-center justify-center text-white shadow-xl active:scale-90 transition-transform cursor-pointer select-none"
              style={{ touchAction: 'none' }}
              aria-label="Dash Boost"
            >
              <span className="text-base leading-none">⚡</span>
              <span className="text-[9px] font-extrabold tracking-wider">DASH</span>
            </button>

            {/* Jump Button */}
            <button
              onTouchStart={(e) => { e.preventDefault(); keysRef.current.up = true; }}
              onTouchEnd={(e) => { e.preventDefault(); keysRef.current.up = false; }}
              onMouseDown={() => (keysRef.current.up = true)}
              onMouseUp={() => (keysRef.current.up = false)}
              className="w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 active:from-pink-600 active:to-rose-600 border-2 border-white/50 flex flex-col items-center justify-center text-white shadow-2xl active:scale-90 transition-transform cursor-pointer select-none"
              style={{ touchAction: 'none' }}
              aria-label="Jump Button"
            >
              <span className="text-lg leading-none">⬆</span>
              <span className="text-[10px] font-extrabold tracking-wider uppercase">JUMP</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
