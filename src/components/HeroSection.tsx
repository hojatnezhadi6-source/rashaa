import React, { useState, useEffect } from 'react';
import { ArrowRight, Compass, Sparkles, PhoneCall, ShieldCheck, ArrowUpRight, Globe } from 'lucide-react';
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

  const frames = siteConfig?.heroFrames?.length ? siteConfig.heroFrames : DEFAULT_HERO_FRAMES;

  // Auto progression for the background cinematic atmosphere
  useEffect(() => {
    if (frames.length <= 1) return;
    const interval = setInterval(() => {
      setActiveFrameIndex((prev) => (prev + 1) % frames.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [frames.length]);

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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 md:px-12 w-full my-auto py-4 sm:py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left / Editorial Column: Headline, Subheadline & Action CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left rtl:lg:text-right items-center lg:items-start">
            {/* Glowing Category Badge */}
            <div
              className="inline-flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.04] border border-[#C9A96A]/30 backdrop-blur-md mb-4 sm:mb-6 shadow-[0_0_25px_rgba(201,169,106,0.18)] max-w-full"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A96A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C9A96A]" />
              </span>
              <span className="text-[10px] min-[380px]:text-[11px] sm:text-xs tracking-[0.14em] sm:tracking-[0.18em] text-[#E8CA8C] font-medium font-mono truncate">
                {badgeText}
              </span>
            </div>

            {/* Grand Editorial Display Headline with bespoke Luxury Persian & English Typography */}
            {language === 'fa' || language === 'ar' ? (
              <h1 className={`text-3xl min-[380px]:text-4xl sm:text-5xl md:text-6xl lg:text-[54px] xl:text-[62px] leading-[1.28] sm:leading-[1.18] font-bold text-[#F4F0E8] mb-4 sm:mb-6 ${farsiFontClass}`}>
                <span className="block text-[#F4F0E8] font-bold">
                  {headline1}
                </span>
                <span className="block mt-1 sm:mt-2 text-gold-gradient font-black">
                  {headline2}
                </span>
              </h1>
            ) : (
              <h1
                className="text-3xl min-[380px]:text-4xl sm:text-5xl md:text-6xl lg:text-[70px] xl:text-[80px] leading-[1.1] sm:leading-[1.0] font-serif-display font-light text-[#F4F0E8] mb-4 sm:mb-6"
                style={{ letterSpacing: '-0.03em' }}
              >
                <span className="block">{headline1}</span>
                <span className="italic block mt-1 text-gold-gradient font-editorial drop-shadow-[0_4px_30px_rgba(201,169,106,0.3)]">
                  {headline2}
                </span>
              </h1>
            )}

            {/* Subheadline with enhanced Persian typographic line-height */}
            <p
              className={`text-xs min-[380px]:text-sm sm:text-base md:text-lg max-w-2xl text-[#D1D1C7] mb-6 sm:mb-8 ${
                language === 'fa' || language === 'ar'
                  ? 'leading-[1.8] font-normal font-farsi'
                  : 'leading-relaxed font-light font-sans-luxury'
              }`}
            >
              {subheadline}
            </p>

            {/* High-Impact Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 w-full sm:w-auto">
              <button
                id="hero-start-journey-cta"
                onClick={onStartJourney}
                className="group relative inline-flex items-center justify-center gap-3 px-6 sm:px-9 py-3.5 sm:py-4 bg-gradient-to-r from-[#DFBA73] via-[#C9A96A] to-[#B38F4E] hover:from-[#E8CA8C] hover:to-[#C9A96A] text-[#080909] font-sans-luxury text-xs sm:text-sm font-bold tracking-[0.14em] uppercase rounded-xl transition-all duration-300 shadow-[0_0_35px_rgba(201,169,106,0.35)] hover:shadow-[0_0_50px_rgba(201,169,106,0.55)] cursor-pointer w-full sm:w-auto"
              >
                <span>{language === 'fa' ? 'شروع ارزیابی هوشمند پرونده' : t.primaryCTA}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </button>

              {onOpenQuickCall && (
                <button
                  id="hero-quick-call-cta"
                  onClick={onOpenQuickCall}
                  className="group inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3.5 sm:py-4 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 font-sans-luxury text-xs sm:text-sm font-semibold rounded-xl backdrop-blur-md transition-all duration-300 cursor-pointer w-full sm:w-auto"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>{language === 'fa' ? 'تماس فوری' : 'Quick Call'}</span>
                </button>
              )}
            </div>

            {/* Verification Stats & Highlights Ribbon */}
            <div className="mt-7 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10 grid grid-cols-3 gap-3 sm:gap-6 max-w-lg w-full">
              <div className="text-center sm:text-left rtl:sm:text-right">
                <div
                  className="text-lg min-[380px]:text-xl sm:text-2xl font-bold font-mono text-[#DFBA73]"
                >
                  ۹۸.۶٪
                </div>
                <div
                  className="text-[10px] min-[380px]:text-xs text-[#9B9B95] mt-0.5 whitespace-nowrap"
                >
                  {language === 'fa' ? 'نرخ موفقیت ویزا' : 'Visa Success'}
                </div>
              </div>
              <div className="text-center sm:text-left rtl:sm:text-right">
                <div
                  className="text-lg min-[380px]:text-xl sm:text-2xl font-bold font-mono text-[#F4F0E8]"
                >
                  +۲,۴۰۰
                </div>
                <div
                  className="text-[10px] min-[380px]:text-xs text-[#9B9B95] mt-0.5 whitespace-nowrap"
                >
                  {language === 'fa' ? 'پرونده موفق مهاجرتی' : 'Approved Cases'}
                </div>
              </div>
              <div className="text-center sm:text-left rtl:sm:text-right">
                <div
                  className="text-lg min-[380px]:text-xl sm:text-2xl font-bold font-mono text-emerald-400"
                >
                  ۲۴/۷
                </div>
                <div
                  className="text-[10px] min-[380px]:text-xs text-[#9B9B95] mt-0.5 whitespace-nowrap"
                >
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
    </section>
  );
};
