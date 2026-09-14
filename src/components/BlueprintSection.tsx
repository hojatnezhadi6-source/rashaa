import React, { useState, useEffect } from 'react';
import {
  Compass,
  Shield,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  FileCheck,
  Building2,
  Globe2,
} from 'lucide-react';
import { Language, WhyRashaPrinciple, ProcessStep } from '../types';
import { WHY_RASHA_PRINCIPLES, PROCESS_STEPS } from '../data/content';
import { TRANSLATIONS } from '../data/translations';

interface BlueprintSectionProps {
  language: Language;
  onBookConsultation: () => void;
  onExploreServices: () => void;
  whyRashaPrinciples?: WhyRashaPrinciple[];
  processSteps?: ProcessStep[];
}

export const BlueprintSection: React.FC<BlueprintSectionProps> = ({
  language,
  onBookConsultation,
  onExploreServices,
  whyRashaPrinciples = WHY_RASHA_PRINCIPLES,
  processSteps = PROCESS_STEPS,
}) => {
  const t = TRANSLATIONS[language];
  const activePrinciples = whyRashaPrinciples?.length ? whyRashaPrinciples : WHY_RASHA_PRINCIPLES;
  const activeProcessSteps = processSteps?.length ? processSteps : PROCESS_STEPS;

  const [activeTab, setActiveTab] = useState<'process' | 'principles'>('process');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [activePrincipleIndex, setActivePrincipleIndex] = useState<number>(0);

  // Auto-switch tabs if user scrolled or clicked on why-rasha vs process
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#why-rasha') {
        setActiveTab('principles');
      } else if (hash === '#process') {
        setActiveTab('process');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const activeStep = activeProcessSteps[Math.min(activeStepIndex, activeProcessSteps.length - 1)] || activeProcessSteps[0];
  const activePrinciple = activePrinciples[Math.min(activePrincipleIndex, activePrinciples.length - 1)] || activePrinciples[0];

  const getPrincipleIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Compass className="w-5 h-5 text-[#DFBA73]" />;
      case 1:
        return <Shield className="w-5 h-5 text-[#DFBA73]" />;
      case 2:
        return <Award className="w-5 h-5 text-[#DFBA73]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#DFBA73]" />;
    }
  };

  return (
    <section className="relative py-16 sm:py-20 bg-[#080909] overflow-hidden border-t border-white/[0.08]">
      {/* Anchor targets for smooth scrolling and HUD tracking */}
      <div id="process" className="absolute -top-24" />
      <div id="why-rasha" className="absolute -top-24" />

      {/* Cinematic Architectural Dusk Background with Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=80"
          alt="Architectural Backdrop"
          className="w-full h-full object-cover filter brightness-[0.14] contrast-[1.15]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080909] via-[#080909]/85 to-[#080909]" />
        <div className="absolute top-1/3 left-1/4 w-[550px] h-[550px] bg-[#C9A96A]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#C9A96A]/8 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        {/* Section Header & Tab Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/[0.08] mb-10 sm:mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#C9A96A]/10 border border-[#C9A96A]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A96A]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#E8CA8C] font-semibold font-mono">
                {language === 'fa' ? 'چارچوب جامع مهاجرت' : 'The RASHA Blueprint'}
              </span>
            </div>
            <h2
              className="text-3xl sm:text-5xl lg:text-6xl font-serif-display font-light text-[#F4F0E8] tracking-tight"
              style={{ letterSpacing: language === 'fa' || language === 'ar' ? '0' : '-0.025em' }}
            >
              {activeTab === 'process'
                ? (language === 'fa' ? 'نقشه راه ۶ مرحله‌ای تا مقصد' : t.processTitle)
                : (language === 'fa' ? 'اصول و تعهدات بنیادین راشا' : t.whyRashaTitle)}
            </h2>
            <p className="text-xs sm:text-sm text-[#9B9B95] font-sans-luxury max-w-xl font-light leading-relaxed">
              {activeTab === 'process'
                ? (language === 'fa'
                    ? 'فرایند گام‌به‌گام و استاندارد مهاجرت از ارزیابی مقدماتی تا استقرار کامل در کشور مقصد با نظارت مستقیم وکلای بین‌المللی.'
                    : t.processSubtitle)
                : (language === 'fa'
                    ? 'ارزش‌های کلیدی، شفافیت مطلق حقوقی و استانداردهای تشریفاتی که راشا را به همراهی مطمئن تبدیل می‌کند.'
                    : t.whyRashaSubtitle)}
            </p>
          </div>

          {/* Luxury Tab Switcher */}
          <div className="inline-flex p-1.5 rounded-2xl bg-[#111313]/90 border border-white/10 backdrop-blur-xl shadow-xl shrink-0">
            <button
              onClick={() => setActiveTab('process')}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'process'
                  ? 'bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] text-[#080909] shadow-lg shadow-[#C9A96A]/20'
                  : 'text-[#9B9B95] hover:text-[#F4F0E8]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{language === 'fa' ? 'نقشه راه مراحل (Roadmap)' : '6-Stage Roadmap'}</span>
            </button>
            <button
              onClick={() => setActiveTab('principles')}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'principles'
                  ? 'bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] text-[#080909] shadow-lg shadow-[#C9A96A]/20'
                  : 'text-[#9B9B95] hover:text-[#F4F0E8]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'fa' ? 'اصول راشا (Principles)' : 'Core Standards'}</span>
            </button>
          </div>
        </div>

        {/* TAB 1: 6-Stage Roadmap Content */}
        {activeTab === 'process' && (
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Step Selection Pills / Sidebar */}
            <div className="lg:col-span-5 space-y-2.5">
              {activeProcessSteps.map((step, idx) => {
                const isSelected = idx === activeStepIndex;
                return (
                  <button
                    key={step.step || idx}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`w-full text-start p-4 rounded-xl transition-all duration-300 flex items-center justify-between border cursor-pointer ${
                      isSelected
                        ? 'bg-[#181B1B] border-[#C9A96A]/60 shadow-[0_4px_25px_rgba(201,169,106,0.15)] translate-x-1 rtl:-translate-x-1'
                        : 'bg-[#111313]/60 border-white/[0.06] hover:bg-[#181B1B]/60 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md transition-colors ${
                          isSelected
                            ? 'bg-[#C9A96A] text-[#080909]'
                            : 'bg-white/[0.06] text-[#9B9B95]'
                        }`}
                      >
                        {step.step}
                      </span>
                      <div>
                        <h4
                          className={`text-sm font-semibold transition-colors ${
                            isSelected ? 'text-[#F4F0E8]' : 'text-[#D1D1C7]'
                          }`}
                        >
                          {language === 'fa' ? step.titleFarsi || step.title : step.title}
                        </h4>
                        <span className="text-[11px] text-[#9B9B95] font-light">
                          {language === 'fa' ? step.durationFarsi || step.duration : step.duration}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 rtl:rotate-180 transition-transform ${
                        isSelected ? 'text-[#C9A96A] translate-x-0.5 rtl:-translate-x-0.5' : 'text-white/20'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Active Step Deep Detail Card */}
            <div className="lg:col-span-7">
              <div className="p-7 sm:p-9 rounded-2xl bg-gradient-to-b from-[#141616] to-[#0D0F0F] border border-[#C9A96A]/30 backdrop-blur-xl shadow-2xl relative overflow-hidden space-y-6">
                <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[#C9A96A] font-mono">
                      {language === 'fa' ? `مرحله ${activeStep.step} از ۶` : `Stage ${activeStep.step} of 6`}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#F4F0E8] mt-1">
                      {language === 'fa' ? activeStep.titleFarsi || activeStep.title : activeStep.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9A96A]/10 border border-[#C9A96A]/30 text-xs text-[#DFBA73] font-mono shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{language === 'fa' ? activeStep.durationFarsi || activeStep.duration : activeStep.duration}</span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#D1D1C7] leading-relaxed font-light">
                  {language === 'fa' ? activeStep.descriptionFarsi || activeStep.description : activeStep.description}
                </p>

                {/* Key Action Details */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs uppercase tracking-wider text-[#9B9B95] font-medium block">
                    {language === 'fa' ? 'اقدامات کلیدی این مرحله:' : 'Key Actions & Deliverables:'}
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {((language === 'fa' && activeStep.detailsFarsi)
                      ? activeStep.detailsFarsi
                      : activeStep.details
                    )?.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-[#F4F0E8]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#DFBA73] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
                  <span className="text-xs text-[#9B9B95]">
                    {language === 'fa' ? 'نظارت مستقیم وکیل مهاجرتی رسمی' : 'Direct statutory lawyer oversight'}
                  </span>
                  <button
                    onClick={onBookConsultation}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] text-[#080909] font-bold text-xs rounded-xl shadow-lg shadow-[#C9A96A]/20 hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    <span>{language === 'fa' ? 'شروع مرحله ارزیابی پرونده' : 'Initiate This Stage'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 4 Core Principles Content */}
        {activeTab === 'principles' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {activePrinciples.map((principle, idx) => {
              return (
                <div
                  key={principle.number}
                  className="p-6 rounded-2xl bg-gradient-to-b from-[#141616] to-[#0E1010] border border-white/[0.08] hover:border-[#C9A96A]/50 transition-all duration-300 flex flex-col justify-between space-y-4 group hover:-translate-y-1 shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#C9A96A]/10 border border-[#C9A96A]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {getPrincipleIcon(idx)}
                      </div>
                      <span className="text-xs font-mono text-[#C9A96A]/60 font-bold">
                        {principle.number}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#F4F0E8] group-hover:text-[#DFBA73] transition-colors">
                      {language === 'fa' ? principle.titleFarsi || principle.title : principle.title}
                    </h3>
                    <p className="text-xs text-[#9B9B95] leading-relaxed font-light">
                      {language === 'fa' ? principle.descriptionFarsi || principle.description : principle.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#DFBA73]">
                    <span>{language === 'fa' ? 'تعهد رسمی راشا' : 'Statutory Guarantee'}</span>
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
