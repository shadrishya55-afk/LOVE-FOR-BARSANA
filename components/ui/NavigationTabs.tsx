'use client';

import { useState, useEffect } from 'react';

const tabs = [
  { id: 'hero', label: 'Home', emoji: '🌸' },
  { id: 'gallery', label: 'Her Photos', emoji: '📸' },
  { id: 'our-story', label: 'Us Together', emoji: '💑' },
  { id: 'cats', label: '50 Shades of Cats', emoji: '🐾' },
  { id: 'mini-game', label: 'Mini Game', emoji: '🎮' },
  { id: 'reasons', label: 'Reasons', emoji: '💌' },
  { id: 'finale', label: 'Finale', emoji: '👑' },
];

export default function NavigationTabs() {
  const [activeTab, setActiveTab] = useState('hero');

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (let i = tabs.length - 1; i >= 0; i--) {
        const el = document.getElementById(tabs[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveTab(tabs[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-[98vw] w-auto"
      aria-label="Section Navigation"
    >
      <div className="liquid-glass-pill px-2 py-1.5 sm:px-3 sm:py-2 flex items-center gap-1 sm:gap-1.5 shadow-2xl overflow-x-auto max-w-[96vw]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1 sm:gap-1.5 flex-shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-pink-500/85 to-purple-600/85 text-white shadow-lg scale-105 border border-pink-300/40'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-xs sm:text-base">{tab.emoji}</span>
              <span className="text-[11px] sm:text-xs font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
