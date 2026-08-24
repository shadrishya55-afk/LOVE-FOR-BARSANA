'use client';

import dynamic from 'next/dynamic';
import LoadingScreen from '@/components/ui/LoadingScreen';
import MusicPlayer from '@/components/ui/MusicPlayer';
import NavigationTabs from '@/components/ui/NavigationTabs';
import HeroSection from '@/components/sections/HeroSection';
import GallerySection from '@/components/sections/GallerySection';
import OurStorySection from '@/components/sections/OurStorySection';
import LoveSection from '@/components/sections/LoveSection';
import CatsSection from '@/components/sections/CatsSection';
import LovePlatformer from '@/components/game/LovePlatformer';
import ReasonsSection from '@/components/sections/ReasonsSection';
import FinaleSection from '@/components/sections/FinaleSection';

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative min-h-screen w-full gradient-backdrop text-white selection:bg-pink-500 selection:text-white pb-32">
      {/* Loading Screen */}
      <LoadingScreen />

      {/* Liquid Glass Top Music Player (Exact Songs: J'adore La Vie 432Hz, Bollywood & Hollywood) */}
      <MusicPlayer />

      {/* Floating Liquid Glass Navigation Tabs */}
      <NavigationTabs />

      {/* 3D Background Canvas (Vibrant Blue to Pink Gradient Transition + 3D Textured Meme Cats) */}
      <Scene />

      {/* Foreground Interactive Sections in Natural Flow */}
      <div className="relative z-10 w-full flex flex-col">
        <HeroSection />
        <GallerySection />
        <OurStorySection />
        <LoveSection />
        <CatsSection />
        <LovePlatformer />
        <ReasonsSection />
        <FinaleSection />
      </div>
    </main>
  );
}
