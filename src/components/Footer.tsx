import React from 'react';
import { ArrowUp, Globe, Shield, Sparkles, MapPin, Mail, Phone } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FooterProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (sectionId: string) => void;
  onOpenAi: () => void;
  onOpenAdmin?: () => void;
  onOpenServices?: () => void;
  onOpenCases?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onLanguageChange,
  onNavigate,
  onOpenAi,
  onOpenAdmin,
  onOpenServices,
  onOpenCases,
}) => {
  const t = TRANSLATIONS[language];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050606] text-[#9B9B95] border-t border-white/[0.08] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Top Tier: Brand Statement & Global Desks */}
        <div className="grid lg:grid-cols-12 gap-12 pb-16 border-b border-white/[0.08]">
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-1">
              <div className="text-2xl font-light text-[#F4F0E8] tracking-[0.28em] block">
                RASHA <span className="opacity-50">MOHAJERAT</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#C9A96A] block font-mono">
                {t.brandTagline || 'Global Mobility Consultancy'}
              </div>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed max-w-md font-sans-luxury text-[#9B9B95] font-light">
              {language === 'fa'
                ? 'راهکارهای راهبردی مهاجرت بین‌المللی و مشاوره تخصصی اقامت و شهروندی برای نخبگان علمی، کارآفرینان و خانواده‌های جویای آینده جهانی.'
                : 'Strategic immigration solutions and sovereign citizenship advisory for high-achieving professionals, entrepreneurs, and global families.'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onOpenAi}
                className="px-4 py-2 bg-[#111313] border border-[#C9A96A]/40 text-[#F4F0E8] text-[11px] uppercase tracking-[0.16em] flex items-center gap-2 hover:border-[#C9A96A] hover:bg-[#181a1a] transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C9A96A]" />
                <span>{t.rashaAiTitle}</span>
              </button>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-sans-luxury">
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#F4F0E8] font-semibold block">
                {language === 'fa' ? 'مقاصد برتر' : 'Destinations'}
              </span>
              <ul className="space-y-2 text-[#9B9B95]">
                {[
                  { en: 'Canada', fa: 'کانادا' },
                  { en: 'United Kingdom', fa: 'بریتانیا (انگلستان)' },
                  { en: 'Australia', fa: 'استرالیا' },
                  { en: 'United States', fa: 'ایالات متحده آمریکا' },
                  { en: 'Germany', fa: 'آلمان' },
                  { en: 'Portugal & Spain', fa: 'پرتغال و اسپانیا' },
                  { en: 'UAE (Dubai)', fa: 'امارات (دبی)' },
                ].map((dest) => (
                  <li key={dest.en}>
                    <button
                      onClick={() => onNavigate('destinations')}
                      className="hover:text-[#C9A96A] transition-colors text-left cursor-pointer"
                    >
                      {language === 'fa' ? dest.fa : dest.en}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#F4F0E8] font-semibold block">
                {language === 'fa' ? 'خدمات تخصصی' : 'Practice Areas'}
              </span>
              <ul className="space-y-2 text-[#9B9B95]">
                {[
                  { en: 'Skilled & Tech Migration', fa: 'مهاجرت کاری و نیروی ماهر' },
                  { en: 'Study Abroad & PR', fa: 'تحصیل و اقامت دائم' },
                  { en: 'Investment & Golden Visas', fa: 'سرمایه‌گذاری و ویزای طلایی' },
                  { en: 'Residency by Investment', fa: 'اقامت تمکن مالی و کارآفرینی' },
                  { en: 'Citizenship Programs', fa: 'تابعیت و پاسپورت دوم' },
                  { en: 'Family Sponsorship', fa: 'اسپانسرشیپ خانواده' },
                ].map((serv) => (
                  <li key={serv.en}>
                    <button
                      onClick={() => (onOpenServices ? onOpenServices() : onNavigate('services'))}
                      className="hover:text-[#C9A96A] transition-colors text-left cursor-pointer"
                    >
                      {language === 'fa' ? serv.fa : serv.en}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#F4F0E8] font-semibold block">
                {language === 'fa' ? 'بخش‌های راهبردی' : 'Intelligence'}
              </span>
              <ul className="space-y-2 text-[#9B9B95]">
                <li>
                  <button
                    onClick={() => (onOpenCases ? onOpenCases() : onNavigate('contact'))}
                    className="hover:text-[#C9A96A] transition-colors cursor-pointer"
                  >
                    {language === 'fa' ? 'آرشیو پرونده‌های موفق' : 'Case Records Dossier'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => (onOpenServices ? onOpenServices() : onNavigate('destinations'))}
                    className="hover:text-[#C9A96A] transition-colors cursor-pointer"
                  >
                    {language === 'fa' ? 'حوزه‌های تخصصی وکالت' : 'Practice Areas Portal'}
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('contact')} className="hover:text-[#C9A96A] transition-colors cursor-pointer">
                    {language === 'fa' ? 'رزرو مشاوره اختصاصی' : 'Private Client Desk'}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] text-[#9B9B95]/70">
          <p className="max-w-2xl leading-relaxed">
            {language === 'fa'
              ? 'راشا مهاجرت؛ همراه شما در برنامه‌ریزی دقیق، انتخاب بهترین مقصد و اخذ اقامت با همکاری مشاوران و وکلای رسمی مهاجرتی.'
              : 'RASHA MOHAJERAT provides strategic global mobility guidance, helping applicants select optimal pathways in compliance with statutory immigration regulations.'}
          </p>

          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} راشا مهاجرت. {language === 'fa' ? 'تمامی حقوق محفوظ است.' : 'All rights reserved.'}</span>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hover:text-[#C9A96A] text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer border border-white/10 px-2.5 py-1 rounded"
              >
                <Shield className="w-3 h-3 text-[#C9A96A]" />
                <span>{language === 'fa' ? 'مدیریت' : 'Admin'}</span>
              </button>
            )}
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-[#111313] border border-white/10 hover:border-[#C9A96A] hover:text-[#C9A96A] transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
