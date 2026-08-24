'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, Stars, Preload, useScroll } from '@react-three/drei';
import { Suspense, useRef, useEffect } from 'react';
import * as THREE from 'three';

import { HeroSection3D, HeroOverlay } from './sections/HeroSection';
import { LoveSection3D, LoveOverlay } from './sections/LoveSection';
import { CatsSection3D, CatsOverlay } from './sections/CatsSection';
import { ReasonsSection3D, ReasonsOverlay } from './sections/ReasonsSection';
import { FinaleSection3D, FinaleOverlay } from './sections/FinaleSection';

const TOTAL_PAGES = 5;

// Romantic color gradient sequence across the 5 sections
const bgColors = [
  new THREE.Color('#0d021f'), // Hero - Cosmic Velvet Violet
  new THREE.Color('#380927'), // Love - Warm Sunset Rose
  new THREE.Color('#2d0e3a'), // Cats - Playful Pastel Wine
  new THREE.Color('#140529'), // Reasons - Starry Lilac Indigo
  new THREE.Color('#340528'), // Finale - Celestial Golden Rose
];

function DynamicBackground() {
  const scroll = useScroll();
  const color = useRef(new THREE.Color('#0d021f'));

  useFrame(({ scene }) => {
    const offset = Math.min(Math.max(scroll.offset, 0), 1);
    const progress = offset * (TOTAL_PAGES - 1);
    const index = Math.min(Math.floor(progress), TOTAL_PAGES - 2);
    const fraction = progress - index;

    color.current.lerpColors(bgColors[index], bgColors[index + 1] || bgColors[index], fraction);
    scene.background = color.current;
    if (scene.fog) {
      scene.fog.color = color.current;
    }
  });

  return null;
}

// Touch swipe fallback listener to guarantee 100% responsive scrolling on mobile devices
function MobileTouchScroll() {
  const scroll = useScroll();

  useEffect(() => {
    let startY = 0;
    let isTouching = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startY = e.touches[0].clientY;
        isTouching = true;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isTouching || e.touches.length !== 1 || !scroll.el) return;
      const currentY = e.touches[0].clientY;
      const deltaY = (startY - currentY) * 1.2;
      startY = currentY;

      scroll.el.scrollTop += deltaY;
    };

    const onTouchEnd = () => {
      isTouching = false;
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [scroll]);

  return null;
}

function Experience() {
  return (
    <>
      {/* ── Dynamic gradient background ── */}
      <color attach="background" args={['#0d021f']} />
      <fog attach="fog" args={['#0d021f', 7, 30]} />
      <DynamicBackground />

      {/* ── Ambient & Directional Lighting ── */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 6, 5]} intensity={0.5} color="#FFE4E1" />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#FF69B4" distance={30} />
      <pointLight position={[-10, -5, -5]} intensity={0.6} color="#FFD700" distance={25} />

      {/* ── Star field ── */}
      <Stars
        radius={80}
        depth={60}
        count={900}
        factor={4}
        saturation={0.5}
        fade
        speed={0.8}
      />

      {/* ── Scroll-driven experience ── */}
      <ScrollControls pages={TOTAL_PAGES} damping={0.12} distance={1}>
        <MobileTouchScroll />

        {/* 3D layer */}
        <Scroll>
          <HeroSection3D />
          <LoveSection3D />
          <CatsSection3D />
          <ReasonsSection3D />
          <FinaleSection3D />
        </Scroll>

        {/* HTML overlay layer */}
        <Scroll html style={{ width: '100%' }}>
          <HeroOverlay />
          <LoveOverlay />
          <CatsOverlay />
          <ReasonsOverlay />
          <FinaleOverlay />
        </Scroll>
      </ScrollControls>

      <Preload all />
    </>
  );
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 200 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        touchAction: 'pan-y',
      }}
    >
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
    </Canvas>
  );
}
