import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronRight,
  FileCheck,
} from 'lucide-react';
import { CaseStudy, Language } from '../types';
import { CASE_STUDIES } from '../data/content';
import { TRANSLATIONS } from '../data/translations';

interface CaseStudiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onBookConsultation: () => void;
  caseStudies?: CaseStudy[];
}

export const CaseStudiesModal: React.FC<CaseStudiesModalProps> = ({
  isOpen,
  onClose,
  language,
  onBookConsultation,
  caseStudies = CASE_STUDIES,
}) => {
  const t = TRANSLATIONS[language];
  const activeCases = caseStudies?.length ? caseStudies : CASE_STUDIES;
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Extract unique destinations
  const destinations = ['all', ...Array.from(new Set(activeCases.map((c) => c.destination)))];

  const filteredCases = activeCases.filter((c) => {
    const matchesDest = selectedDestination === 'all' || c.destination === selectedDestination;
    if (!matchesDest) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = (language === 'fa' && c.titleFarsi ? c.titleFarsi : c.title).toLowerCase();
    const profile = (language === 'fa' && c.profileFarsi ? c.profileFarsi : c.profile).toLowerCase();
    const pathway = (language === 'fa' && c.pathwayFarsi ? c.pathwayFarsi : c.pathway).toLowerCase();
    return title.includes(q) || profile.includes(q) || pathway.includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#0b0d0d] border border-[#C9A96A]/30 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glows */}
        <div className="absolute top-0 left-1/3 w-[450px] h-[450px] bg-[#C9A96A]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#C9A96A]/8 rounded-full blur-[130px] pointer-events-none" />

        {/* Modal Top Header */}
        <div className="relative z-10 px-6 sm:px-10 py-6 border-b border-white/[0.08] flex items-center justify-between gap-4 bg-[#0e1010]/80 backdrop-blur-md">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A96A]/10 border border-[#C9A96A]/30">
              <Award className="w-3.5 h-3.5 text-[#DFBA73]" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#E8CA8C] font-semibold font-mono">
                {language === 'fa' ? 'آرشیو پرونده‌های رسمی و سوابق موفق' : 'Verified Client Dossier'}
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-serif-display font-light text-[#F4F0E8] tracking-tight">
              {t.caseStudiesTitle}
            </h2>
            <p className="text-xs text-[#9B9B95] font-sans-luxury max-w-2xl font-light">
              {t.caseStudiesSubtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0 border border-white/10 hover:border-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Metrics Strip */}
        <div className="px-6 sm:px-10 py-4 border-b border-white/[0.06] flex flex-col lg:flex-row items-center justify-between gap-4 bg-black/40">
          {/* Destination Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {destinations.map((dest) => (
              <button
                key={dest}
                onClick={() => setSelectedDestination(dest)}
                className={`px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer font-mono ${
                  selectedDestination === dest
                    ? 'bg-[#C9A96A] text-[#080909] font-bold shadow-md shadow-[#C9A96A]/20'
                    : 'bg-[#141616] text-[#9B9B95] hover:text-[#F4F0E8] border border-white/10'
                }`}
              >
                {dest === 'all' ? (language === 'fa' ? 'تمام مقاصد' : 'All Gateways') : dest}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-3.5 h-3.5 text-[#9B9B95] absolute right-3 rtl:right-3 rtl:left-auto left-auto top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'fa' ? 'جستجوی پرونده، تخصص، ویزا...' : 'Search cases, profiles...'}
              className="w-full bg-[#141616] border border-white/10 rounded-xl px-9 py-2 text-xs text-[#F4F0E8] placeholder:text-[#6E6E68] focus:border-[#C9A96A]/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Scrollable Cases Grid */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 space-y-6">
          {filteredCases.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <FileCheck className="w-10 h-10 text-[#C9A96A]/40 mx-auto" />
              <p className="text-sm text-[#9B9B95]">
                {language === 'fa' ? 'موردی مطابق با فیلتر شما یافت نشد.' : 'No cases match your filter.'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCases.map((caseStudy) => (
                <div
                  key={caseStudy.id}
                  onClick={() => setSelectedCase(caseStudy)}
                  className="group rounded-2xl bg-gradient-to-b from-[#141616] to-[#0d0f0f] border border-white/[0.08] hover:border-[#C9A96A]/60 shadow-lg hover:shadow-[0_15px_35px_-10px_rgba(201,169,106,0.25)] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:-translate-y-1"
                >
                  {/* Card Visual Header */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={caseStudy.image}
                      alt={caseStudy.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-[0.7]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f0f] via-transparent to-black/40" />

                    <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] text-[#F4F0E8]">
                      <MapPin className="w-3 h-3 text-[#DFBA73]" />
                      <span>{language === 'fa' && caseStudy.destinationFarsi ? caseStudy.destinationFarsi : caseStudy.destination}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 font-mono font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{language === 'fa' ? 'ویزا اخذ شد' : 'Approved & Landed'}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[#C9A96A] font-mono">
                        <span>{language === 'fa' && caseStudy.pathwayFarsi ? caseStudy.pathwayFarsi : caseStudy.pathway}</span>
                        <span className="flex items-center gap-1 text-[#9B9B95]">
                          <Clock className="w-3 h-3" />
                          <span>{language === 'fa' && caseStudy.durationFarsi ? caseStudy.durationFarsi : caseStudy.duration}</span>
                        </span>
                      </div>

                      <h3 className="text-base font-serif-display font-medium text-[#F4F0E8] group-hover:text-gold-gradient transition-colors leading-snug">
                        {language === 'fa' && caseStudy.titleFarsi ? caseStudy.titleFarsi : caseStudy.title}
                      </h3>

                      <p className="text-xs text-[#9B9B95] line-clamp-2 leading-relaxed font-light">
                        {language === 'fa' && caseStudy.profileFarsi ? caseStudy.profileFarsi : caseStudy.profile}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <span className="text-[#DFBA73] font-medium group-hover:text-[#F4F0E8] transition-colors">
                        {language === 'fa' ? 'مطالعه جزئیات پرونده' : 'Read Case Strategy'}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-white/[0.06] group-hover:bg-[#C9A96A] group-hover:text-[#080909] flex items-center justify-center transition-all">
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Bottom Strip */}
        <div className="px-6 sm:px-10 py-4 bg-[#0d0f0f] border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#9B9B95]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'fa'
                ? 'مشخصات مراجعین مطابق با منشور محرمانگی وکالت به شکل محرمانه مستندسازی شده است.'
                : 'Client identities strictly anonymized in compliance with international legal privilege.'}
            </span>
          </div>
          <button
            onClick={() => {
              onClose();
              onBookConsultation();
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] hover:from-[#E8CA8C] hover:to-[#DFBA73] text-[#080909] font-bold text-xs rounded-xl shadow-lg shadow-[#C9A96A]/20 transition-all cursor-pointer whitespace-nowrap"
          >
            {language === 'fa' ? 'شروع پرونده اختصاصی شما' : 'Assess My Case'}
          </button>
        </div>
      </div>

      {/* Case Details Deep Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#121414] border border-[#C9A96A]/50 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-[#DFBA73]">
                  <span>{selectedCase.destination}</span>
                  <span>•</span>
                  <span>{selectedCase.pathway}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif-display font-medium text-[#F4F0E8]">
                  {language === 'fa' && selectedCase.titleFarsi ? selectedCase.titleFarsi : selectedCase.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[#9B9B95] font-mono">
                {language === 'fa' ? 'مشخصات متقاضی:' : 'Applicant Profile:'}
              </span>
              <p className="text-xs sm:text-sm text-[#F4F0E8] leading-relaxed">
                {language === 'fa' && selectedCase.profileFarsi ? selectedCase.profileFarsi : selectedCase.profile}
              </p>
            </div>

            {/* Challenge vs Strategy */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#181514] border border-amber-500/20 space-y-1.5">
                <span className="text-xs text-amber-300 font-semibold block">
                  {language === 'fa' ? 'چالش‌های پرونده:' : 'The Challenge:'}
                </span>
                <p className="text-xs text-[#D1D1C7] leading-relaxed">
                  {language === 'fa' && selectedCase.challengeFarsi ? selectedCase.challengeFarsi : selectedCase.challenge}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#101815] border border-emerald-500/20 space-y-1.5">
                <span className="text-xs text-emerald-300 font-semibold block">
                  {language === 'fa' ? 'استراتژی وکلای راشا:' : 'Legal Strategy:'}
                </span>
                <p className="text-xs text-[#D1D1C7] leading-relaxed">
                  {language === 'fa' && selectedCase.strategyFarsi ? selectedCase.strategyFarsi : selectedCase.strategy}
                </p>
              </div>
            </div>

            {/* Final Outcome */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-black border border-emerald-500/40 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'fa' ? 'نتیجه نهایی:' : 'Official Outcome:'}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#F4F0E8]">
                {language === 'fa' && selectedCase.outcomeFarsi ? selectedCase.outcomeFarsi : selectedCase.outcome}
              </p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setSelectedCase(null);
                  onClose();
                  onBookConsultation();
                }}
                className="flex-1 py-3 bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] hover:from-[#E8CA8C] hover:to-[#DFBA73] text-[#080909] font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer text-center"
              >
                {language === 'fa' ? 'بررسی شرایط پرونده مشابه من' : 'Evaluate Similar Case For Me'}
              </button>
              <button
                onClick={() => setSelectedCase(null)}
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
