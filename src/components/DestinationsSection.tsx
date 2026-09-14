import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Clock, MapPin, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { Destination, Language } from '../types';
import { DESTINATIONS } from '../data/content';
import { TRANSLATIONS } from '../data/translations';

interface DestinationsSectionProps {
  language: Language;
  onSelectDestinationForAssessment: (destinationName: string) => void;
  destinations?: Destination[];
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  language,
  onSelectDestinationForAssessment,
  destinations = DESTINATIONS,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeDestinations = destinations?.length ? destinations : DESTINATIONS;

  const categories = [
    { en: 'All', fa: 'همه مقاصد' },
    { en: 'Work', fa: 'کاری' },
    { en: 'Investment', fa: 'سرمایه‌گذاری' },
    { en: 'Study', fa: 'تحصیلی' },
    { en: 'Residency', fa: 'اقامت' },
    { en: 'Citizenship', fa: 'شهروندی' },
    { en: 'Family', fa: 'خانواده' },
  ];

  const filteredDestinations = filterCategory === 'All'
    ? activeDestinations
    : activeDestinations.filter((d) => d.categories.includes(filterCategory));

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="destinations" className="py-14 sm:py-18 bg-[#080909] relative overflow-hidden border-t border-white/[0.08]">
      {/* Background Panoramic Metropolis Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=2200&q=80"
          alt="Global Gateways Atmosphere"
          className="w-full h-full object-cover filter brightness-[0.11] contrast-[1.15]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080909] via-[#080909]/80 to-[#080909]" />
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-[#C9A96A]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-[#C9A96A]/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 mb-8 sm:mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#C9A96A]/10 border border-[#C9A96A]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A96A]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#E8CA8C] font-semibold font-mono">
                {language === 'fa' ? 'مقاصد برتر مهاجرت' : 'Global Gateways'}
              </span>
            </div>
            <h2
              className="text-3xl sm:text-5xl lg:text-6xl font-serif-display font-light tracking-tight text-[#F4F0E8]"
              style={{ letterSpacing: language === 'fa' || language === 'ar' ? '0' : '-0.025em' }}
            >
              {t.worldIsOpenTitle}
            </h2>
            <p className="text-[#9B9B95] font-sans-luxury text-xs sm:text-sm max-w-xl font-light leading-relaxed">
              {t.worldIsOpenSub}
            </p>
          </div>

          {/* Category Filter Pills & Carousel Arrows */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.en}
                  onClick={() => setFilterCategory(cat.en)}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.16em] font-sans-luxury rounded-full transition-all duration-300 cursor-pointer ${
                    filterCategory === cat.en
                      ? 'bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] text-[#080909] font-bold shadow-[0_0_20px_rgba(201,169,106,0.4)]'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-[#9B9B95] hover:text-[#F4F0E8] border border-white/[0.08]'
                  }`}
                >
                  {language === 'fa' ? cat.fa : cat.en}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2 ml-4">
              <button
                onClick={() => scroll('left')}
                className="p-3 rounded-full bg-[#111313] border border-white/10 text-[#9B9B95] hover:text-[#F4F0E8] hover:border-[#C9A96A]/60 hover:shadow-[0_0_15px_rgba(201,169,106,0.2)] transition-all cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-3 rounded-full bg-[#111313] border border-white/10 text-[#9B9B95] hover:text-[#F4F0E8] hover:border-[#C9A96A]/60 hover:shadow-[0_0_15px_rgba(201,169,106,0.2)] transition-all cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Cinematic Scroll Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 sm:gap-8 overflow-x-auto px-6 sm:px-8 max-w-full no-scrollbar scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none' }}
      >
        {filteredDestinations.map((dest, idx) => (
          <div
            key={dest.id}
            id={`destination-panel-${dest.id}`}
            onClick={() => setSelectedDestination(dest)}
            className="group relative flex-shrink-0 w-[85vw] sm:w-[65vw] md:w-[45vw] lg:w-[32vw] max-w-xl h-[440px] sm:h-[480px] rounded-2xl overflow-hidden cursor-pointer border border-white/[0.08] hover:border-[#C9A96A]/60 shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(201,169,106,0.25)] transition-all duration-500 snap-start bg-[#111313] hover:-translate-y-1.5"
          >
            {/* Background Image with Cinematic Hover Zoom */}
            <img
              src={dest.image}
              alt={dest.name}
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.5] contrast-[1.1] group-hover:scale-108 group-hover:brightness-[0.65] transition-all duration-700"
              referrerPolicy="no-referrer"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080909] via-[#080909]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#080909]/70 via-transparent to-transparent" />

            {/* Top Meta Tags */}
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
              <span className="text-[11px] font-mono tracking-widest text-[#E8CA8C] uppercase px-3 py-1 rounded-full bg-[#080909]/80 backdrop-blur-md border border-[#C9A96A]/30 shadow-md">
                0{idx + 1} / GATEWAY
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-[#F4F0E8] px-3 py-1 rounded-full bg-[#080909]/80 backdrop-blur-md border border-white/10">
                  {dest.lifestyleRankFarsi && language === 'fa' ? dest.lifestyleRankFarsi : dest.lifestyleRank}
                </span>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 z-10 space-y-3">
              {/* Category Badges */}
              <div className="flex flex-wrap gap-1.5">
                {(language === 'fa' && dest.categoriesFarsi ? dest.categoriesFarsi : dest.categories).slice(0, 3).map((c) => (
                  <span
                    key={c}
                    className="text-[10px] uppercase tracking-wider text-[#F4F0E8]/90 bg-white/[0.1] backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15"
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* Title & Tagline */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-serif-display font-medium text-[#F4F0E8] group-hover:text-gold-gradient transition-all">
                  {language === 'fa' && dest.nameFarsi ? (
                    <>
                      <span>{dest.nameFarsi}</span>
                      <span className="text-sm font-sans text-[#9B9B95] mr-2 font-light">
                        ({dest.name})
                      </span>
                    </>
                  ) : (
                    dest.name
                  )}
                </h3>
                <p className="text-xs text-[#B3B3AB] font-sans-luxury line-clamp-2 mt-1 leading-relaxed">
                  {language === 'fa' && dest.taglineFarsi ? dest.taglineFarsi : dest.tagline}
                </p>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/[0.1] text-xs">
                <div>
                  <span className="text-[#9B9B95] block text-[10px] uppercase tracking-wider">
                    {language === 'fa' ? 'زمان پردازش' : 'Processing'}
                  </span>
                  <span className="text-[#F4F0E8] font-medium font-mono text-[11px]">
                    {language === 'fa' && dest.processingTimeFarsi ? dest.processingTimeFarsi : dest.processingTime}
                  </span>
                </div>
                <div>
                  <span className="text-[#9B9B95] block text-[10px] uppercase tracking-wider">
                    {language === 'fa' ? 'کف سرمایه / سطح هزینه' : 'Capital Tier'}
                  </span>
                  <span className="text-[#E8CA8C] font-semibold text-[11px]">
                    {language === 'fa' && dest.costBracketFarsi ? dest.costBracketFarsi : dest.costBracket}
                  </span>
                </div>
              </div>

              {/* Explore CTA */}
              <div className="pt-1 flex items-center justify-between">
                <span className="text-xs font-sans-luxury tracking-widest uppercase text-[#C9A96A] group-hover:text-[#F4F0E8] transition-colors flex items-center gap-2 font-medium">
                  <span>{t.exploreDestination}</span>
                </span>
                <div className="w-8 h-8 rounded-full bg-white/[0.08] group-hover:bg-[#C9A96A] group-hover:text-[#080909] group-hover:shadow-[0_0_15px_rgba(201,169,106,0.5)] flex items-center justify-center transition-all duration-300">
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deep Destination Detail Modal */}
      {selectedDestination && (
        <div
          id="destination-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#080909]/90 backdrop-blur-xl animate-in fade-in duration-300"
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#111313] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-10 no-scrollbar">
            {/* Close Button */}
            <button
              id="close-destination-modal"
              onClick={() => setSelectedDestination(null)}
              className="absolute top-6 right-6 p-2 text-[#9B9B95] hover:text-[#F4F0E8] bg-[#080909] rounded-full border border-white/10 transition-colors z-20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="relative h-64 sm:h-72 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 rounded-t-2xl overflow-hidden mb-8">
              <img
                src={selectedDestination.image}
                alt={selectedDestination.name}
                className="w-full h-full object-cover filter brightness-[0.45]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111313] via-[#111313]/30 to-transparent" />
              <div className="absolute bottom-6 left-6 sm:left-10 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs uppercase tracking-widest text-[#C9A96A] font-semibold">
                    Strategic Gateway
                  </span>
                </div>
                <h3 className="text-3xl sm:text-5xl font-serif-display font-medium text-[#F4F0E8]">
                  {selectedDestination.name}
                </h3>
                <p className="text-sm text-[#9B9B95] max-w-xl mt-1">
                  {selectedDestination.tagline}
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-8">
              {/* Executive Overview */}
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-[#C9A96A] mb-2 font-medium">
                  {language === 'fa' ? 'تحلیل راهبردی حوزه قضایی' : 'Jurisdiction Analysis'}
                </h4>
                <p className="text-sm sm:text-base text-[#F4F0E8]/90 leading-relaxed font-sans-luxury">
                  {selectedDestination.overview}
                </p>
              </div>

              {/* Key Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#080909] border border-white/[0.06]">
                <div>
                  <span className="text-[11px] text-[#9B9B95] uppercase block">{language === 'fa' ? 'شهرهای کلیدی' : 'Hub Cities'}</span>
                  <span className="text-xs sm:text-sm text-[#F4F0E8] font-medium">{selectedDestination.capitalCity}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#9B9B95] uppercase block">{language === 'fa' ? 'زمان تقریبی' : 'Estimated Time'}</span>
                  <span className="text-xs sm:text-sm text-[#F4F0E8] font-medium">{selectedDestination.processingTime}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#9B9B95] uppercase block">{language === 'fa' ? 'سطح سرمایه' : 'Investment Tier'}</span>
                  <span className="text-xs sm:text-sm text-[#C9A96A] font-medium">{selectedDestination.costBracket}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#9B9B95] uppercase block">{language === 'fa' ? 'رتبه کیفیت زندگی' : 'Global Rank'}</span>
                  <span className="text-xs sm:text-sm text-[#F4F0E8] font-medium">{selectedDestination.lifestyleRank}</span>
                </div>
              </div>

              {/* Primary Legal Pathways */}
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-[#C9A96A] mb-4 font-medium">
                  {language === 'fa' ? 'برنامه‌ها و روش‌های مهاجرتی اصلی' : 'Primary Immigration Pathways'}
                </h4>
                <div className="space-y-4">
                  {selectedDestination.primaryPathways.map((path) => (
                    <div
                      key={path.name}
                      className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-[#C9A96A]/30 transition-colors"
                    >
                      <h5 className="text-base font-serif-display font-medium text-[#F4F0E8] mb-1">
                        {path.name}
                      </h5>
                      <p className="text-xs sm:text-sm text-[#9B9B95] mb-3">
                        {path.description}
                      </p>
                      <div className="space-y-1.5">
                        <span className="text-[11px] uppercase tracking-wider text-[#C9A96A] block">
                          {language === 'fa' ? 'معیارهای کلیدی:' : 'Key Criteria:'}
                        </span>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {path.requirements.map((req, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-[#F4F0E8]/80">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A96A] flex-shrink-0" />
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#9B9B95]">
                  {language === 'fa'
                    ? `ارزیابی امتیازات و شانس قبولی پرونده شما برای ${selectedDestination.nameFarsi || selectedDestination.name}`
                    : `Evaluate your CRS points and eligibility for ${selectedDestination.name}.`}
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const destName = selectedDestination.name;
                      setSelectedDestination(null);
                      onSelectDestinationForAssessment(destName);
                    }}
                    className="flex-1 sm:flex-initial px-6 py-3 bg-[#C9A96A] hover:bg-[#b89758] text-[#080909] text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {language === 'fa'
                        ? `ارزیابی شانس ${selectedDestination.nameFarsi || selectedDestination.name}`
                        : `Assess ${selectedDestination.name} Profile`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
