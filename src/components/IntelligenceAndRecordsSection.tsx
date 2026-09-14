import React, { useState, useEffect } from 'react';
import {
  Award,
  BookOpen,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Clock,
  MapPin,
  CheckCircle,
  Calendar,
  X,
  Share2,
} from 'lucide-react';
import { Language, CaseStudy, JournalArticle } from '../types';
import { CASE_STUDIES, JOURNAL_ARTICLES } from '../data/content';
import { TRANSLATIONS } from '../data/translations';

interface IntelligenceAndRecordsSectionProps {
  language: Language;
  caseStudies?: CaseStudy[];
  journalArticles?: JournalArticle[];
  onBookConsultation: () => void;
}

export const IntelligenceAndRecordsSection: React.FC<IntelligenceAndRecordsSectionProps> = ({
  language,
  caseStudies = CASE_STUDIES,
  journalArticles = JOURNAL_ARTICLES,
  onBookConsultation,
}) => {
  const t = TRANSLATIONS[language];
  const activeCaseStudies = caseStudies?.length ? caseStudies : CASE_STUDIES;
  const activeArticles = journalArticles?.length ? journalArticles : JOURNAL_ARTICLES;

  const [activeTab, setActiveTab] = useState<'cases' | 'journal'>('cases');
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(null);

  // Auto-switch tab if navigated via URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#journal') {
        setActiveTab('journal');
      } else if (hash === '#case-studies') {
        setActiveTab('cases');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <section className="relative py-16 sm:py-20 bg-[#080909] overflow-hidden border-t border-white/[0.08]">
      {/* Anchor targets for seamless scroll links */}
      <div id="case-studies" className="absolute -top-24" />
      <div id="journal" className="absolute -top-24" />

      {/* Cinematic Background Backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2200&q=80"
          alt="London At Dusk"
          className="w-full h-full object-cover filter brightness-[0.12] contrast-[1.12]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080909] via-[#080909]/85 to-[#080909]" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#C9A96A]/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        {/* Section Header & Tab Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/[0.08] mb-10 sm:mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#C9A96A]/10 border border-[#C9A96A]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A96A]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#E8CA8C] font-semibold font-mono">
                {language === 'fa' ? 'نتایج مستند و تحلیل‌های حقوقی' : 'Verified Records & Intelligence'}
              </span>
            </div>
            <h2
              className="text-3xl sm:text-5xl lg:text-6xl font-serif-display font-light text-[#F4F0E8] tracking-tight"
              style={{ letterSpacing: language === 'fa' || language === 'ar' ? '0' : '-0.025em' }}
            >
              {activeTab === 'cases'
                ? (language === 'fa' ? 'پرونده‌های موفق و نتایج مراجعین' : t.caseStudiesTitle)
                : (language === 'fa' ? 'ژورنال و تحلیل سیاست‌های مهاجرت' : t.journalTitle)}
            </h2>
            <p className="text-xs sm:text-sm text-[#9B9B95] font-sans-luxury max-w-xl font-light leading-relaxed">
              {activeTab === 'cases'
                ? (language === 'fa'
                    ? 'مروری بر پرونده‌های حل‌شده در مسیرهای اقامت، کار، تخصص و سرمایه‌گذاری با حفظ کامل حریم خصوصی مراجعین.'
                    : t.caseStudiesSubtitle)
                : (language === 'fa'
                    ? 'تحلیل‌های عمیق حقوقی و گزارش‌های اختصاصی از آخرین مصوبات اداره مهاجرت کشورهای پیشرو.'
                    : t.journalSubtitle)}
            </p>
          </div>

          {/* Luxury Tab Switcher */}
          <div className="inline-flex p-1.5 rounded-2xl bg-[#111313]/90 border border-white/10 backdrop-blur-xl shadow-xl shrink-0">
            <button
              onClick={() => setActiveTab('cases')}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'cases'
                  ? 'bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] text-[#080909] shadow-lg shadow-[#C9A96A]/20'
                  : 'text-[#9B9B95] hover:text-[#F4F0E8]'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{language === 'fa' ? 'پرونده‌های موفق (Cases)' : 'Case Records'}</span>
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'journal'
                  ? 'bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] text-[#080909] shadow-lg shadow-[#C9A96A]/20'
                  : 'text-[#9B9B95] hover:text-[#F4F0E8]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{language === 'fa' ? 'ژورنال تحلیلی (Journal)' : 'Advisory Journal'}</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Case Studies Grid */}
        {activeTab === 'cases' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {activeCaseStudies.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedCase(item)}
                className="p-5 rounded-2xl bg-gradient-to-b from-[#141616] to-[#0E1010] border border-white/[0.08] hover:border-[#C9A96A]/50 transition-all duration-300 flex flex-col justify-between space-y-4 group hover:-translate-y-1 shadow-lg cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#DFBA73] px-2 py-0.5 rounded bg-[#C9A96A]/10 border border-[#C9A96A]/20">
                      {language === 'fa' ? item.durationFarsi || item.duration : item.duration}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      ✓ {language === 'fa' ? item.outcomeFarsi || item.outcome : item.outcome}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#F4F0E8] group-hover:text-[#DFBA73] transition-colors line-clamp-1">
                      {language === 'fa' ? item.titleFarsi || item.title : item.title}
                    </h3>
                    <p className="text-xs text-[#C9A96A] mt-0.5 font-medium">
                      {language === 'fa' ? item.destinationFarsi || item.destination : item.destination}
                    </p>
                  </div>

                  <p className="text-xs text-[#9B9B95] line-clamp-3 leading-relaxed font-light">
                    {language === 'fa' ? item.strategyFarsi || item.strategy : item.strategy}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#DFBA73]">
                  <span>{language === 'fa' ? 'مشاهده استراتژی پرونده' : 'View Strategy'}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: Journal Articles Grid */}
        {activeTab === 'journal' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeArticles.slice(0, 3).map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="rounded-2xl bg-gradient-to-b from-[#141616] to-[#0E1010] border border-white/[0.08] hover:border-[#C9A96A]/50 overflow-hidden transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-lg cursor-pointer"
              >
                <div className="relative h-44 w-full overflow-hidden bg-black">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.75]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1010] via-transparent to-black/40" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-[#DFBA73] border border-[#C9A96A]/30">
                    {language === 'fa' ? article.categoryFarsi || article.category : article.category}
                  </span>
                  <span className="absolute bottom-2.5 left-3 text-[10px] text-white/70 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {language === 'fa' ? article.readTimeFarsi || article.readTime : article.readTime}
                  </span>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[11px] text-[#9B9B95] block">
                      {language === 'fa' ? article.dateFarsi || article.date : article.date}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[#F4F0E8] group-hover:text-[#DFBA73] transition-colors line-clamp-2 leading-snug">
                      {language === 'fa' ? article.titleFarsi || article.title : article.title}
                    </h3>
                    <p className="text-xs text-[#9B9B95] line-clamp-2 leading-relaxed font-light">
                      {language === 'fa' ? article.excerptFarsi || article.excerpt : article.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#DFBA73]">
                    <span>{language === 'fa' ? 'مطالعه تحلیل کامل' : 'Read Full Analysis'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Case Study Deep Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#111313] border border-[#C9A96A]/50 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs text-[#C9A96A] font-mono block">
                  {language === 'fa' ? selectedCase.destinationFarsi || selectedCase.destination : selectedCase.destination}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#F4F0E8] mt-1">
                  {language === 'fa' ? selectedCase.titleFarsi || selectedCase.title : selectedCase.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] text-[#9B9B95] block mb-1">نتیجه نهایی:</span>
                <span className="text-emerald-400 font-bold">
                  {language === 'fa' ? selectedCase.outcomeFarsi || selectedCase.outcome : selectedCase.outcome}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] text-[#9B9B95] block mb-1">مدت زمان پردازش:</span>
                <span className="text-[#DFBA73] font-bold font-mono">
                  {language === 'fa' ? selectedCase.durationFarsi || selectedCase.duration : selectedCase.duration}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#F4F0E8] flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#C9A96A]" />
                استراتژی و راهکار اجرایی راشا:
              </h4>
              <p className="text-[#D1D1C7] leading-relaxed font-light p-3.5 rounded-xl bg-[#161818] border border-white/[0.06]">
                {language === 'fa' ? selectedCase.strategyFarsi || selectedCase.strategy : selectedCase.strategy}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedCase(null);
                  onBookConsultation();
                }}
                className="flex-1 py-3 bg-[#C9A96A] hover:bg-[#DFBA73] text-[#080909] font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                {language === 'fa' ? 'درخواست ارزیابی مشابه برای پرونده من' : 'Request Similar Profile Assessment'}
              </button>
              <button
                onClick={() => setSelectedCase(null)}
                className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white text-xs rounded-xl cursor-pointer"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Journal Article Deep Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#111313] border border-[#C9A96A]/50 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs text-[#C9A96A] font-mono block">
                  {language === 'fa' ? selectedArticle.categoryFarsi || selectedArticle.category : selectedArticle.category} | {selectedArticle.dateFarsi || selectedArticle.date}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#F4F0E8] mt-1 leading-snug">
                  {language === 'fa' ? selectedArticle.titleFarsi || selectedArticle.title : selectedArticle.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-sm text-[#D1D1C7] leading-relaxed font-light">
                {language === 'fa' ? selectedArticle.excerptFarsi || selectedArticle.excerpt : selectedArticle.excerpt}
              </p>

              {((language === 'fa' && selectedArticle.contentFarsi) ? selectedArticle.contentFarsi : selectedArticle.content)?.map((par, i) => (
                <p key={i} className="text-[#9B9B95] leading-relaxed font-light">
                  {par}
                </p>
              ))}

              {/* Key Takeaways */}
              <div className="p-4 rounded-xl bg-black/40 border border-[#C9A96A]/20 space-y-2 mt-4">
                <span className="text-xs font-bold text-[#DFBA73] block">نکات حقوقی کلیدی:</span>
                <div className="space-y-1.5">
                  {((language === 'fa' && selectedArticle.keyTakeawaysFarsi) ? selectedArticle.keyTakeawaysFarsi : selectedArticle.keyTakeaways)?.map((point, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#F4F0E8]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96A] shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedArticle(null);
                  onBookConsultation();
                }}
                className="flex-1 py-3 bg-[#C9A96A] hover:bg-[#DFBA73] text-[#080909] font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                مشاوره درباره قوانین این مقاله
              </button>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white text-xs rounded-xl cursor-pointer"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
