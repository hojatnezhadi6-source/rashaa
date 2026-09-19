import React, { useState, useEffect } from 'react';
import { ArrowRight, Compass, Sparkles, PhoneCall, ShieldCheck, ArrowUpRight, Play, Pause, Globe } from 'lucide-react';
import { Language, SiteConfig } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { DEFAULT_HERO_FRAMES } from '../data/siteConfig';
import { InteractiveGlobe } from './InteractiveGlobe';

interface HeroSectionProps {
  language: Language;
  siteConfig: SiteConfig;
  onStartJourney: () => void;
  onExploreDestinations: () => void;
  onOpenQuickCall?: () => void;
  onSelectDestinationForAssessment?: (destName: string) => void;
  onBookConsultationForCountry?: (destName: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  siteConfig,
  onStartJourney,
  onExploreDestinations,
  onOpenQuickCall,
  onSelectDestinationForAssessment,
  onBookConsultationForCountry,
}) => {
  const t = TRANSLATIONS[language];
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const frames = siteConfig?.heroFrames?.length ? siteConfig.heroFrames : DEFAULT_HERO_FRAMES;

  // Auto progression for the background cinematic atmosphere
  useEffect(() => {
    if (!isAutoPlaying || frames.length <= 1) return;
    const interval = setInterval(() => {
      setActiveFrameIndex((prev) => (prev + 1) % frames.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, frames.length]);

  // Keep index in bound if frames list changed
  const currentFrame = frames[activeFrameIndex % frames.length] || frames[0];

  const headline1 =
    language === 'fa'
      ? siteConfig?.heroHeadline1Fa || 'آینده شما'
      : siteConfig?.heroHeadline1En || t.heroHeadline1 || 'Your Future';

  const headline2 =
    language === 'fa'
      ? siteConfig?.heroHeadline2Fa || 'فراتر از مرزهاست.'
      : siteConfig?.heroHeadline2En || t.heroHeadline2 || 'Has No Borders.';

  const subheadline =
    language === 'fa'
      ? siteConfig?.heroSubheadlineFa ||
        'مشاوره اختصاصی حقوقی برای اخذ اقامت دائم، ویزای کاری، تحصیلی و سرمایه‌گذاری در برترین کشورهای جهان با همراهی وکلای رسمی بین‌المللی.'
      : siteConfig?.heroSubheadlineEn || t.heroSubheadline;

  const badgeText =
    language === 'fa'
      ? siteConfig?.badgeFa || 'راشا مهاجرت — همراه رسمی شما در مهاجرت و اقامت بین‌المللی'
      : siteConfig?.badgeEn || t.smallHeroText || 'RASHA MOHAJERAT — GLOBAL IMMIGRATION CONSULTANCY';

  const farsiFontClass =
    siteConfig?.persianFontTheme === 'sahel'
      ? 'font-farsi-sahel'
      : siteConfig?.persianFontTheme === 'amiri'
      ? 'font-farsi-amiri'
      : siteConfig?.persianFontTheme === 'vazir'
      ? 'font-farsi-vazir'
      : 'font-farsi-title';

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#080909]"
    >
      {/* Background Cinematic Visuals with Smooth Crossfade */}
      <div className="absolute inset-0 z-0">
        {frames.map((frame, index) => {
          const isActive = index === activeFrameIndex % frames.length;
          return (
            <div
              key={frame.id || frame.tag}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              } transform transition-transform duration-[8000ms]`}
            >
              <img
                src={frame.image}
                alt={frame.title}
                className="w-full h-full object-cover object-center filter brightness-[0.32] contrast-[1.12]"
                referrerPolicy="no-referrer"
              />
            </div>
          );
        })}

        {/* Ambient Radial Golden Glow & Atmospheric Lighting */}
        <div className="absolute -top-32 -right-32 w-[650px] h-[650px] rounded-full opacity-25 bg-[#C9A96A] blur-[150px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full opacity-20 bg-[#C9A96A] blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080909] via-[#080909]/60 to-[#080909]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(201,169,106,0.18),rgba(255,255,255,0))] pointer-events-none" />
      </div>

      {/* Top Spacer for Navbar */}
      <div className="h-20 sm:h-24" />

      {/* Main Hero Content: Split Grid with Headline on one side & Interactive 3D Globe on the other */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full my-auto py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left / Editorial Column: Headline, Subheadline & Action CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Glowing Category Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.04] border border-[#C9A96A]/30 backdrop-blur-md mb-6 sm:mb-7 shadow-[0_0_25px_rgba(201,169,106,0.18)] self-start">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A96A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C9A96A]" />
              </span>
              <span className="text-[11px] sm:text-xs tracking-[0.18em] text-[#E8CA8C] font-medium font-mono">
                {badgeText}
              </span>
            </div>

            {/* Grand Editorial Display Headline with bespoke Luxury Persian & English Typography */}
            {language === 'fa' || language === 'ar' ? (
              <h1 className={`text-2xl min-[380px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] leading-[1.35] sm:leading-[1.22] font-bold text-[#F4F0E8] mb-5 sm:mb-6 ${farsiFontClass}`}>
                <span className="block text-[#F4F0E8] font-bold">
                  {headline1}
                </span>
                <span className="block mt-1 sm:mt-2 text-gold-gradient font-black">
                  {headline2}
                </span>
              </h1>
            ) : (
              <h1
                className="text-3xl sm:text-5xl md:text-6xl lg:text-[76px] xl:text-[88px] leading-[1.05] sm:leading-[0.98] font-serif-display font-light text-[#F4F0E8] mb-5 sm:mb-6"
                style={{ letterSpacing: '-0.035em' }}
              >
                <span className="block">{headline1}</span>
                <span className="italic block mt-1 text-gold-gradient font-editorial drop-shadow-[0_4px_30px_rgba(201,169,106,0.3)]">
                  {headline2}
                </span>
              </h1>
            )}

            {/* Subheadline with enhanced Persian typographic line-height */}
            <p className={`text-xs min-[380px]:text-sm sm:text-base md:text-lg max-w-2xl text-[#D1D1C7] mb-7 sm:mb-8 ${
              language === 'fa' || language === 'ar'
                ? 'leading-[1.85] font-normal font-farsi'
                : 'leading-relaxed font-light font-sans-luxury'
            }`}>
              {subheadline}
            </p>

            {/* High-Impact Action CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-4 pt-1">
              <button
                id="hero-start-journey-cta"
                onClick={onStartJourney}
                className="group relative inline-flex items-center justify-center gap-3 px-6 sm:px-9 py-3.5 sm:py-4 bg-gradient-to-r from-[#DFBA73] via-[#C9A96A] to-[#B38F4E] hover:from-[#E8CA8C] hover:to-[#C9A96A] text-[#080909] font-sans-luxury text-xs sm:text-sm font-bold tracking-[0.14em] uppercase rounded-xl transition-all duration-300 shadow-[0_0_35px_rgba(201,169,106,0.35)] hover:shadow-[0_0_50px_rgba(201,169,106,0.55)] cursor-pointer w-full sm:w-auto"
              >
                <span>{language === 'fa' ? 'شروع ارزیابی هوشمند پرونده' : t.primaryCTA}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-explore-destinations-cta"
                onClick={onExploreDestinations}
                className="group inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 bg-white/[0.04] hover:bg-white/[0.08] text-[#F4F0E8] border border-white/20 hover:border-[#C9A96A]/70 font-sans-luxury text-xs sm:text-sm font-semibold tracking-[0.12em] uppercase rounded-xl backdrop-blur-md transition-all duration-300 cursor-pointer w-full sm:w-auto"
              >
                <Compass className="w-4 h-4 text-[#C9A96A] group-hover:rotate-45 transition-transform duration-300" />
                <span>{language === 'fa' ? 'لیست مقاصد' : t.secondaryCTA}</span>
              </button>

              {onOpenQuickCall && (
                <button
                  id="hero-quick-call-cta"
                  onClick={onOpenQuickCall}
                  className="group inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-4 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 font-sans-luxury text-xs sm:text-sm font-semibold rounded-xl backdrop-blur-md transition-all duration-300 cursor-pointer w-full sm:w-auto"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>{language === 'fa' ? 'تماس فوری' : 'Quick Call'}</span>
                </button>
              )}
            </div>

            {/* Verification Stats & Highlights Ribbon */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#DFBA73]">
                  ۹۸.۶٪
                </div>
                <div className="text-[11px] text-[#9B9B95] mt-0.5">
                  {language === 'fa' ? 'نرخ موفقیت ویزا' : 'Visa Success'}
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#F4F0E8]">
                  +۲,۴۰۰
                </div>
                <div className="text-[11px] text-[#9B9B95] mt-0.5">
                  {language === 'fa' ? 'پرونده موفق مهاجرتی' : 'Approved Cases'}
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                  ۲۴/۷
                </div>
                <div className="text-[11px] text-[#9B9B95] mt-0.5">
                  {language === 'fa' ? 'پشتیبانی حقوقی VIP' : 'Global Legal Desk'}
                </div>
              </div>
            </div>
          </div>

          {/* Right / Interactive 3D Globe Column: "کره زمین تعاملی با قابلیت چرخش و کلیک روی کشورها" */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <InteractiveGlobe
              language={language}
              onSelectDestinationForAssessment={(dest) => {
                if (onSelectDestinationForAssessment) {
                  onSelectDestinationForAssessment(dest);
                } else {
                  onStartJourney();
                }
              }}
              onBookConsultationForCountry={(dest) => {
                if (onBookConsultationForCountry) {
                  onBookConsultationForCountry(dest);
                } else if (onOpenQuickCall) {
                  onOpenQuickCall();
                }
              }}
            />
          </div>

        </div>
      </div>

      {/* Left Vertical Rotated Marker */}
      <div className="hidden xl:block fixed bottom-16 left-12 rtl:left-auto rtl:right-12 transform -rotate-90 rtl:rotate-90 origin-left rtl:origin-right text-[9px] uppercase tracking-[0.5em] text-[#C9A96A]/50 pointer-events-none z-20">
        {language === 'fa' ? 'جهت بررسی مسیرها اسکرول کنید ↓' : 'Scroll to Explore ↓'}
      </div>

      {/* Bottom Cinematic Story Scrubber & Pathways Summary Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full pb-8 sm:pb-12 pt-6 border-t border-[#F4F0E8]/10 flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
        {/* Story Scrubber Controls */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#9B9B95] font-mono">
            <span className="text-[#C9A96A] font-semibold">
              {language === 'fa' ? currentFrame.tagFarsi || currentFrame.tag : currentFrame.tag}
            </span>
            <span>—</span>
            <span className="text-[#F4F0E8]">
              {language === 'fa' ? currentFrame.titleFarsi || currentFrame.title : currentFrame.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {frames.map((frame, index) => (
              <button
                key={frame.id || frame.tag}
                onClick={() => setActiveFrameIndex(index)}
                className="group relative py-2 focus:outline-none cursor-pointer"
              >
                <div
                  className={`h-1 rounded-full transition-all duration-500 ${
                    index === activeFrameIndex % frames.length
                      ? 'w-10 sm:w-14 bg-[#DFBA73]'
                      : 'w-4 sm:w-6 bg-white/20 hover:bg-white/40'
                  }`}
                />
              </button>
            ))}

            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="ml-2 text-[#9B9B95] hover:text-[#F4F0E8] transition-colors p-1 cursor-pointer"
              title={isAutoPlaying ? 'توقف پخش خودکار' : 'پخش خودکار'}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Global Credentials Assurance */}
        <div className="flex items-center gap-6 text-xs text-[#9B9B95] font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C9A96A]" />
            <span>{language === 'fa' ? 'وکلای عضو رسمی CICC و MARA' : 'Licensed CICC & MARA Counsel'}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C9A96A]" />
            <span>{language === 'fa' ? 'مشاوره اختصاصی VIP' : 'Private Client Advisory'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
