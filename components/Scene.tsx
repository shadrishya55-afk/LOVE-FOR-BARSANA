'use client';

import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll, Stars, Preload } from '@react-three/drei';
import { Suspense } from 'react';

import { HeroSection3D, HeroOverlay } from './sections/HeroSection';
import { LoveSection3D, LoveOverlay } from './sections/LoveSection';
import { CatsSection3D, CatsOverlay } from './sections/CatsSection';
import { ReasonsSection3D, ReasonsOverlay } from './sections/ReasonsSection';
import { FinaleSection3D, FinaleOverlay } from './sections/FinaleSection';

const TOTAL_PAGES = 5;

function Experience() {
  return (
    <>
      {/* ── Globals ── */}
      <color attach="background" args={['#0a0015']} />
      <fog attach="fog" args={['#0a0015', 8, 28]} />

      {/* ── Lighting ── */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} color="#FFE4E1" />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#FF69B4" distance={30} />
      <pointLight position={[-10, -5, -5]} intensity={0.5} color="#C084FC" distance={25} />

      {/* ── Star field ── */}
      <Stars
        radius={80}
        depth={60}
        count={800}
        factor={4}
        saturation={0.4}
        fade
        speed={0.8}
      />

      {/* ── Scroll-driven experience ── */}
      <ScrollControls pages={TOTAL_PAGES} damping={0.25}>
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
        height: '100vh',
      }}
    >
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
    </Canvas>
  );
}
