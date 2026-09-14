import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { Language, ProcessStep } from '../types';
import { PROCESS_STEPS } from '../data/content';
import { TRANSLATIONS } from '../data/translations';

interface ProcessSectionProps {
  language: Language;
  onBookConsultation: () => void;
  processSteps?: ProcessStep[];
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({
  language,
  onBookConsultation,
  processSteps = PROCESS_STEPS,
}) => {
  const t = TRANSLATIONS[language];
  const activeProcessSteps = processSteps?.length ? processSteps : PROCESS_STEPS;
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeStep = activeProcessSteps[Math.min(activeStepIndex, activeProcessSteps.length - 1)] || activeProcessSteps[0];

  return (
    <section id="process" className="py-28 sm:py-36 bg-[#080909] relative overflow-hidden border-t border-white/[0.06]">
      {/* Background Ambience */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#C9A96A]/8 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <div className="max-w-4xl mb-16 sm:mb-20 space-y-3">
          <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#C9A96A]/10 border border-[#C9A96A]/30">
            <span className="w-2 h-2 rounded-full bg-[#C9A96A] animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#E8CA8C] font-semibold font-mono">Strategic Roadmap</span>
          </div>
          <h2
            className="text-4xl sm:text-6xl lg:text-7xl font-serif-display font-light text-[#F4F0E8] tracking-tight"
            style={{ letterSpacing: language === 'fa' || language === 'ar' ? '0' : '-0.03em' }}
          >
            {t.processTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#9B9B95] font-sans-luxury max-w-2xl leading-relaxed font-light">
            {t.processSubtitle}
          </p>
        </div>

        {/* Timeline Interactive Progress Bar (Desktop & Tablet) */}
        <div className="relative mb-14">
          {/* Background Grey Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/[0.08] -translate-y-1/2 hidden md:block" />

          {/* Progressive Glowing Gold Line */}
          <div
            className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] -translate-y-1/2 transition-all duration-500 hidden md:block shadow-[0_0_15px_rgba(201,169,106,0.8)]"
            style={{ width: `${(activeStepIndex / Math.max(1, activeProcessSteps.length - 1)) * 100}%` }}
          />

          {/* 6 Milestone Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 relative z-10">
            {activeProcessSteps.map((step, index) => {
              const isActive = index === activeStepIndex;
              const isCompleted = index < activeStepIndex;

              return (
                <button
                  key={step.step}
                  id={`process-node-${index}`}
                  onClick={() => setActiveStepIndex(index)}
                  className={`group flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-b from-[#181a1a] to-[#111313] border-[#C9A96A] shadow-[0_0_30px_rgba(201,169,106,0.25)] -translate-y-1'
                      : isCompleted
                      ? 'bg-[#111313] border-white/20 text-[#F4F0E8] hover:border-[#C9A96A]/40'
                      : 'bg-white/[0.02] border-white/[0.06] text-[#9B9B95] hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-mono mb-2.5 transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] text-[#080909] font-bold shadow-[0_0_15px_rgba(201,169,106,0.6)]'
                        : isCompleted
                        ? 'bg-white/10 text-[#E8CA8C]'
                        : 'bg-white/[0.04] text-[#9B9B95] group-hover:text-[#F4F0E8]'
                    }`}
                  >
                    {step.step}
                  </div>

                  <span className={`text-xs font-serif-display font-medium ${isActive ? 'text-[#F4F0E8]' : 'text-[#9B9B95]'}`}>
                    {language === 'fa' && step.titleFarsi ? step.titleFarsi : step.title}
                  </span>
                  <span className="text-[10px] text-[#9B9B95] mt-0.5 font-mono">
                    {language === 'fa' && step.durationFarsi ? step.durationFarsi : step.duration}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Step Detailed View Card */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#111313] border border-white/15 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(201,169,106,0.12)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A96A]/8 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#C9A96A] px-2.5 py-1 rounded bg-[#080909] border border-white/[0.08]">
                  {language === 'fa' ? `مرحله ${activeStep.step} از ۰۶` : `Stage ${activeStep.step} / 06`}
                </span>
                <span className="text-xs text-[#9B9B95] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C9A96A]" />
                  <span>{language === 'fa' && activeStep.durationFarsi ? activeStep.durationFarsi : activeStep.duration}</span>
                </span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-serif-display font-medium text-[#F4F0E8]">
                {language === 'fa' && activeStep.titleFarsi ? activeStep.titleFarsi : activeStep.title}
              </h3>

              <p className="text-sm sm:text-base text-[#9B9B95] font-sans-luxury leading-relaxed max-w-xl">
                {language === 'fa' && activeStep.descriptionFarsi ? activeStep.descriptionFarsi : activeStep.description}
              </p>

              <div className="space-y-2.5 pt-2">
                <span className="text-xs uppercase tracking-wider text-[#C9A96A] block font-medium">
                  {language === 'fa' ? 'دستاوردهای کلیدی و اقدامات اجرایی:' : 'Deliverables & Execution:'}
                </span>
                <div className="grid sm:grid-cols-2 gap-2">
                  {(language === 'fa' && activeStep.detailsFarsi ? activeStep.detailsFarsi : activeStep.details).map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#F4F0E8]/90">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A96A] flex-shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center space-y-4 pt-4 lg:pt-0 lg:border-l lg:border-white/[0.08] lg:pl-10">
              <div className="p-5 rounded-xl bg-[#080909] border border-white/[0.06] w-full text-left">
                <span className="text-[11px] text-[#9B9B95] uppercase block mb-1">
                  {language === 'fa' ? 'نظارت عالیه و انطباق حقوقی' : 'Advisory Governance'}
                </span>
                <p className="text-xs text-[#F4F0E8] leading-relaxed">
                  {language === 'fa'
                    ? 'تمامی مراحل پرونده زیر نظر وکلای رسمی و استراتژیست‌های ارشد مهاجرت پایش می‌شود تا صحت کامل مدارک قبل از ثبت تضمین گردد.'
                    : 'Every stage is monitored by a senior licensed partner to guarantee legal fidelity before submission.'}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full">
                {activeStepIndex < PROCESS_STEPS.length - 1 ? (
                  <button
                    onClick={() => setActiveStepIndex((prev) => prev + 1)}
                    className="w-full py-3 bg-[#181a1a] hover:bg-[#202323] text-[#F4F0E8] border border-white/10 rounded-lg text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{language === 'fa' ? 'مرحله بعد' : 'Next Milestone'}</span>
                    <ChevronRight className="w-4 h-4 text-[#C9A96A]" />
                  </button>
                ) : (
                  <button
                    onClick={onBookConsultation}
                    className="w-full py-3 bg-[#C9A96A] hover:bg-[#b89758] text-[#080909] rounded-lg text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{language === 'fa' ? 'شروع مرحله اول' : 'Initiate Stage 01'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
