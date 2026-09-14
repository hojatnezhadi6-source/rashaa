import React from 'react';
import { Scale, Award, ArrowRight, ShieldCheck, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Language } from '../types';

interface ExecutivePortalsBarProps {
  language: Language;
  onOpenServices: () => void;
  onOpenCases: () => void;
  onOpenAssessmentHub?: (tab?: 'quiz' | 'calculator') => void;
}

export const ExecutivePortalsBar: React.FC<ExecutivePortalsBarProps> = ({
  language,
  onOpenServices,
  onOpenCases,
  onOpenAssessmentHub,
}) => {
  return (
    <section className="relative py-8 bg-[#090b0b] border-t border-white/[0.08] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-[#C9A96A]/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-[#C9A96A]/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        {/* Top Quick Access Ribbon for Immigration Quiz & Chance Calculator */}
        {onOpenAssessmentHub && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#DFBA73]/15 via-[#181a1b] to-[#101212] border border-[#DFBA73]/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#DFBA73]/20 border border-[#DFBA73]/40 text-[#DFBA73] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#DFBA73]" />
              </div>
              <div className="text-right rtl:text-right ltr:text-left">
                <div className="text-xs sm:text-sm font-bold text-[#F4F0E8]">
                  {language === 'fa' ? '«مسیر مناسب مهاجرتت رو پیدا کن ✈️» و محاسبه‌گر آنلاین شانس ویزا' : 'Find Your Immigration Pathway & Calculate Points'}
                </div>
                <div className="text-[11px] text-[#A8A8A0]">
                  {language === 'fa' ? 'تست چندمرحله‌ای تخصصی + محاسبه دقیق امتیازات بر اساس آخرین قوانین مهاجرتی' : 'Multistep assessment quiz & points calculator across Canada, Germany, Australia & UAE'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                id="portal-quick-quiz-btn"
                onClick={() => onOpenAssessmentHub('quiz')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] text-[#080909] text-xs font-bold hover:scale-105 transition-all shadow-md cursor-pointer"
              >
                {language === 'fa' ? 'شروع تست رایگان' : 'Start Free Test'}
              </button>
              <button
                type="button"
                id="portal-quick-calc-btn"
                onClick={() => onOpenAssessmentHub('calculator')}
                className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#F4F0E8] border border-white/10 text-xs font-semibold transition-all cursor-pointer"
              >
                {language === 'fa' ? 'محاسبه‌گر شانس' : 'Points Calculator'}
              </button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          {/* Card 1: Services & Practice Areas Portal */}
          <div
            id="portal-services-card"
            onClick={onOpenServices}
            className="group relative p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#131616]/90 via-[#101212]/95 to-[#0b0c0c] border border-white/[0.08] hover:border-[#C9A96A]/60 shadow-xl hover:shadow-[0_15px_35px_-10px_rgba(201,169,106,0.25)] transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 hover:-translate-y-1"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#181a1a] border border-white/10 text-[#DFBA73] group-hover:border-[#C9A96A]/60 group-hover:bg-[#C9A96A]/15 group-hover:shadow-[0_0_20px_rgba(201,169,106,0.3)] transition-all duration-300 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A96A]/10 border border-[#C9A96A]/30 text-[11px] text-[#E8CA8C] font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#DFBA73]" />
                  <span>{language === 'fa' ? '۶ حوزه وکالت رسمی' : '6 Practice Areas'}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-serif-display font-light text-[#F4F0E8] group-hover:text-gold-gradient transition-colors">
                  {language === 'fa' ? 'حوزه‌های تخصصی وکالت راشا' : 'Specialized Legal Scopes'}
                </h3>
                <p className="text-xs text-[#9B9B95] font-sans-luxury mt-1.5 leading-relaxed font-light">
                  {language === 'fa'
                    ? 'مشاهده چارچوب‌های رسمی سرمایه‌گذاری، استارتاپ، تمکن مالی، تلنت ویزا و اقامت دائم در پرتال تخصصی.'
                    : 'Explore statutory investor programs, startup visas, talent pathways, and global permanent residency.'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-[#DFBA73] font-medium group-hover:text-[#F4F0E8] transition-colors">
                {language === 'fa' ? 'ورود به پرتال خدمات و شروط وکالت' : 'Access Practice Areas Portal'}
              </span>
              <div className="w-8 h-8 rounded-full bg-white/[0.06] group-hover:bg-[#C9A96A] group-hover:text-[#080909] flex items-center justify-center transition-all duration-300">
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </div>
            </div>
          </div>

          {/* Card 2: Verified Client Records & Cases Dossier */}
          <div
            id="portal-cases-card"
            onClick={onOpenCases}
            className="group relative p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#131616]/90 via-[#101212]/95 to-[#0b0c0c] border border-white/[0.08] hover:border-[#C9A96A]/60 shadow-xl hover:shadow-[0_15px_35px_-10px_rgba(201,169,106,0.25)] transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 hover:-translate-y-1"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#181a1a] border border-white/10 text-[#DFBA73] group-hover:border-[#C9A96A]/60 group-hover:bg-[#C9A96A]/15 group-hover:shadow-[0_0_20px_rgba(201,169,106,0.3)] transition-all duration-300 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-300 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'fa' ? '۹۸.۴٪ موفقیت پرونده‌ها' : '98.4% Success Rate'}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-serif-display font-light text-[#F4F0E8] group-hover:text-gold-gradient transition-colors">
                  {language === 'fa' ? 'تالار پرونده‌های موفق و نتایج مراجعین' : 'Verified Client Case Records'}
                </h3>
                <p className="text-xs text-[#9B9B95] font-sans-luxury mt-1.5 leading-relaxed font-light">
                  {language === 'fa'
                    ? 'بررسی تجربیات مستند، استراتژی‌های حقوقی اتخاذ شده، مدت‌زمان پردازش و نتایج ویزای مراجعین قبلی.'
                    : 'Review documented case histories, legal strategies, processing timelines, and approved outcomes.'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-[#DFBA73] font-medium group-hover:text-[#F4F0E8] transition-colors">
                {language === 'fa' ? 'مشاهده آرشیو پرونده‌های موفق' : 'Browse Case Records Dossier'}
              </span>
              <div className="w-8 h-8 rounded-full bg-white/[0.06] group-hover:bg-[#C9A96A] group-hover:text-[#080909] flex items-center justify-center transition-all duration-300">
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
