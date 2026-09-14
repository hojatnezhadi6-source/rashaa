import React, { useState } from 'react';
import { BookOpen, Clock, ArrowRight, X, Sparkles, Share2 } from 'lucide-react';
import { JournalArticle, Language } from '../types';
import { JOURNAL_ARTICLES } from '../data/content';
import { TRANSLATIONS } from '../data/translations';

interface JournalSectionProps {
  language: Language;
  onBookConsultation: () => void;
  journalArticles?: JournalArticle[];
}

export const JournalSection: React.FC<JournalSectionProps> = ({
  language,
  onBookConsultation,
  journalArticles = JOURNAL_ARTICLES,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');

  const activeArticles = journalArticles?.length ? journalArticles : JOURNAL_ARTICLES;

  const categories = ['All', 'Global Policy', 'Family & Living', 'Skilled Migration', 'Remote & Tech', 'Investment & Capital'];

  const filteredArticles = activeTab === 'All'
    ? activeArticles
    : activeArticles.filter((a) => a.category === activeTab);

  return (
    <section id="journal" className="py-28 sm:py-36 bg-[#080909] relative overflow-hidden border-t border-white/[0.06]">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#C9A96A]/8 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8 mb-12 sm:mb-16">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#C9A96A]/10 border border-[#C9A96A]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A96A]" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#E8CA8C] font-semibold font-mono">Policy &amp; Mobility Intelligence</span>
            </div>
            <h2
              className="text-4xl sm:text-6xl lg:text-7xl font-serif-display font-light text-[#F4F0E8] tracking-tight"
              style={{ letterSpacing: language === 'fa' || language === 'ar' ? '0' : '-0.03em' }}
            >
              {t.journalTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#9B9B95] font-sans-luxury max-w-xl leading-relaxed font-light">
              {t.journalSubtitle}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
            {categories.map((cat) => {
              const catFarsi: Record<string, string> = {
                All: 'همه مقالات',
                'Global Policy': 'سیاست‌های مهاجرتی',
                'Family & Living': 'اقامت خانوادگی',
                'Skilled Migration': 'مهاجرت کاری',
                'Remote & Tech': 'دیجیتال و فناوری',
                'Investment & Capital': 'سرمایه‌گذاری',
              };
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.16em] font-sans-luxury rounded-full transition-all duration-300 cursor-pointer ${
                    activeTab === cat
                      ? 'bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] text-[#080909] font-bold shadow-[0_0_20px_rgba(201,169,106,0.35)]'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-[#9B9B95] hover:text-[#F4F0E8] border border-white/[0.08]'
                  }`}
                >
                  {language === 'fa' && catFarsi[cat] ? catFarsi[cat] : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Editorial Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              id={`journal-article-${article.id}`}
              onClick={() => setSelectedArticle(article)}
              className="group cursor-pointer flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[#111313] border border-white/[0.08] hover:border-[#C9A96A]/60 shadow-lg hover:shadow-[0_20px_45px_rgba(0,0,0,0.8),0_0_30px_rgba(201,169,106,0.2)] hover:-translate-y-1.5 transition-all duration-500"
            >
              <div className="space-y-4">
                {/* Meta Header */}
                <div className="flex items-center justify-between text-[11px] font-mono text-[#9B9B95]">
                  <span className="uppercase text-[#E8CA8C] tracking-wider px-2.5 py-1 rounded-full bg-[#080909] border border-[#C9A96A]/20">
                    {language === 'fa' && article.categoryFarsi ? article.categoryFarsi : article.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[#9B9B95]">
                    <Clock className="w-3 h-3 text-[#C9A96A]" />
                    <span>{language === 'fa' && article.readTimeFarsi ? article.readTimeFarsi : article.readTime}</span>
                  </div>
                </div>

                {/* Article Title */}
                <h3 className="text-2xl font-serif-display font-medium text-[#F4F0E8] group-hover:text-gold-gradient transition-all leading-snug">
                  {language === 'fa' && article.titleFarsi ? article.titleFarsi : article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs sm:text-sm text-[#B3B3AB] font-sans-luxury leading-relaxed line-clamp-3">
                  {language === 'fa' && article.excerptFarsi ? article.excerptFarsi : article.excerpt}
                </p>
              </div>

              {/* Footer Author & Read Link */}
              <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between text-xs">
                <span className="text-[#9B9B95] font-mono">
                  {language === 'fa' && article.dateFarsi ? article.dateFarsi : article.date}
                </span>
                <span className="text-[#E8CA8C] uppercase tracking-wider font-semibold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>{language === 'fa' ? 'مطالعه تحلیل اختصاصی' : 'Read Analysis'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C9A96A]" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Reader Modal */}
      {selectedArticle && (
        <div
          id="journal-reader-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#080909]/92 backdrop-blur-xl animate-in fade-in duration-300"
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#111313] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-10 no-scrollbar">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 p-2 text-[#9B9B95] hover:text-[#F4F0E8] bg-[#080909] rounded-full border border-white/10 transition-colors z-20 cursor-pointer"
              aria-label="Close reader"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-xs font-mono text-[#C9A96A]">
                <span className="uppercase tracking-widest">
                  {language === 'fa' && selectedArticle.categoryFarsi ? selectedArticle.categoryFarsi : selectedArticle.category}
                </span>
                <span>•</span>
                <span>{language === 'fa' && selectedArticle.readTimeFarsi ? selectedArticle.readTimeFarsi : selectedArticle.readTime}</span>
                <span>•</span>
                <span>{language === 'fa' && selectedArticle.dateFarsi ? selectedArticle.dateFarsi : selectedArticle.date}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-serif-display font-medium text-[#F4F0E8] leading-tight">
                {language === 'fa' && selectedArticle.titleFarsi ? selectedArticle.titleFarsi : selectedArticle.title}
              </h2>

              <p className="text-sm sm:text-base text-[#C9A96A] font-serif-display italic border-l-2 border-[#C9A96A] pl-4">
                "{language === 'fa' && selectedArticle.excerptFarsi ? selectedArticle.excerptFarsi : selectedArticle.excerpt}"
              </p>

              <div className="text-sm text-[#F4F0E8]/90 font-sans-luxury leading-relaxed space-y-4 pt-4 border-t border-white/[0.08]">
                {language === 'fa' && selectedArticle.contentFarsi ? (
                  selectedArticle.contentFarsi.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))
                ) : (
                  selectedArticle.content?.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  )) || (
                    <>
                      <p>
                        As global immigration policies evolve rapidly across key OECD and Commonwealth nations, traditional mobility pathways are being superseded by targeted talent frameworks, sovereign wealth programs, and bilateral economic accords.
                      </p>
                      <p>
                        For individuals and business families seeking cross-border diversification, strategic timing and jurisdictional selection are critical. At RASHA MOHAJERAT, our global desks monitor quota shifts, labor market benchmarks, and legislative revisions to structure applications with maximum legal leverage.
                      </p>
                    </>
                  )
                )}
              </div>

              {/* Key Takeaways Box */}
              <div className="p-5 rounded-xl bg-[#080909] border border-white/[0.08] space-y-3">
                <span className="text-xs uppercase tracking-widest text-[#C9A96A] font-semibold block">
                  {language === 'fa' ? 'نکات کلیدی و راهبردی پرونده' : 'Strategic Briefing Takeaways'}
                </span>
                <div className="space-y-2 text-xs text-[#9B9B95]">
                  {(language === 'fa' && selectedArticle.keyTakeawaysFarsi
                    ? selectedArticle.keyTakeawaysFarsi
                    : selectedArticle.keyTakeaways || [
                        'Focus on STEM, healthcare, and high-value entrepreneurship streams.',
                        'Language benchmarks and credential equivalencies must be secured early.',
                        'Dual-track applications minimize policy exposure risk.',
                      ]
                  ).map((takeaway, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96A] flex-shrink-0" />
                      <span className="text-[#F4F0E8]/90">{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-[#9B9B95]">
                  {language === 'fa'
                    ? 'نیاز به ارزیابی تخصصی شرایط شما در این زمینه دارید؟'
                    : 'Need strategic counsel on this topic for your file?'}
                </span>
                <button
                  onClick={() => {
                    setSelectedArticle(null);
                    onBookConsultation();
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-[#C9A96A] hover:bg-[#b89758] text-[#080909] text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer"
                >
                  {language === 'fa' ? 'رزرو جلسه مشاوره اختصاصی' : 'Schedule Private Advisory Session'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
