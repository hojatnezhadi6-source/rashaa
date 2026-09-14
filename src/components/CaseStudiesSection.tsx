import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle, Clock, MapPin, Sparkles } from 'lucide-react';
import { Language, CaseStudy } from '../types';
import { CASE_STUDIES } from '../data/content';
import { TRANSLATIONS } from '../data/translations';

interface CaseStudiesSectionProps {
  language: Language;
  caseStudies?: CaseStudy[];
}

export const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({
  language,
  caseStudies = CASE_STUDIES,
}) => {
  const t = TRANSLATIONS[language];
  const activeCaseStudies = caseStudies?.length ? caseStudies : CASE_STUDIES;
  const [selectedCase, setSelectedCase] = useState<number>(0);

  return (
    <section id="case-studies" className="py-28 sm:py-36 bg-[#080909] relative overflow-hidden border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20 space-y-3">
          <span className="text-xs uppercase tracking-[0.28em] text-[#C9A96A] font-sans-luxury">
            Verified Case Intelligence
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif-display font-light text-[#F4F0E8] tracking-tight">
            {t.caseStudiesTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#9B9B95] font-sans-luxury max-w-2xl leading-relaxed">
            {t.caseStudiesSubtitle}
          </p>
        </div>

        {/* 4 Case Studies Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {activeCaseStudies.map((item, idx) => (
            <div
              key={item.id}
              id={`case-study-card-${item.id}`}
              className="p-8 rounded-2xl bg-[#111313] border border-white/[0.08] hover:border-[#C9A96A]/40 transition-all duration-400 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                {/* Meta Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#C9A96A]">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{language === 'fa' && item.profileFarsi ? item.profileFarsi : item.profile}</span>
                  </div>
                  <span className="text-[11px] text-[#9B9B95] px-2.5 py-1 rounded bg-[#080909] border border-white/[0.06] flex-shrink-0">
                    {item.destination}
                  </span>
                </div>

                {/* Pathway Headline */}
                <h3 className="text-xl sm:text-2xl font-serif-display text-[#F4F0E8] group-hover:text-gold-gradient transition-all">
                  {language === 'fa' && item.titleFarsi ? item.titleFarsi : item.pathway}
                </h3>

                {/* Challenge & Strategy */}
                <div className="space-y-3 text-xs sm:text-sm text-[#9B9B95] font-sans-luxury leading-relaxed">
                  <div>
                    <strong className="text-[#F4F0E8]/90 block mb-0.5 font-medium">
                      {language === 'fa' ? 'چالش راهبردی متقاضی:' : 'The Strategic Challenge:'}
                    </strong>
                    {language === 'fa' && item.challengeFarsi ? item.challengeFarsi : item.challenge}
                  </div>
                  <div>
                    <strong className="text-[#C9A96A] block mb-0.5 font-medium">
                      {language === 'fa' ? 'راهکار اختصاصی راشا:' : 'The RASHA Solution:'}
                    </strong>
                    {language === 'fa' && item.strategyFarsi ? item.strategyFarsi : item.strategy}
                  </div>
                </div>
              </div>

              {/* Outcome Banner */}
              <div className="p-4 rounded-xl bg-[#080909] border border-white/[0.06] flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#9B9B95] block">
                    {language === 'fa' ? 'نتیجه رسمی پرونده' : 'Official Outcome'}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{language === 'fa' && item.outcomeFarsi ? item.outcomeFarsi : item.outcome}</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] uppercase tracking-wider text-[#9B9B95] block">
                    {language === 'fa' ? 'مدت زمان' : 'Duration'}
                  </span>
                  <span className="text-xs text-[#F4F0E8] font-mono">
                    {language === 'fa' && item.durationFarsi ? item.durationFarsi : item.duration}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
