import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  TrendingUp,
  Users,
  Compass,
  ShieldCheck,
  ArrowRight,
  X,
  CheckCircle2,
  Sparkles,
  Search,
  Scale,
  Award,
} from 'lucide-react';
import { ServiceItem, Language } from '../types';
import { SERVICES } from '../data/content';
import { TRANSLATIONS } from '../data/translations';

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onBookConsultation: (serviceTitle?: string) => void;
  services?: ServiceItem[];
}

export const ServicesModal: React.FC<ServicesModalProps> = ({
  isOpen,
  onClose,
  language,
  onBookConsultation,
  services = SERVICES,
}) => {
  const t = TRANSLATIONS[language];
  const activeServices = services?.length ? services : SERVICES;
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const getIcon = (name: string) => {
    switch (name) {
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      default:
        return <Scale className="w-5 h-5" />;
    }
  };

  const filteredServices = activeServices.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = s.title.toLowerCase().includes(q) || (s.titleFarsi && s.titleFarsi.includes(q));
    const descMatch = s.description.toLowerCase().includes(q) || (s.descriptionFarsi && s.descriptionFarsi.includes(q));
    return titleMatch || descMatch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#0b0d0d] border border-[#C9A96A]/30 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#C9A96A]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#C9A96A]/8 rounded-full blur-[130px] pointer-events-none" />

        {/* Modal Top Header */}
        <div className="relative z-10 px-6 sm:px-10 py-6 border-b border-white/[0.08] flex items-center justify-between gap-4 bg-[#0e1010]/80 backdrop-blur-md">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A96A]/10 border border-[#C9A96A]/30">
              <Sparkles className="w-3 h-3 text-[#C9A96A]" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#E8CA8C] font-semibold font-mono">
                {language === 'fa' ? 'حوزه‌های تخصصی وکالت بین‌المللی' : 'Practice Areas Portal'}
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-serif-display font-light text-[#F4F0E8] tracking-tight">
              {t.servicesTitle}
            </h2>
            <p className="text-xs text-[#9B9B95] font-sans-luxury max-w-2xl font-light">
              {t.servicesSubtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0 border border-white/10 hover:border-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Stats Filter */}
        <div className="px-6 sm:px-10 py-4 border-b border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/30">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#9B9B95] absolute right-3 rtl:right-3 rtl:left-auto left-auto top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'fa' ? 'جستجو در حوزه‌های خدمات وکالتی...' : 'Search practice areas...'}
              className="w-full bg-[#141616] border border-white/10 rounded-xl px-9 py-2 text-xs text-[#F4F0E8] placeholder:text-[#6E6E68] focus:border-[#C9A96A]/50 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4 text-xs text-[#9B9B95] font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'fa' ? 'نظارت مستقیم وکلای رسمی' : 'Regulated Advocates'}</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[#DFBA73]">
              {language === 'fa' ? `${filteredServices.length} حوزه تخصصی` : `${filteredServices.length} Practice Areas`}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map((service, index) => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className="group p-6 rounded-2xl bg-gradient-to-b from-[#141616] to-[#0d0f0f] border border-white/[0.08] hover:border-[#C9A96A]/60 shadow-lg hover:shadow-[0_15px_35px_-10px_rgba(201,169,106,0.25)] transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 cursor-pointer"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-[#1a1c1c] border border-white/10 text-[#DFBA73] group-hover:border-[#C9A96A]/60 group-hover:bg-[#C9A96A]/15 group-hover:shadow-[0_0_20px_rgba(201,169,106,0.3)] transition-all duration-300 flex items-center justify-center">
                      {getIcon(service.iconName)}
                    </div>
                    <span className="text-xs font-mono text-[#9B9B95] group-hover:text-[#DFBA73] transition-colors font-bold">
                      0{index + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-serif-display font-medium text-[#F4F0E8] group-hover:text-gold-gradient transition-all leading-snug">
                      {language === 'fa' && service.titleFarsi ? service.titleFarsi : service.title}
                    </h3>
                    <p className="text-xs text-[#C9A96A] mt-1 font-medium font-sans">
                      {language === 'fa' && service.subtitleFarsi ? service.subtitleFarsi : service.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-[#9B9B95] line-clamp-3 leading-relaxed font-light">
                    {language === 'fa' && service.descriptionFarsi ? service.descriptionFarsi : service.description}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-[#DFBA73] group-hover:text-[#F4F0E8] transition-colors font-medium">
                    {language === 'fa' ? 'مشاهده شرایط و جزئیات وکالت' : 'View Requirements'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/[0.06] group-hover:bg-[#C9A96A] group-hover:text-[#080909] flex items-center justify-center transition-all duration-300">
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer Banner */}
        <div className="px-6 sm:px-10 py-4 bg-[#0d0f0f] border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-[#9B9B95] text-center sm:text-start">
            {language === 'fa'
              ? 'تمامی خدمات فوق تحت قرارداد رسمی و تضمین استانداردهای نظام حقوقی بین‌الملل ارائه می‌شوند.'
              : 'All advisory scopes are executed under statutory attorney contracts and full international compliance.'}
          </span>
          <button
            onClick={() => {
              onClose();
              onBookConsultation();
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] hover:from-[#E8CA8C] hover:to-[#DFBA73] text-[#080909] font-bold text-xs rounded-xl shadow-lg shadow-[#C9A96A]/20 transition-all cursor-pointer whitespace-nowrap"
          >
            {language === 'fa' ? 'رزرو جلسه مشاوره حقوقی' : 'Book Legal Consultation'}
          </button>
        </div>
      </div>

      {/* Deep Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#121414] border border-[#C9A96A]/50 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <span className="text-xs text-[#C9A96A] font-mono block uppercase">
                  {language === 'fa' && selectedService.subtitleFarsi ? selectedService.subtitleFarsi : selectedService.subtitle}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif-display font-medium text-[#F4F0E8]">
                  {language === 'fa' && selectedService.titleFarsi ? selectedService.titleFarsi : selectedService.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-[#D1D1C7] leading-relaxed font-light">
              {language === 'fa' && selectedService.descriptionFarsi ? selectedService.descriptionFarsi : selectedService.description}
            </p>

            {/* Scope Deliverables */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs uppercase tracking-wider text-[#DFBA73] font-bold">
                {language === 'fa' ? 'تعهدات و اقدامات اجرایی راشا:' : 'Deliverables & Statutory Actions:'}
              </h4>
              <div className="space-y-2">
                {[
                  language === 'fa' ? 'بررسی جامع صلاحیت قانونی پرونده توسط وکیل رسمی' : 'Comprehensive statutory eligibility review',
                  language === 'fa' ? 'نگارش و تنظیم مستندات استراتژیک و قانونی مطابق قوانین جاری مقصد' : 'Strategic petition preparation & formal documentation',
                  language === 'fa' ? 'پیگیری مستمر تا دریافت ویزا، اقامت و پشتیبانی تشریفاتی ورود' : 'Expedited tracking, appeal readiness & landing support',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-[#F4F0E8]">
                    <CheckCircle2 className="w-4 h-4 text-[#DFBA73] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  const title = language === 'fa' ? selectedService.titleFarsi || selectedService.title : selectedService.title;
                  setSelectedService(null);
                  onClose();
                  onBookConsultation(title);
                }}
                className="flex-1 py-3 bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] hover:from-[#E8CA8C] hover:to-[#DFBA73] text-[#080909] font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer text-center"
              >
                {language === 'fa' ? `درخواست مشاوره برای ${selectedService.titleFarsi || selectedService.title}` : 'Initiate Inquiry For This Area'}
              </button>
              <button
                onClick={() => setSelectedService(null)}
                className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white text-xs rounded-xl cursor-pointer"
              >
                {language === 'fa' ? 'بستن' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
