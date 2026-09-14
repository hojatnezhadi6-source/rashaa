import React, { useEffect, useState } from 'react';
import { Compass, Sparkles, ChevronUp, Play, Film } from 'lucide-react';
import { Language } from '../types';

interface CinematicScrollExperienceProps {
  language: Language;
  onNavigate: (sectionId: string) => void;
}

const SECTIONS = [
  { id: 'hero', labelEn: 'Home', labelFa: 'آغاز', num: '01' },
  { id: 'destinations', labelEn: 'Destinations', labelFa: 'مقاصد جهانی', num: '02' },
  { id: 'services', labelEn: 'Practices', labelFa: 'خدمات تخصصی', num: '03' },
  { id: 'why-rasha', labelEn: 'Principles', labelFa: 'اصول راشا', num: '04' },
  { id: 'process', labelEn: 'Roadmap', labelFa: 'نقشه راه', num: '05' },
  { id: 'case-studies', labelEn: 'Success Cases', labelFa: 'پرونده‌ها', num: '06' },
  { id: 'global-presence', labelEn: 'Global Desks', labelFa: 'دفاتر جهان', num: '07' },
  { id: 'journal', labelEn: 'Journal', labelFa: 'مجله راشا', num: '08' },
  { id: 'contact', labelEn: 'Advisory Desk', labelFa: 'مشاوره', num: '09' },
];

export const CinematicScrollExperience: React.FC<CinematicScrollExperienceProps> = ({
  language,
  onNavigate,
}) => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;
      setScrollPercent(Math.min(100, Math.max(0, progress)));
      setIsVisible(currentScroll > 150);

      // Determine active section
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            setActiveSectionId(SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeSection = SECTIONS.find((s) => s.id === activeSectionId) || SECTIONS[0];

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

      {/* Floating Cinematic HUD Section Indicator (Left on LTR, Right on RTL) */}
      <aside
        aria-label="Cinematic Navigation Indicator"
        className={`fixed z-30 bottom-10 hidden lg:flex flex-col gap-2.5 transition-all duration-500 pointer-events-auto ${
          language === 'fa' || language === 'ar' ? 'left-8 text-left' : 'right-8 text-right'
        } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}
      >
        <div className="luxury-glass px-4 py-3 rounded-2xl border border-[#C9A96A]/25 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#C9A96A] animate-ping" />
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[9px] uppercase font-mono tracking-widest text-[#C9A96A]">
              <Film className="w-3 h-3 text-[#C9A96A]" />
              <span>
                {language === 'fa' ? 'نمای سینماتیک' : 'Cinematic View'}
              </span>
              <span className="text-[#9B9B95]">|</span>
              <span className="text-[#F4F0E8] font-bold font-mono">{activeSection.num}</span>
            </div>
            
            <span className="text-xs font-serif-display text-[#F4F0E8] font-medium tracking-wide">
              {language === 'fa' ? activeSection.labelFa : activeSection.labelEn}
            </span>
          </div>

          <div className="pl-2 border-l border-white/10 flex flex-col items-center">
            <span className="text-[10px] font-mono font-semibold text-[#DFBA73]">
              {Math.round(scrollPercent)}%
            </span>
          </div>
        </div>

        {/* Mini Section Jump Dots */}
        <div className="flex items-center justify-end gap-1.5 px-2 py-1">
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => onNavigate(sec.id)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                activeSectionId === sec.id
                  ? 'w-6 h-1.5 bg-[#C9A96A] shadow-[0_0_8px_rgba(201,169,106,0.6)]'
                  : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/50'
              }`}
              title={language === 'fa' ? sec.labelFa : sec.labelEn}
              aria-label={`Go to ${sec.labelEn}`}
            />
          ))}
        </div>
      </aside>

      {/* Floating Cinematic Back-To-Top Quick Scroll Pill */}
      {scrollPercent > 70 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 left-6 sm:left-10 z-30 luxury-glass hover:border-[#C9A96A] px-3.5 py-2.5 rounded-full text-xs text-[#F4F0E8] flex items-center gap-2 shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer animate-in fade-in"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-4 h-4 text-[#C9A96A]" />
          <span className="text-[11px] font-mono tracking-wider hidden sm:inline">
            {language === 'fa' ? 'بازگشت به بالا' : 'Back to Top'}
          </span>
        </button>
      )}
    </>
  );
};
