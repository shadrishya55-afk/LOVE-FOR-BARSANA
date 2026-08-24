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
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function LovePlatformer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'won' | 'lost'>('start');
  const [score, setScore] = useState(0);
  const [rasgullasCollected, setRasgullasCollected] = useState(0);
  const [heartsCollected, setHeartsCollected] = useState(0);

  // Audio Context for sound effects
  const sfxContextRef = useRef<AudioContext | null>(null);

  const playSfx = useCallback((type: 'jump' | 'collect' | 'win' | 'hit') => {
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
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.15);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.start(t);
        osc.stop(t + 0.15);
      } else if (type === 'collect') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587, t);
        osc.frequency.exponentialRampToValueAtTime(880, t + 0.12);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.start(t);
        osc.stop(t + 0.12);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(110, t + 0.2);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
      } else if (type === 'win') {
        const notes = [440, 554, 659, 880];
        notes.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, t + idx * 0.1);
          g.gain.setValueAtTime(0.18, t + idx * 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.35);
          o.start(t + idx * 0.1);
          o.stop(t + idx * 0.1 + 0.35);
        });
      }
    } catch {}
  }, []);

  // Controls state
  const keysRef = useRef({ left: false, right: false, up: false });

  // Game World Constants
  const worldWidth = 1400;
  const worldHeight = 400;

  // Level elements
  const platforms: Platform[] = [
    { x: 0, y: 360, width: 320, height: 40 },
    { x: 380, y: 310, width: 180, height: 25 },
    { x: 620, y: 250, width: 200, height: 25 },
    { x: 880, y: 290, width: 170, height: 25 },
    { x: 1110, y: 360, width: 290, height: 40 },
  ];

  const initialCollectibles: Collectible[] = [
    { x: 160, y: 315, type: 'rasgulla', collected: false, pulse: 0 },
    { x: 470, y: 260, type: 'heart', collected: false, pulse: 1 },
    { x: 720, y: 200, type: 'rasgulla', collected: false, pulse: 2 },
    { x: 960, y: 240, type: 'heart', collected: false, pulse: 3 },
    { x: 1200, y: 315, type: 'rasgulla', collected: false, pulse: 4 },
  ];

  const initialObstacles: Obstacle[] = [
    { x: 420, y: 285, width: 26, height: 24, speed: 1.5, minX: 390, maxX: 540 },
    { x: 680, y: 225, width: 26, height: 24, speed: 1.8, minX: 630, maxX: 800 },
    { x: 910, y: 265, width: 26, height: 24, speed: 1.6, minX: 890, maxX: 1030 },
  ];

  const gameRef = useRef({
    player: {
      x: 50,
      y: 300,
      width: 28,
      height: 48,
      vx: 0,
      vy: 0,
      isGrounded: false,
      facing: 'right' as 'left' | 'right',
      walkFrame: 0,
    },
    goal: {
      x: 1300,
      y: 305,
      width: 32,
      height: 52,
    },
    collectibles: [...initialCollectibles],
    obstacles: [...initialObstacles],
    cameraX: 0,
    score: 0,
    rasgullas: 0,
    hearts: 0,
  });

  const resetGame = useCallback(() => {
    gameRef.current = {
      player: {
        x: 50,
        y: 300,
        width: 28,
        height: 48,
        vx: 0,
        vy: 0,
        isGrounded: false,
        facing: 'right',
        walkFrame: 0,
      },
      goal: {
        x: 1300,
        y: 305,
        width: 32,
        height: 52,
      },
      collectibles: initialCollectibles.map((c) => ({ ...c, collected: false })),
      obstacles: initialObstacles.map((o) => ({ ...o })),
      cameraX: 0,
      score: 0,
      rasgullas: 0,
      hearts: 0,
    };
    setScore(0);
    setRasgullasCollected(0);
    setHeartsCollected(0);
    setGameState('playing');
  }, []);

  // Main Game Loop
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

        // Player physics
        const moveSpeed = 4.2;
        const jumpForce = -10.8;
        const gravity = 0.45;

        if (keysRef.current.left) {
          p.vx = -moveSpeed;
          p.facing = 'left';
          p.walkFrame += 0.2;
        } else if (keysRef.current.right) {
          p.vx = moveSpeed;
          p.facing = 'right';
          p.walkFrame += 0.2;
        } else {
          p.vx *= 0.7;
          if (Math.abs(p.vx) < 0.1) p.vx = 0;
        }

        if (keysRef.current.up && p.isGrounded) {
          p.vy = jumpForce;
          p.isGrounded = false;
          playSfx('jump');
        }

        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;

        // Clamp world left
        if (p.x < 10) p.x = 10;

        // Platform collisions
        p.isGrounded = false;
        for (const plat of platforms) {
          if (
            p.x + p.width > plat.x &&
            p.x < plat.x + plat.width &&
            p.y + p.height >= plat.y &&
            p.y + p.height <= plat.y + 16 &&
            p.vy >= 0
          ) {
            p.y = plat.y - p.height;
            p.vy = 0;
            p.isGrounded = true;
            break;
          }
        }

        // Falling into pit check
        if (p.y > worldHeight + 50) {
          playSfx('hit');
          setGameState('lost');
        }

        // Obstacles movement & collisions
        for (const obs of g.obstacles) {
          obs.x += obs.speed;
          if (obs.x < obs.minX || obs.x > obs.maxX) {
            obs.speed = -obs.speed;
          }

          // AABB Hitbox
          if (
            p.x + p.width - 6 > obs.x &&
            p.x + 6 < obs.x + obs.width &&
            p.y + p.height - 6 > obs.y &&
            p.y + 6 < obs.y + obs.height
          ) {
            playSfx('hit');
            setGameState('lost');
          }
        }

        // Collectibles check
        for (const col of g.collectibles) {
          if (!col.collected) {
            const dx = p.x + p.width / 2 - col.x;
            const dy = p.y + p.height / 2 - col.y;
            if (Math.sqrt(dx * dx + dy * dy) < 30) {
              col.collected = true;
              playSfx('collect');
              if (col.type === 'rasgulla') {
                g.score += 50;
                g.rasgullas += 1;
                setRasgullasCollected(g.rasgullas);
              } else {
                g.score += 100;
                g.hearts += 1;
                setHeartsCollected(g.hearts);
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

        // Camera follow
        const targetCamX = p.x - canvas.width * 0.35;
        g.cameraX = Math.max(0, Math.min(targetCamX, worldWidth - canvas.width));
      }

      // ── RENDERING ──
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(-g.cameraX, 0);

      // 1. Sky & Background Gradients
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#061338');
      skyGrad.addColorStop(0.5, '#2a1352');
      skyGrad.addColorStop(1, '#661254');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(g.cameraX, 0, canvas.width, canvas.height);

      // Distant mountains / clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.arc(i * 220 + 80, 360, 110, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Platforms
      for (const plat of platforms) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 12);
        ctx.fill();
        ctx.stroke();

        // Glowing platform top highlight
        ctx.fillStyle = '#fbcfe8';
        ctx.fillRect(plat.x + 8, plat.y, plat.width - 16, 3.5);
      }

      // 3. Collectibles
      for (const col of g.collectibles) {
        if (!col.collected) {
          const pulseOffset = Math.sin(Date.now() * 0.005 + col.pulse) * 4;
          const cy = col.y + pulseOffset;

          if (col.type === 'rasgulla') {
            // Sweet Rasgulla
            ctx.fillStyle = '#FFF8DC';
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(col.x, cy, 11, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            // Syrup shine
            ctx.fillStyle = '#F59E0B';
            ctx.beginPath();
            ctx.arc(col.x - 3, cy - 3, 3, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Radiant Heart
            ctx.fillStyle = '#EC4899';
            ctx.shadowColor = '#F43F5E';
            ctx.shadowBlur = 12;
            ctx.font = '20px serif';
            ctx.textAlign = 'center';
            ctx.fillText('💖', col.x, cy + 8);
            ctx.shadowBlur = 0;
          }
        }
      }

      // 4. Obstacles (Cute Patrolling Cat Sprites)
      for (const obs of g.obstacles) {
        const ox = obs.x;
        const oy = obs.y;

        // Cat body
        ctx.fillStyle = '#FFA07A';
        ctx.beginPath();
        ctx.ellipse(ox + 13, oy + 13, 12, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.fillStyle = '#FF7F50';
        ctx.beginPath();
        ctx.moveTo(ox + 4, oy + 4);
        ctx.lineTo(ox + 1, oy - 4);
        ctx.lineTo(ox + 10, oy + 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(ox + 16, oy + 2);
        ctx.lineTo(ox + 25, oy - 4);
        ctx.lineTo(ox + 22, oy + 4);
        ctx.fill();

        // Face
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(ox + 8, oy + 11, 2, 0, Math.PI * 2);
        ctx.arc(ox + 18, oy + 11, 2, 0, Math.PI * 2);
        ctx.fill();

        // Warning sparkle
        ctx.fillStyle = '#fbbf24';
        ctx.font = '10px sans-serif';
        ctx.fillText('⚡', ox + 8, oy - 6);
      }

      // 5. Goal (Boyfriend waiting with open arms & bouquet 💐)
      const goal = g.goal;
      const gx = goal.x;
      const gy = goal.y;

      // Body (Blue Shirt)
      ctx.fillStyle = '#3B82F6';
      ctx.beginPath();
      ctx.roundRect(gx + 6, gy + 16, 20, 24, 4);
      ctx.fill();

      // Head & Hair
      ctx.fillStyle = '#FFE0BD';
      ctx.beginPath();
      ctx.arc(gx + 16, gy + 10, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#222';
      ctx.beginPath();
      ctx.arc(gx + 16, gy + 7, 9, Math.PI, Math.PI * 2);
      ctx.fill();

      // Happy Face
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.arc(gx + 13, gy + 9, 1.5, 0, Math.PI * 2);
      ctx.arc(gx + 19, gy + 9, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Flower / Heart Bouquet in hand
      ctx.font = '22px serif';
      ctx.fillText('💐', gx + 18, gy + 20);
      ctx.font = '16px serif';
      ctx.fillText('💖', gx + 22, gy - 2);

      // "Reach Me!" text banner
      ctx.fillStyle = '#FDE047';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Waiting for you! 💕', gx + 16, gy - 16);

      // 6. Player (Barsana Sprite with Glasses, Red Top & Ponytail)
      const p = g.player;
      const px = p.x;
      const py = p.y;
      const isLeft = p.facing === 'left';
      const legOffset = Math.sin(p.walkFrame) * 4;

      // Legs / Blue Jeans
      ctx.fillStyle = '#60A5FA';
      ctx.fillRect(px + (isLeft ? 14 : 6) + legOffset, py + 32, 6, 16);
      ctx.fillRect(px + (isLeft ? 6 : 14) - legOffset, py + 32, 6, 16);

      // Red Top
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.roundRect(px + 4, py + 16, 20, 18, 5);
      ctx.fill();

      // Head & Skin
      ctx.fillStyle = '#FFE0BD';
      ctx.beginPath();
      ctx.arc(px + 14, py + 10, 8.5, 0, Math.PI * 2);
      ctx.fill();

      // Hair (Dark Brown / Black with ponytail)
      ctx.fillStyle = '#2B1B17';
      ctx.beginPath();
      ctx.arc(px + 14, py + 7, 8.5, Math.PI, Math.PI * 2);
      ctx.fill();
      // Ponytail
      ctx.beginPath();
      ctx.arc(isLeft ? px + 22 : px + 6, py + 8, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Glasses
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(px + (isLeft ? 7 : 10), py + 7, 5, 5);
      ctx.strokeRect(px + (isLeft ? 13 : 16), py + 7, 5, 5);
      ctx.beginPath();
      ctx.moveTo(px + (isLeft ? 12 : 15), py + 9.5);
      ctx.lineTo(px + (isLeft ? 13 : 16), py + 9.5);
      ctx.stroke();

      // Cute Smile
      ctx.strokeStyle = '#E11D48';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(px + 14, py + 12, 2.5, 0, Math.PI);
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, playSfx]);

  // Keyboard Event Listeners for Desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = true;
      if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') keysRef.current.up = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = false;
      if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') keysRef.current.up = false;
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
          <span>Interactive Mini Game</span>
          <span>🎮</span>
        </div>
        <h2 className="font-luxury font-bold text-4xl sm:text-6xl md:text-7xl gradient-text glow-text">
          Reach Your Boyfriend!
        </h2>
        <p className="text-pink-100/90 text-xs sm:text-sm md:text-base mt-2 font-normal">
          Guide Barsana across the floating platforms, dodge the naughty cats, collect Rasgullas 🍯, and jump into his arms! 💐
        </p>
      </div>

      {/* Game Container */}
      <div className="glass-card p-3 sm:p-5 max-w-3xl w-full flex flex-col items-center relative shadow-2xl border border-pink-300/40">
        {/* Game HUD Bar */}
        <div className="w-full flex items-center justify-between px-3 py-2 bg-black/40 rounded-xl mb-3 border border-white/10 text-xs sm:text-sm font-bold">
          <div className="flex items-center gap-3">
            <span className="text-amber-300 flex items-center gap-1">
              🍯 Rasgullas: {rasgullasCollected}/3
            </span>
            <span className="text-pink-400 flex items-center gap-1">
              💖 Hearts: {heartsCollected}/2
            </span>
          </div>
          <span className="text-amber-200">Score: {score}</span>
        </div>

        {/* Canvas Display */}
        <div className="relative w-full aspect-[16/9] max-h-[360px] rounded-xl overflow-hidden border-2 border-pink-400/60 shadow-inner bg-love-sapphire">
          <canvas
            ref={canvasRef}
            width={720}
            height={400}
            className="w-full h-full object-cover block"
          />

          {/* Start Screen Overlay */}
          {gameState === 'start' && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md flex flex-col items-center justify-center p-4">
              <h3 className="font-luxury font-bold text-2xl sm:text-4xl text-amber-200 mb-2">
                Help Barsana Reach Him! 💑
              </h3>
              <p className="text-white/85 text-xs sm:text-sm max-w-sm mb-5 text-center">
                Use the on-screen buttons below (or keyboard Arrow keys) to jump across the platforms and collect treats!
              </p>
              <button
                onClick={resetGame}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-xl active:scale-95 transition-transform cursor-pointer border border-white/30"
              >
                🎮 Start Game 🚀
              </button>
            </div>
          )}

          {/* Win Screen Overlay */}
          {gameState === 'won' && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-lg flex flex-col items-center justify-center p-4 animate-fade-in">
              <span className="text-4xl sm:text-5xl mb-2 animate-bounce">🎉💐💕</span>
              <h3 className="font-luxury font-bold text-2xl sm:text-4xl gradient-gold glow-gold mb-1 text-center">
                YOU REACHED HIM!
              </h3>
              <p className="text-pink-100 text-xs sm:text-sm max-w-md text-center mb-4">
                &ldquo;No matter the obstacles, distances, or grumpy cats in life, you will always find your safe home in my arms! I love you forever Barsana!&rdquo; 🍯💖
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={resetGame}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs sm:text-sm shadow-xl active:scale-95 transition-transform"
                >
                  🔄 Play Again
                </button>
              </div>
            </div>
          )}

          {/* Lost Screen Overlay */}
          {gameState === 'lost' && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4">
              <span className="text-3xl sm:text-4xl mb-1">😿</span>
              <h3 className="font-luxury font-bold text-xl sm:text-3xl text-pink-300 mb-1">
                Oops! Almost there!
              </h3>
              <p className="text-white/80 text-xs sm:text-sm mb-4 text-center max-w-xs">
                Don&apos;t worry my Rasgulla, my arms are always open for you! Give it another jump! 💕
              </p>
              <button
                onClick={resetGame}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs sm:text-sm shadow-xl active:scale-95 transition-transform"
              >
                🔁 Try Again
              </button>
            </div>
          )}
        </div>

        {/* On-Screen Mobile D-Pad Controls */}
        <div className="w-full flex items-center justify-between px-4 pt-4 pb-1 select-none touch-none">
          {/* Direction Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onTouchStart={(e) => { e.preventDefault(); keysRef.current.left = true; }}
              onTouchEnd={(e) => { e.preventDefault(); keysRef.current.left = false; }}
              onMouseDown={() => (keysRef.current.left = true)}
              onMouseUp={() => (keysRef.current.left = false)}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/10 active:bg-pink-500/50 border border-white/25 flex items-center justify-center text-xl sm:text-2xl text-white shadow-lg active:scale-90 transition-transform cursor-pointer"
              aria-label="Move Left"
            >
              ◀
            </button>
            <button
              onTouchStart={(e) => { e.preventDefault(); keysRef.current.right = true; }}
              onTouchEnd={(e) => { e.preventDefault(); keysRef.current.right = false; }}
              onMouseDown={() => (keysRef.current.right = true)}
              onMouseUp={() => (keysRef.current.right = false)}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/10 active:bg-pink-500/50 border border-white/25 flex items-center justify-center text-xl sm:text-2xl text-white shadow-lg active:scale-90 transition-transform cursor-pointer"
              aria-label="Move Right"
            >
              ▶
            </button>
          </div>

          {/* Jump Button */}
          <button
            onTouchStart={(e) => { e.preventDefault(); keysRef.current.up = true; }}
            onTouchEnd={(e) => { e.preventDefault(); keysRef.current.up = false; }}
            onMouseDown={() => (keysRef.current.up = true)}
            onMouseUp={() => (keysRef.current.up = false)}
            className="w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 active:from-pink-600 active:to-rose-600 border-2 border-white/40 flex flex-col items-center justify-center text-white shadow-2xl active:scale-90 transition-transform cursor-pointer"
            aria-label="Jump Button"
          >
            <span className="text-lg leading-none">⬆</span>
            <span className="text-[10px] font-bold tracking-wider uppercase">JUMP</span>
          </button>
        </div>
      </div>
    </section>
  );
}
