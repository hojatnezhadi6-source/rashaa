import React, { useState } from 'react';
import {
  Compass,
  Calculator,
  X,
  Sparkles,
  PlaneTakeoff,
  Award,
} from 'lucide-react';
import { Language } from '../types';
import { FreeAssessmentQuiz } from './FreeAssessmentQuiz';
import { ChanceCalculator } from './ChanceCalculator';

interface InteractiveAssessmentHubProps {
  language: Language;
  onOpenConsultation?: (prefill?: { destination?: string; message?: string }) => void;
  onNavigateToContact?: () => void;
}

export const InteractiveAssessmentHub: React.FC<InteractiveAssessmentHubProps> = ({
  language,
  onOpenConsultation,
  onNavigateToContact,
}) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'calculator'>('quiz');
  const isFa = language === 'fa' || language === 'ar';

  return (
    <section id="assessment-hub" className="relative py-16 sm:py-24 bg-[#090a0b] border-t border-b border-white/[0.08] overflow-hidden">
      {/* Cinematic Ambient Glow & Starfields */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#C9A96A]/8 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-[#C9A96A]/30 text-[#DFBA73] text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A96A]" />
            <span>{isFa ? 'سامانه هوشمند سنجش شانس و انتخاب مسیر' : 'Smart Immigration Intelligence Tools'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-display font-light text-[#F4F0E8] tracking-tight">
            {isFa ? (
              <>
                ابزارهای اختصاصی <span className="text-gold-gradient font-bold">سنجش و انتخاب مسیر مهاجرت</span>
              </>
            ) : (
              <>
                Intelligent <span className="italic text-gold-gradient">Eligibility & Scoring</span> Suite
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#9B9B95] font-sans-luxury max-w-2xl mx-auto leading-relaxed">
            {isFa
              ? 'پیش از شروع هر اقدام پرهزینه، با دو ابزار هوشمند و اختصاصی راشا مسیرهای قانونی خود را بر اساس آخرین قوانین مهاجرتی ۲۰۲۵ تحلیل و مقایسه کنید.'
              : 'Evaluate your immigration feasibility and points calculation using our proprietary assessment algorithms prior to formal legal engagement.'}
          </p>

          {/* Interactive Switcher Tabs: Test vs Calculator */}
          <div className="flex flex-col min-[540px]:inline-flex min-[540px]:flex-row p-1.5 rounded-2xl bg-[#141617] border border-white/[0.08] shadow-2xl mt-4 max-w-full w-full min-[540px]:w-auto">
            <button
              type="button"
              id="hub-tab-quiz-btn"
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center justify-center gap-2 px-4 sm:px-7 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer w-full min-[540px]:w-auto ${
                activeTab === 'quiz'
                  ? 'bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] text-[#080909] shadow-lg shadow-[#C9A96A]/25'
                  : 'text-[#A8A8A0] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <PlaneTakeoff className="w-4 h-4 shrink-0" />
              <span>{isFa ? '۱. تست هوشمند مسیر مناسب مهاجرت' : '1. Free Immigration Quiz'}</span>
            </button>

            <button
              type="button"
              id="hub-tab-calc-btn"
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center justify-center gap-2 px-4 sm:px-7 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer w-full min-[540px]:w-auto ${
                activeTab === 'calculator'
                  ? 'bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] text-[#080909] shadow-lg shadow-[#C9A96A]/25'
                  : 'text-[#A8A8A0] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Calculator className="w-4 h-4 shrink-0" />
              <span>{isFa ? '۲. محاسبه‌گر امتیاز شانس مهاجرت' : '2. Chance Points Calculator'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Tool Display */}
        <div className="mt-4">
          {activeTab === 'quiz' ? (
            <FreeAssessmentQuiz
              language={language}
              onOpenConsultation={onOpenConsultation}
              onNavigateToContact={onNavigateToContact}
            />
          ) : (
            <ChanceCalculator
              language={language}
              onOpenConsultation={onOpenConsultation}
              onNavigateToContact={onNavigateToContact}
            />
          )}
        </div>
      </div>
    </section>
  );
};
