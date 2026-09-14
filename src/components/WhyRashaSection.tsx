import React, { useState } from 'react';
import { ArrowRight, Compass, Shield, Award, Sparkles } from 'lucide-react';
import { Language, WhyRashaPrinciple } from '../types';
import { WHY_RASHA_PRINCIPLES } from '../data/content';
import { TRANSLATIONS } from '../data/translations';

interface WhyRashaSectionProps {
  language: Language;
  onExploreServices: () => void;
  whyRashaPrinciples?: WhyRashaPrinciple[];
}

export const WhyRashaSection: React.FC<WhyRashaSectionProps> = ({
  language,
  onExploreServices,
  whyRashaPrinciples = WHY_RASHA_PRINCIPLES,
}) => {
  const t = TRANSLATIONS[language];
  const activePrinciples = whyRashaPrinciples?.length ? whyRashaPrinciples : WHY_RASHA_PRINCIPLES;
  const [activePrinciple, setActivePrinciple] = useState<number>(0);

  return (
    <section id="why-rasha" className="py-28 sm:py-36 bg-[#080909] relative overflow-hidden border-t border-white/[0.06]">
      {/* Ambient Spotlight */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#C9A96A]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#C9A96A]/8 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Editorial Section Headline */}
        <div className="max-w-4xl mb-16 sm:mb-24 space-y-4">
          <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#C9A96A]/10 border border-[#C9A96A]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A96A]" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#E8CA8C] font-semibold font-mono">The Advisory Philosophy</span>
          </div>
          <h2
            className="text-4xl sm:text-6xl lg:text-7xl font-serif-display font-light text-[#F4F0E8] tracking-tight leading-[1.05]"
            style={{ letterSpacing: language === 'fa' || language === 'ar' ? '0' : '-0.03em' }}
          >
            <span className="block italic font-editorial text-[#F4F0E8]">
              {t.whyRashaTitle}
            </span>
          </h2>
          <p className="text-base sm:text-xl text-[#C7C7BE] font-sans-luxury font-light leading-relaxed max-w-2xl">
            "{t.whyRashaText}"
          </p>
        </div>

        {/* 4 Principles Interactive Split Experience */}
        <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Left Column: 4 Principle Tabs */}
          <div className="lg:col-span-6 space-y-4">
            {activePrinciples.map((principle, index) => (
              <div
                key={principle.number}
                id={`principle-tab-${index}`}
                onClick={() => setActivePrinciple(index)}
                className={`p-6 sm:p-7 rounded-2xl cursor-pointer transition-all duration-400 border ${
                  activePrinciple === index
                    ? 'bg-gradient-to-r from-[#171a1a] to-[#111313] border-[#C9A96A]/60 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(201,169,106,0.18)] -translate-y-0.5'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono tracking-widest ${activePrinciple === index ? 'text-[#E8CA8C]' : 'text-[#9B9B95]'}`}>
                        {principle.number}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-serif-display font-medium text-[#F4F0E8]">
                        {language === 'fa' && principle.titleFarsi ? principle.titleFarsi : principle.title}
                      </h3>
                    </div>
                    <p className="text-xs uppercase tracking-wider text-[#9B9B95] font-sans-luxury">
                      {language === 'fa' && principle.subtitleFarsi ? principle.subtitleFarsi : principle.subtitle}
                    </p>
                  </div>

                  <span
                    className={`w-2.5 h-2.5 rounded-full mt-2 transition-all ${
                      activePrinciple === index
                        ? 'bg-[#DFBA73] shadow-[0_0_10px_rgba(223,186,115,0.9)] animate-pulse'
                        : 'bg-white/20'
                    }`}
                  />
                </div>

                {activePrinciple === index && (
                  <p className="text-xs sm:text-sm text-[#B3B3AB] font-sans-luxury leading-relaxed mt-4 pt-4 border-t border-white/[0.08] animate-in fade-in duration-300">
                    {language === 'fa' && principle.descriptionFarsi ? principle.descriptionFarsi : principle.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Right Column: High-Grade Editorial Image Showcase */}
          <div className="lg:col-span-6">
            <div className="relative h-[480px] sm:h-[560px] rounded-2xl overflow-hidden border border-white/15 bg-[#111313] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(201,169,106,0.15)] group">
              {activePrinciples.map((principle, index) => (
                <img
                  key={principle.number}
                  src={principle.image}
                  alt={principle.title}
                  className={`absolute inset-0 w-full h-full object-cover filter brightness-[0.55] contrast-[1.1] transition-opacity duration-700 ${
                    activePrinciple === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  } transition-transform duration-1000`}
                  referrerPolicy="no-referrer"
                />
              ))}

              <div className="absolute inset-0 bg-gradient-to-t from-[#080909] via-transparent to-transparent" />

              {/* Floating Quote Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-[#080909]/85 backdrop-blur-xl border border-[#C9A96A]/30 shadow-2xl">
                <div className="flex items-center gap-2 text-[#E8CA8C] text-xs font-mono uppercase tracking-widest mb-1 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A96A]" />
                  <span>RASHA Advisory Standard</span>
                </div>
                <p className="text-xs sm:text-sm text-[#F4F0E8] font-serif-display italic leading-relaxed">
                  "Sovereignty, security, and prestige are not accidental; they are designed."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
