'use client';

import dynamic from 'next/dynamic';
import LoadingScreen from '@/components/ui/LoadingScreen';
import MusicPlayer from '@/components/ui/MusicPlayer';
import HeroSection from '@/components/sections/HeroSection';
import LoveSection from '@/components/sections/LoveSection';
import CatsSection from '@/components/sections/CatsSection';
import ReasonsSection from '@/components/sections/ReasonsSection';
import FinaleSection from '@/components/sections/FinaleSection';

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-love-deep text-white selection:bg-pink-500 selection:text-white">
      {/* Loading Screen */}
      <LoadingScreen />

      {/* Liquid Glass Touch Top Music Player */}
      <MusicPlayer />

      {/* 3D Background Canvas (Blue to Pink Gradient Transition) */}
      <Scene />

      {/* Foreground Sections in Natural Document Flow */}
      <div className="relative z-10 w-full flex flex-col">
        <HeroSection />
        <LoveSection />
        <CatsSection />
        <ReasonsSection />
        <FinaleSection />
      </div>
    </main>
  );
}
