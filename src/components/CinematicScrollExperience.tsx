import React, { useEffect, useState } from 'react';
import { Language } from '../types';

interface CinematicScrollExperienceProps {
  language: Language;
  onNavigate: (sectionId: string) => void;
}

export const CinematicScrollExperience: React.FC<CinematicScrollExperienceProps> = () => {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;
      setScrollPercent(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Cinematic Glowing Gold Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-white/[0.04] z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#DFBA73] via-[#C9A96A] to-[#DFBA73] shadow-[0_0_12px_rgba(201,169,106,0.85)] transition-all duration-150 ease-out"
          style={{ width: `${scrollPercent}%` }}
        />
        {/* Trailing golden spark */}
        {scrollPercent > 1 && scrollPercent < 99 && (
          <div
            className="absolute top-[-2px] w-2 h-2 rounded-full bg-[#FFF6E5] shadow-[0_0_10px_#DFBA73] -translate-x-1/2 transition-all duration-150"
            style={{ left: `${scrollPercent}%` }}
          />
        )}
      </div>
    </>
  );
};
