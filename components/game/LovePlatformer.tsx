'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Collectible {
  x: number;
  y: number;
  type: 'rasgulla' | 'heart';
  collected: boolean;
  pulse: number;
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
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  isMoving?: boolean;
  vx?: number;
  minX?: number;
  maxX?: number;
}

interface BouncePad {
  x: number;
  y: number;
  width: number;
  height: number;
  bounceForce: number;
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
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
}

export default function LovePlatformer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'won' | 'lost'>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [rasgullasCollected, setRasgullasCollected] = useState(0);
  const [heartsCollected, setHeartsCollected] = useState(0);
  const [combo, setCombo] = useState(1);

  // Audio Context for sound effects
  const sfxContextRef = useRef<AudioContext | null>(null);

  const playSfx = useCallback((type: 'jump' | 'doubleJump' | 'dash' | 'bounce' | 'collect' | 'win' | 'hit') => {
    try {
      if (!sfxContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        sfxContextRef.current = new AudioCtx();
      }
      const ctx = sfxContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'jump') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.exponentialRampToValueAtTime(540, t + 0.12);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.start(t);
        osc.stop(t + 0.12);
      } else if (type === 'doubleJump') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(880, t + 0.15);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.start(t);
        osc.stop(t + 0.15);
      } else if (type === 'dash') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(150, t + 0.18);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.start(t);
        osc.stop(t + 0.18);
      } else if (type === 'bounce') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(850, t + 0.22);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.start(t);
        osc.stop(t + 0.22);
      } else if (type === 'collect') {
        const notes = [587, 880];
        notes.forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, t + i * 0.05);
          g.gain.setValueAtTime(0.18, t + i * 0.05);
          g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.1);
          o.start(t + i * 0.05);
          o.stop(t + i * 0.05 + 0.1);
        });
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.25);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.start(t);
        osc.stop(t + 0.25);
      } else if (type === 'win') {
        const fanfare = [523, 659, 783, 1046, 1318];
        fanfare.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = 'triangle';
          o.frequency.setValueAtTime(freq, t + idx * 0.1);
          g.gain.setValueAtTime(0.2, t + idx * 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.4);
          o.start(t + idx * 0.1);
          o.stop(t + idx * 0.1 + 0.4);
        });
      }
    } catch {}
  }, []);

  // Controls state
  const keysRef = useRef({ left: false, right: false, up: false, dash: false });

  // Game World Constants
  const worldWidth = 1800;
  const worldHeight = 400;

  // Level Elements (Platforms with glowing edges & moving floaters)
  const initialPlatforms: Platform[] = [
    { x: 0, y: 350, width: 280, height: 50 },
    { x: 340, y: 290, width: 170, height: 24 },
    { x: 570, y: 230, width: 160, height: 24 },
    { x: 790, y: 270, width: 150, height: 24, isMoving: true, vx: 1.2, minX: 770, maxX: 940 },
    { x: 1000, y: 210, width: 170, height: 24 },
    { x: 1240, y: 280, width: 160, height: 24 },
    { x: 1470, y: 350, width: 330, height: 50 },
  ];

  // Trampoline Super Bounce Pads
  const bouncePads: BouncePad[] = [
    { x: 230, y: 340, width: 36, height: 12, bounceForce: -13.5 },
    { x: 930, y: 260, width: 36, height: 12, bounceForce: -14 },
  ];

  // Collectibles (Rasgullas & Glowing Hearts)
  const initialCollectibles: Collectible[] = [
    { x: 140, y: 300, type: 'rasgulla', collected: false, pulse: 0 },
    { x: 420, y: 240, type: 'heart', collected: false, pulse: 1 },
    { x: 650, y: 180, type: 'rasgulla', collected: false, pulse: 2 },
    { x: 860, y: 210, type: 'heart', collected: false, pulse: 3 },
    { x: 1080, y: 160, type: 'rasgulla', collected: false, pulse: 4 },
    { x: 1320, y: 230, type: 'heart', collected: false, pulse: 5 },
    { x: 1560, y: 300, type: 'rasgulla', collected: false, pulse: 6 },
  ];

  // Naughty Meme Cats (Patrolling Obstacles)
  const initialObstacles: Obstacle[] = [
    { x: 380, y: 264, width: 28, height: 26, speed: 1.4, minX: 350, maxX: 490, walkFrame: 0 },
    { x: 610, y: 204, width: 28, height: 26, speed: 1.6, minX: 580, maxX: 710, walkFrame: 1 },
    { x: 1040, y: 184, width: 28, height: 26, speed: 1.8, minX: 1010, maxX: 1150, walkFrame: 2 },
    { x: 1280, y: 254, width: 28, height: 26, speed: 1.5, minX: 1250, maxX: 1380, walkFrame: 3 },
  ];

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
    },
    goal: {
      x: 1650,
      y: 295,
      width: 34,
      height: 54,
    },
    platforms: [...initialPlatforms],
    collectibles: [...initialCollectibles],
    obstacles: [...initialObstacles],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    cameraX: 0,
    score: 0,
    lives: 3,
    rasgullas: 0,
    hearts: 0,
    combo: 1,
  });

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
      },
      goal: {
        x: 1650,
        y: 295,
        width: 34,
        height: 54,
      },
      platforms: initialPlatforms.map((p) => ({ ...p })),
      collectibles: initialCollectibles.map((c) => ({ ...c, collected: false })),
      obstacles: initialObstacles.map((o) => ({ ...o })),
      particles: [],
      floatingTexts: [],
      cameraX: 0,
      score: 0,
      lives: 3,
      rasgullas: 0,
      hearts: 0,
      combo: 1,
    };
    setScore(0);
    setLives(3);
    setRasgullasCollected(0);
    setHeartsCollected(0);
    setCombo(1);
    setGameState('playing');
  }, []);

  // Main Game Loop (60 FPS Physics & AAA Canvas Rendering)
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

        // Player physics & mechanics
        const moveSpeed = 4.4;
        const jumpForce = -11.2;
        const gravity = 0.48;

        // Dash mechanics
        if (p.dashCooldown > 0) p.dashCooldown--;
        if (p.invulnerableTimer > 0) p.invulnerableTimer--;

        if (keysRef.current.dash && p.dashCooldown === 0) {
          p.dashTimer = 10;
          p.dashCooldown = 60; // 1 second cooldown
          playSfx('dash');
          // Spawn dash dust trail particles
          for (let i = 0; i < 8; i++) {
            g.particles.push({
              x: p.x + p.width / 2,
              y: p.y + p.height / 2,
              vx: (Math.random() - 0.5) * 3 - (p.facing === 'right' ? 4 : -4),
              vy: (Math.random() - 0.5) * 3,
              color: '#F472B6',
              size: Math.random() * 4 + 2,
              alpha: 1,
              life: 0,
              maxLife: 20,
            });
          }
        }

        if (p.dashTimer > 0) {
          p.dashTimer--;
          p.vx = (p.facing === 'right' ? 1 : -1) * 11;
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
            p.vx *= 0.65;
            if (Math.abs(p.vx) < 0.1) p.vx = 0;
          }

          // Jump & Double Jump
          if (keysRef.current.up) {
            if (p.isGrounded) {
              p.vy = jumpForce;
              p.isGrounded = false;
              p.canDoubleJump = true;
              playSfx('jump');
              // Jump dust puff
              for (let i = 0; i < 5; i++) {
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
            } else if (p.canDoubleJump && p.vy > -4) {
              p.vy = jumpForce * 0.9;
              p.canDoubleJump = false;
              playSfx('doubleJump');
              // Golden ring particle explosion
              for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                g.particles.push({
                  x: p.x + p.width / 2,
                  y: p.y + p.height / 2,
                  vx: Math.cos(angle) * 4,
                  vy: Math.sin(angle) * 4,
                  color: '#FFD700',
                  size: 3,
                  alpha: 1,
                  life: 0,
                  maxLife: 22,
                });
              }
              keysRef.current.up = false;
            }
          }

          p.vy += gravity;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Clamp world left
        if (p.x < 10) p.x = 10;

        // Update Moving Platforms
        for (const plat of g.platforms) {
          if (plat.isMoving && plat.vx && plat.minX && plat.maxX) {
            plat.x += plat.vx;
            if (plat.x < plat.minX || plat.x > plat.maxX) {
              plat.vx = -plat.vx;
            }
          }
        }

        // Platform Collisions
        p.isGrounded = false;
        for (const plat of g.platforms) {
          if (
            p.x + p.width > plat.x &&
            p.x < plat.x + plat.width &&
            p.y + p.height >= plat.y &&
            p.y + p.height <= plat.y + 18 &&
            p.vy >= 0
          ) {
            p.y = plat.y - p.height;
            p.vy = 0;
            p.isGrounded = true;
            p.canDoubleJump = true;
            break;
          }
        }

        // Trampoline / Bounce Pads check
        for (const pad of bouncePads) {
          if (
            p.x + p.width > pad.x &&
            p.x < pad.x + pad.width &&
            p.y + p.height >= pad.y &&
            p.y + p.height <= pad.y + 18 &&
            p.vy >= 0
          ) {
            p.vy = pad.bounceForce;
            p.isGrounded = false;
            p.canDoubleJump = true;
            playSfx('bounce');
            // Super bounce sparkle burst
            for (let i = 0; i < 14; i++) {
              g.particles.push({
                x: pad.x + pad.width / 2,
                y: pad.y,
                vx: (Math.random() - 0.5) * 6,
                vy: -Math.random() * 5 - 2,
                color: '#EC4899',
                size: Math.random() * 4 + 2,
                alpha: 1,
                life: 0,
                maxLife: 25,
              });
            }
            break;
          }
        }

        // Falling into pit check
        if (p.y > worldHeight + 40) {
          p.x = 50;
          p.y = 290;
          p.vy = 0;
          playSfx('hit');
          const nextLives = g.lives - 1;
          g.lives = nextLives;
          setLives(nextLives);
          if (nextLives <= 0) {
            setGameState('lost');
          }
        }

        // Obstacles (Naughty Cats) Patrolling & Collision
        for (const obs of g.obstacles) {
          obs.x += obs.speed;
          obs.walkFrame += 0.15;
          if (obs.x < obs.minX || obs.x > obs.maxX) {
            obs.speed = -obs.speed;
          }

          // AABB Hitbox
          if (
            p.invulnerableTimer === 0 &&
            p.x + p.width - 6 > obs.x &&
            p.x + 6 < obs.x + obs.width &&
            p.y + p.height - 6 > obs.y &&
            p.y + 6 < obs.y + obs.height
          ) {
            playSfx('hit');
            p.vy = -7;
            p.vx = obs.speed > 0 ? 5 : -5;
            p.invulnerableTimer = 50; // Invulnerability frames
            const nextLives = g.lives - 1;
            g.lives = nextLives;
            setLives(nextLives);
            if (nextLives <= 0) {
              setGameState('lost');
            }
          }
        }

        // Collectibles check
        for (const col of g.collectibles) {
          if (!col.collected) {
            const dx = p.x + p.width / 2 - col.x;
            const dy = p.y + p.height / 2 - col.y;
            if (Math.sqrt(dx * dx + dy * dy) < 32) {
              col.collected = true;
              playSfx('collect');

              // Sparkle explosion
              for (let i = 0; i < 10; i++) {
                g.particles.push({
                  x: col.x,
                  y: col.y,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  color: col.type === 'rasgulla' ? '#FBBF24' : '#EC4899',
                  size: Math.random() * 4 + 2,
                  alpha: 1,
                  life: 0,
                  maxLife: 25,
                });
              }

              if (col.type === 'rasgulla') {
                const pts = 50 * g.combo;
                g.score += pts;
                g.rasgullas += 1;
                setRasgullasCollected(g.rasgullas);
                g.floatingTexts.push({
                  x: col.x,
                  y: col.y - 10,
                  text: `+${pts} 🍯!`,
                  color: '#FBBF24',
                  alpha: 1,
                  vy: -1.2,
                });
              } else {
                const pts = 100 * g.combo;
                g.score += pts;
                g.hearts += 1;
                g.combo += 1;
                setHeartsCollected(g.hearts);
                setCombo(g.combo);
                g.floatingTexts.push({
                  x: col.x,
                  y: col.y - 10,
                  text: `+${pts} 💖 (x${g.combo})!`,
                  color: '#EC4899',
                  alpha: 1,
                  vy: -1.4,
                });
              }
              setScore(g.score);
            }
          }
        }

        // Goal check (Reach Boyfriend)
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
        const targetCamX = p.x - canvas.width * 0.38;
        g.cameraX += (Math.max(0, Math.min(targetCamX, worldWidth - canvas.width)) - g.cameraX) * 0.12;

        // Update Particles & Floating Text
        g.particles = g.particles.filter((pt) => {
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life++;
          pt.alpha = 1 - pt.life / pt.maxLife;
          return pt.life < pt.maxLife;
        });

        g.floatingTexts = g.floatingTexts.filter((ft) => {
          ft.y += ft.vy;
          ft.alpha -= 0.03;
          return ft.alpha > 0;
        });
      }

      // ── AAA RENDERING PIPELINE ──
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // 1. Multi-Layer Parallax Background
      // Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#040b24');
      skyGrad.addColorStop(0.4, '#1b0c3b');
      skyGrad.addColorStop(0.8, '#4a0e4e');
      skyGrad.addColorStop(1, '#831843');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Distant Parallax Mountains (Layer 1 - Speed 0.15)
      ctx.fillStyle = 'rgba(76, 29, 149, 0.25)';
      for (let i = 0; i < 10; i++) {
        const mx = i * 260 - (g.cameraX * 0.15) % 260;
        ctx.beginPath();
        ctx.moveTo(mx, canvas.height);
        ctx.lineTo(mx + 130, 180);
        ctx.lineTo(mx + 260, canvas.height);
        ctx.fill();
      }

      // Mid-layer Glowing Celestial Mountains (Layer 2 - Speed 0.35)
      ctx.fillStyle = 'rgba(219, 39, 119, 0.2)';
      for (let i = 0; i < 8; i++) {
        const mx = i * 320 - (g.cameraX * 0.35) % 320;
        ctx.beginPath();
        ctx.moveTo(mx, canvas.height);
        ctx.lineTo(mx + 160, 220);
        ctx.lineTo(mx + 320, canvas.height);
        ctx.fill();
      }

      // World Space Rendering
      ctx.translate(-g.cameraX, 0);

      // 2. High-Tech Glass & Neon Cyber Platforms
      for (const plat of g.platforms) {
        // Platform Glass Body
        const platGrad = ctx.createLinearGradient(plat.x, plat.y, plat.x, plat.y + plat.height);
        platGrad.addColorStop(0, 'rgba(244, 114, 182, 0.45)');
        platGrad.addColorStop(1, 'rgba(157, 23, 77, 0.25)');
        ctx.fillStyle = platGrad;
        ctx.strokeStyle = '#F472B6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 10);
        ctx.fill();
        ctx.stroke();

        // Neon Top Edge Glow Line
        ctx.shadowColor = '#F472B6';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#FDF2F8';
        ctx.fillRect(plat.x + 6, plat.y, plat.width - 12, 3);
        ctx.shadowBlur = 0;
      }

      // 3. Trampoline Bouncy Pads
      for (const pad of bouncePads) {
        const pulse = Math.sin(Date.now() * 0.008) * 2;
        ctx.fillStyle = '#EC4899';
        ctx.shadowColor = '#F43F5E';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(pad.x, pad.y - pulse, pad.width, pad.height, 6);
        ctx.fill();
        ctx.shadowBlur = 0;
        // Bounce arrow symbol
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⬆⚡', pad.x + pad.width / 2, pad.y + 8 - pulse);
      }

      // 4. Collectibles (Rasgullas & Hearts with Glow Aura)
      for (const col of g.collectibles) {
        if (!col.collected) {
          const pulseOffset = Math.sin(Date.now() * 0.006 + col.pulse) * 5;
          const cy = col.y + pulseOffset;

          if (col.type === 'rasgulla') {
            // Sweet Rasgulla
            ctx.shadowColor = '#FBBF24';
            ctx.shadowBlur = 14;
            ctx.fillStyle = '#FFFBEB';
            ctx.beginPath();
            ctx.arc(col.x, cy, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            // Golden Syrup Droplet
            ctx.fillStyle = '#F59E0B';
            ctx.beginPath();
            ctx.arc(col.x - 3, cy - 3, 3.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Heart Gem
            ctx.shadowColor = '#EC4899';
            ctx.shadowBlur = 16;
            ctx.font = '22px serif';
            ctx.textAlign = 'center';
            ctx.fillText('💖', col.x, cy + 8);
            ctx.shadowBlur = 0;
          }
        }
      }

      // 5. Patrolling Meme Cats (Obstacles)
      for (const obs of g.obstacles) {
        const ox = obs.x;
        const oy = obs.y;
        const legBob = Math.sin(obs.walkFrame * 2) * 2;

        // Orange Tabby Cat Body
        ctx.fillStyle = '#FB923C';
        ctx.beginPath();
        ctx.ellipse(ox + 14, oy + 14, 13, 11, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pointy Ears
        ctx.fillStyle = '#EA580C';
        ctx.beginPath();
        ctx.moveTo(ox + 4, oy + 5);
        ctx.lineTo(ox + 1, oy - 5);
        ctx.lineTo(ox + 11, oy + 3);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(ox + 17, oy + 3);
        ctx.lineTo(ox + 27, oy - 5);
        ctx.lineTo(ox + 24, oy + 5);
        ctx.fill();

        // Angry / Playful Eyes
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(ox + 9, oy + 12, 2.2, 0, Math.PI * 2);
        ctx.arc(ox + 19, oy + 12, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Paws
        ctx.fillStyle = '#FED7AA';
        ctx.fillRect(ox + 6 + legBob, oy + 23, 4, 5);
        ctx.fillRect(ox + 18 - legBob, oy + 23, 4, 5);
      }

      // 6. Goal Pedestal & Boyfriend Sprite 💐
      const goal = g.goal;
      const gx = goal.x;
      const gy = goal.y;

      // Victory Pedestal
      ctx.fillStyle = 'rgba(236, 72, 153, 0.4)';
      ctx.strokeStyle = '#F472B6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(gx - 15, gy + 42, 64, 16, 6);
      ctx.fill();
      ctx.stroke();

      // Boyfriend Body (Blue Smart Shirt)
      ctx.fillStyle = '#2563EB';
      ctx.beginPath();
      ctx.roundRect(gx + 6, gy + 18, 22, 24, 5);
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

      // Waving Bouquet 💐 & Floating Heart
      ctx.font = '24px serif';
      ctx.textAlign = 'center';
      ctx.fillText('💐', gx + 24, gy + 22);
      ctx.font = '18px serif';
      ctx.fillText('💖', gx + 17, gy - 6);

      ctx.fillStyle = '#FDE047';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('My Arms Are Open! 💕', gx + 17, gy - 20);

      // 7. Player Character (Barsana Mukhopadhyay with Glasses, Red Top & Ponytail)
      const p = g.player;
      const px = p.x;
      const py = p.y;
      const isLeft = p.facing === 'left';
      const legBob = Math.sin(p.walkFrame * 2) * 4;

      // Invulnerability Blink Effect
      if (p.invulnerableTimer % 6 < 3) {
        // Scarf Trail when moving fast
        if (Math.abs(p.vx) > 2) {
          ctx.strokeStyle = '#F43F5E';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(px + (isLeft ? 20 : 8), py + 18);
          ctx.lineTo(px + (isLeft ? 32 : -4), py + 22 + Math.sin(p.walkFrame * 3) * 3);
          ctx.stroke();
        }

        // Blue Denim Jeans
        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(px + (isLeft ? 15 : 6) + legBob, py + 32, 6, 16);
        ctx.fillRect(px + (isLeft ? 6 : 15) - legBob, py + 32, 6, 16);

        // Stylish Red Top
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.roundRect(px + 4, py + 16, 20, 18, 5);
        ctx.fill();

        // Head
        ctx.fillStyle = '#FFE4C4';
        ctx.beginPath();
        ctx.arc(px + 14, py + 10, 9, 0, Math.PI * 2);
        ctx.fill();

        // Dark Hair with Ponytail
        ctx.fillStyle = '#1F2937';
        ctx.beginPath();
        ctx.arc(px + 14, py + 7, 9, Math.PI, Math.PI * 2);
        ctx.fill();
        // Cute Ponytail
        ctx.beginPath();
        ctx.arc(isLeft ? px + 23 : px + 5, py + 8, 5, 0, Math.PI * 2);
        ctx.fill();

        // Chic Glasses
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(px + (isLeft ? 7 : 10), py + 7, 5, 5);
        ctx.strokeRect(px + (isLeft ? 13 : 16), py + 7, 5, 5);
        ctx.beginPath();
        ctx.moveTo(px + (isLeft ? 12 : 15), py + 9.5);
        ctx.lineTo(px + (isLeft ? 13 : 16), py + 9.5);
        ctx.stroke();

        // Smile
        ctx.strokeStyle = '#E11D48';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(px + 14, py + 12, 2.5, 0, Math.PI);
        ctx.stroke();
      }

      // 8. Particle VFX
      for (const pt of g.particles) {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.alpha;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // 9. Floating Score Popups
      for (const ft of g.floatingTexts) {
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = ft.alpha;
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.globalAlpha = 1;
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, playSfx]);

  // Keyboard Event Listeners for Desktop (WASD / Arrows / Shift for Dash)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = true;
      if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') keysRef.current.up = true;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyJ') keysRef.current.dash = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = false;
      if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') keysRef.current.up = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyJ') keysRef.current.dash = false;
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
      {/* Title */}
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
          Guide Barsana across celestial islands, double-jump, dash past grumpy cats, bounce on trampolines, and reach his arms! 💐
        </p>
      </div>

      {/* Game Container */}
      <div className="glass-card p-3 sm:p-5 max-w-3xl w-full flex flex-col items-center relative shadow-2xl border border-pink-300/40">
        {/* Game AAA HUD Bar */}
        <div className="w-full flex items-center justify-between px-3 py-2.5 bg-black/50 rounded-xl mb-3 border border-white/15 text-xs sm:text-sm font-bold backdrop-blur-md">
          {/* Health Lives */}
          <div className="flex items-center gap-1.5">
            <span className="text-pink-300 mr-1">Lives:</span>
            {[...Array(3)].map((_, i) => (
              <span key={i} className={`text-base transition-transform ${i < lives ? 'scale-110' : 'opacity-25 grayscale'}`}>
                💖
              </span>
            ))}
          </div>

          {/* Treats & Score */}
          <div className="flex items-center gap-3">
            <span className="text-amber-300 flex items-center gap-1">
              🍯 {rasgullasCollected}/4
            </span>
            <span className="text-rose-300 flex items-center gap-1">
              💖 {heartsCollected}/3
            </span>
            <span className="text-yellow-300 font-extrabold ml-1">
              ⭐ {score}
            </span>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="relative w-full aspect-[16/9] max-h-[360px] rounded-xl overflow-hidden border-2 border-pink-400/60 shadow-2xl bg-love-sapphire">
          <canvas
            ref={canvasRef}
            width={720}
            height={400}
            className="w-full h-full object-cover block"
          />

          {/* Start Screen Overlay */}
          {gameState === 'start' && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4">
              <span className="text-4xl mb-2">🏃‍♀️💨 💕 💑</span>
              <h3 className="font-luxury font-bold text-2xl sm:text-4xl text-amber-200 mb-2">
                Help Barsana Reach Him! 🎮
              </h3>
              <p className="text-white/85 text-xs sm:text-sm max-w-sm mb-5 text-center">
                Double-jump across moving platforms, use the ⚡ DASH boost, bounce on trampoline flowers, and collect sweet Rasgullas!
              </p>
              <button
                onClick={resetGame}
                className="px-7 py-3 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold text-sm shadow-2xl active:scale-95 transition-transform cursor-pointer border border-white/40"
              >
                🎮 START ADVENTURE 🚀
              </button>
            </div>
          )}

          {/* Win Screen Overlay */}
          {gameState === 'won' && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-lg flex flex-col items-center justify-center p-4 animate-fade-in">
              <span className="text-5xl mb-2 animate-bounce">🎉💐💕</span>
              <h3 className="font-luxury font-bold text-2xl sm:text-4xl gradient-gold glow-gold mb-1 text-center">
                MISSION ACCOMPLISHED! ⭐⭐⭐
              </h3>
              <p className="text-pink-100 text-xs sm:text-sm max-w-md text-center mb-3">
                &ldquo;No matter the obstacles, distances, or grumpy cats in life, you will always find your safe home in my arms! I love you forever Barsana!&rdquo; 🍯💖
              </p>
              <div className="text-amber-300 font-bold text-sm mb-4">
                Final Score: {score} pts • Rasgullas: {rasgullasCollected} • Hearts: {heartsCollected}
              </div>
              <button
                onClick={resetGame}
                className="px-7 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm shadow-xl active:scale-95 transition-transform"
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
                className="px-7 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-xl active:scale-95 transition-transform"
              >
                🔁 Try Again
              </button>
            </div>
          )}
        </div>

        {/* On-Screen AAA Mobile Controls (Left / Right / Jump / Dash) */}
        <div className="w-full flex items-center justify-between px-3 pt-4 pb-1 select-none touch-none">
          {/* Direction Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onTouchStart={(e) => { e.preventDefault(); keysRef.current.left = true; }}
              onTouchEnd={(e) => { e.preventDefault(); keysRef.current.left = false; }}
              onMouseDown={() => (keysRef.current.left = true)}
              onMouseUp={() => (keysRef.current.left = false)}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/15 active:bg-pink-500/60 border border-white/30 flex items-center justify-center text-xl sm:text-2xl text-white shadow-xl active:scale-90 transition-transform cursor-pointer"
              aria-label="Move Left"
            >
              ◀
            </button>
            <button
              onTouchStart={(e) => { e.preventDefault(); keysRef.current.right = true; }}
              onTouchEnd={(e) => { e.preventDefault(); keysRef.current.right = false; }}
              onMouseDown={() => (keysRef.current.right = true)}
              onMouseUp={() => (keysRef.current.right = false)}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/15 active:bg-pink-500/60 border border-white/30 flex items-center justify-center text-xl sm:text-2xl text-white shadow-xl active:scale-90 transition-transform cursor-pointer"
              aria-label="Move Right"
            >
              ▶
            </button>
          </div>

          {/* Action Buttons (Dash + Jump) */}
          <div className="flex items-center gap-3">
            {/* Dash Button */}
            <button
              onTouchStart={(e) => { e.preventDefault(); keysRef.current.dash = true; }}
              onTouchEnd={(e) => { e.preventDefault(); keysRef.current.dash = false; }}
              onMouseDown={() => (keysRef.current.dash = true)}
              onMouseUp={() => (keysRef.current.dash = false)}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 border border-amber-300/50 flex flex-col items-center justify-center text-white shadow-xl active:scale-90 transition-transform cursor-pointer"
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
              className="w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 active:from-pink-600 active:to-rose-600 border-2 border-white/50 flex flex-col items-center justify-center text-white shadow-2xl active:scale-90 transition-transform cursor-pointer"
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
