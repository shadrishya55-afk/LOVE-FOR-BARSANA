'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface CuteCatProps {
  position: [number, number, number];
  color?: string;
  scale?: number;
  variant?: 'sitting' | 'waving' | 'sleeping' | 'banana' | 'pop';
}

// Generate high-resolution procedural fur texture
function createFurTexture(baseHex: string, pattern: 'calico' | 'tabby' | 'solid' | 'banana') {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Base fur background
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 256, 256);

  if (pattern === 'banana') {
    // Banana yellow gradient with green tip and brown speckles
    const grad = ctx.createLinearGradient(0, 0, 256, 256);
    grad.addColorStop(0, '#FFF59D');
    grad.addColorStop(0.5, '#FEE500');
    grad.addColorStop(1, '#FDD835');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    // Green tip
    ctx.fillStyle = '#8BC34A';
    ctx.beginPath();
    ctx.arc(20, 20, 30, 0, Math.PI * 2);
    ctx.fill();
  } else if (pattern === 'calico') {
    // Calico organic patches (Brown & Orange)
    ctx.fillStyle = '#8D6E63';
    ctx.beginPath();
    ctx.ellipse(60, 80, 45, 35, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(190, 180, 50, 40, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FF9800';
    ctx.beginPath();
    ctx.ellipse(180, 70, 40, 30, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(70, 200, 45, 35, 0.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (pattern === 'tabby') {
    // Tiger / Tabby stripes
    ctx.strokeStyle = '#6D4C41';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    for (let i = 20; i < 256; i += 35) {
      ctx.beginPath();
      ctx.moveTo(30, i);
      ctx.quadraticCurveTo(128, i + 15, 226, i);
      ctx.stroke();
    }
  }

  // Soft organic fur grain noise
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.fillRect(x, y, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export default function CuteCat({
  position,
  color = '#FFA07A',
  scale = 1,
  variant = 'sitting',
}: CuteCatProps) {
  const tailRef = useRef<THREE.Mesh>(null);
  const pawRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const tearRef = useRef<THREE.Group>(null);

  // Memoize textured procedural materials
  const furTexture = useMemo(() => {
    const pattern = variant === 'banana' ? 'banana' : variant === 'sleeping' ? 'tabby' : 'calico';
    return createFurTexture(color, pattern);
  }, [color, variant]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Tail wag
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 3.5) * 0.4 + 0.35;
    }

    // Waving paw
    if (pawRef.current && variant === 'waving') {
      pawRef.current.rotation.z = Math.sin(t * 6) * 0.65;
      pawRef.current.position.y = 0.52 + Math.sin(t * 6) * 0.12;
    }

    // Pop Cat mouth animation (Opens and closes wide)
    if (mouthRef.current && variant === 'pop') {
      const pop = (Math.sin(t * 8) + 1) * 0.5;
      mouthRef.current.scale.set(1 + pop * 0.8, 1 + pop * 1.6, 1);
    }

    // Banana Cat crying tears animation
    if (tearRef.current && variant === 'banana') {
      tearRef.current.position.y = -0.05 + (Math.sin(t * 5) * 0.03);
    }

    // Head bob
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 1.8) * 0.06;
      if (variant === 'sleeping') {
        headRef.current.position.y = 0.58 + Math.sin(t * 1.0) * 0.025;
      }
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.35}>
      <group position={position} scale={scale}>
        {/* ── Banana Costume for 3D Banana Cat ── */}
        {variant === 'banana' && (
          <group position={[0, -0.1, 0]}>
            {/* Curved Banana Peel Body */}
            <mesh rotation={[0, 0, 0.2]}>
              <torusGeometry args={[0.55, 0.22, 16, 24, Math.PI * 0.85]} />
              <meshStandardMaterial
                color="#FDD835"
                roughness={0.4}
                metalness={0.1}
                map={furTexture || undefined}
              />
            </mesh>
            {/* Green Banana Stem */}
            <mesh position={[-0.45, 0.4, 0]} rotation={[0, 0, 0.8]}>
              <cylinderGeometry args={[0.04, 0.06, 0.22, 8]} />
              <meshStandardMaterial color="#689F38" roughness={0.6} />
            </mesh>
          </group>
        )}

        {/* ── Cat Body ── */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 28, 28]} />
          <meshStandardMaterial
            color={color}
            roughness={0.65}
            metalness={0.1}
            map={furTexture || undefined}
          />
        </mesh>

        {/* ── Head group ── */}
        <group ref={headRef} position={[0, 0.68, 0.15]}>
          <mesh>
            <sphereGeometry args={[0.4, 28, 28]} />
            <meshStandardMaterial
              color={color}
              roughness={0.65}
              metalness={0.1}
              map={furTexture || undefined}
            />
          </mesh>

          {/* Ears */}
          {[-1, 1].map((side) => (
            <group key={`ear-${side}`}>
              {/* Outer ear */}
              <mesh position={[side * 0.24, 0.33, -0.02]} rotation={[0, 0, side * -0.32]}>
                <coneGeometry args={[0.14, 0.28, 6]} />
                <meshStandardMaterial color={color} roughness={0.65} />
              </mesh>
              {/* Inner pink ear */}
              <mesh position={[side * 0.24, 0.3, 0.03]} rotation={[0, 0, side * -0.32]}>
                <coneGeometry args={[0.08, 0.18, 6]} />
                <meshStandardMaterial color="#FF80AB" roughness={0.5} />
              </mesh>
            </group>
          ))}

          {/* Eyes */}
          {variant === 'sleeping' ? (
            [-1, 1].map((side) => (
              <mesh
                key={`closed-eye-${side}`}
                position={[side * 0.13, 0.05, 0.25]}
                rotation={[0, 0, side * 0.25]}
              >
                <boxGeometry args={[0.12, 0.02, 0.01]} />
                <meshStandardMaterial color="#212121" />
              </mesh>
            ))
          ) : (
            [-1, 1].map((side) => (
              <group key={`eye-${side}`}>
                {/* Dark Pupil */}
                <mesh position={[side * 0.13, 0.08, 0.25]}>
                  <sphereGeometry args={[0.08, 16, 16]} />
                  <meshStandardMaterial color="#1A237E" roughness={0.2} />
                </mesh>
                {/* Big shine */}
                <mesh position={[side * 0.11, 0.11, 0.32]}>
                  <sphereGeometry args={[0.032, 10, 10]} />
                  <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.9} />
                </mesh>
                {/* Small lower shine */}
                <mesh position={[side * 0.15, 0.06, 0.32]}>
                  <sphereGeometry args={[0.016, 8, 8]} />
                  <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.9} />
                </mesh>
              </group>
            ))
          )}

          {/* Crying Tears for Banana Cat */}
          {variant === 'banana' && (
            <group ref={tearRef}>
              {[-1, 1].map((side) => (
                <mesh key={`tear-${side}`} position={[side * 0.15, -0.05, 0.35]}>
                  <sphereGeometry args={[0.045, 12, 12]} />
                  <meshStandardMaterial
                    color="#00E5FF"
                    emissive="#00B0FF"
                    emissiveIntensity={0.6}
                    roughness={0.1}
                    transparent
                    opacity={0.85}
                  />
                </mesh>
              ))}
            </group>
          )}

          {/* Pop Cat Animated Mouth */}
          {variant === 'pop' ? (
            <mesh ref={mouthRef} position={[0, -0.08, 0.34]} rotation={[0.2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.09, 0.06, 16]} />
              <meshStandardMaterial color="#880E4F" />
            </mesh>
          ) : (
            <>
              {/* Cute Pink Heart Nose */}
              <mesh position={[0, -0.04, 0.33]}>
                <sphereGeometry args={[0.045, 12, 12]} />
                <meshStandardMaterial color="#FF1493" emissive="#FF1493" emissiveIntensity={0.3} />
              </mesh>

              {/* Smile */}
              <mesh position={[0, -0.1, 0.3]} rotation={[0.25, 0, 0]}>
                <torusGeometry args={[0.05, 0.009, 8, 16, Math.PI]} />
                <meshStandardMaterial color="#212121" />
              </mesh>
            </>
          )}

          {/* Whiskers */}
          {[-1, 1].map((side) =>
            [0, 1, 2].map((i) => (
              <mesh
                key={`w-${side}-${i}`}
                position={[side * 0.18, -0.06 + (i - 1) * 0.045, 0.26]}
                rotation={[0, 0, side * (0.08 + i * 0.1)]}
              >
                <boxGeometry args={[0.3, 0.006, 0.003]} />
                <meshStandardMaterial color="#424242" transparent opacity={0.8} />
              </mesh>
            )),
          )}

          {/* Rosy Blush */}
          {[-1, 1].map((side) => (
            <mesh key={`blush-${side}`} position={[side * 0.22, -0.03, 0.27]}>
              <circleGeometry args={[0.065, 16]} />
              <meshStandardMaterial
                color="#FF4081"
                transparent
                opacity={0.55}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>

        {/* ── Front Paws with Toe Beans ── */}
        <group position={[-0.2, -0.38, 0.28]}>
          <mesh>
            <sphereGeometry args={[0.13, 14, 14]} />
            <meshStandardMaterial color={color} roughness={0.65} />
          </mesh>
          {/* Pink toe beans */}
          <mesh position={[0, -0.04, 0.09]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#FF80AB" />
          </mesh>
        </group>

        <group
          ref={variant === 'waving' ? pawRef : undefined}
          position={[0.2, variant === 'waving' ? 0.52 : -0.38, 0.28]}
          rotation={variant === 'waving' ? [0, 0, 0.55] : undefined}
        >
          <mesh>
            <sphereGeometry args={[0.13, 14, 14]} />
            <meshStandardMaterial color={color} roughness={0.65} />
          </mesh>
          {/* Pink toe beans */}
          <mesh position={[0, -0.04, 0.09]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#FF80AB" />
          </mesh>
        </group>

        {/* ── Back paws ── */}
        {[-1, 1].map((side) => (
          <mesh key={`bp-${side}`} position={[side * 0.3, -0.45, -0.1]}>
            <sphereGeometry args={[0.15, 14, 14]} />
            <meshStandardMaterial color={color} roughness={0.65} />
          </mesh>
        ))}

        {/* ── Tail ── */}
        <mesh ref={tailRef} position={[0, -0.1, -0.5]} rotation={[0.65, 0, 0.4]}>
          <cylinderGeometry args={[0.05, 0.025, 0.7, 12]} />
          <meshStandardMaterial color={color} roughness={0.65} />
        </mesh>

        {/* ── White Belly Fur ── */}
        <mesh position={[0, -0.04, 0.43]}>
          <circleGeometry args={[0.24, 24]} />
          <meshStandardMaterial
            color="#FFF8E7"
            transparent
            opacity={0.88}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  );
}
