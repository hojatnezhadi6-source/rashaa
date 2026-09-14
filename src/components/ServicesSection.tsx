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
} from 'lucide-react';
import { ServiceItem, Language } from '../types';
import { SERVICES } from '../data/content';
import { TRANSLATIONS } from '../data/translations';

interface ServicesSectionProps {
  language: Language;
  onBookConsultation: (serviceTitle?: string) => void;
  services?: ServiceItem[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  language,
  onBookConsultation,
  services = SERVICES,
}) => {
  const t = TRANSLATIONS[language];
  const activeServices = services?.length ? services : SERVICES;
  const [activeHoverIndex, setActiveHoverIndex] = useState<number>(0);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

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
        return <Briefcase className="w-5 h-5" />;
    }
  };

  const activeImage = SERVICES[activeHoverIndex]?.image || SERVICES[0].image;

  return (
    <section id="services" className="relative py-14 sm:py-18 bg-[#080909] overflow-hidden border-t border-white/[0.08]">
      {/* Dynamic Background Image Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={activeImage}
          alt="Service Atmosphere"
          className="w-full h-full object-cover filter brightness-[0.11] contrast-[1.15] scale-105 transition-all duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080909] via-[#080909]/80 to-[#080909]" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#C9A96A]/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-12 space-y-2.5">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#C9A96A]/10 border border-[#C9A96A]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A96A]" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#E8CA8C] font-semibold font-mono">
              {language === 'fa' ? 'حوزه‌های تخصصی وکالت' : 'Strategic Practice Areas'}
            </span>
          </div>
          <h2
            className="text-3xl sm:text-5xl lg:text-6xl font-serif-display font-light text-[#F4F0E8] tracking-tight"
            style={{ letterSpacing: language === 'fa' || language === 'ar' ? '0' : '-0.025em' }}
          >
            {t.servicesTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#9B9B95] font-sans-luxury max-w-2xl leading-relaxed font-light">
            {t.servicesSubtitle}
          </p>
        </div>

        {/* 6 Luxury Services Compact 3x2 Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeServices.map((service, index) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              onMouseEnter={() => setActiveHoverIndex(index)}
              onClick={() => setSelectedService(service)}
              className="group p-6 rounded-2xl bg-gradient-to-b from-[#141616]/90 to-[#0E1010]/95 border border-white/[0.08] hover:border-[#C9A96A]/50 backdrop-blur-xl shadow-lg hover:shadow-[0_15px_35px_-10px_rgba(201,169,106,0.2)] transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#181B1B] border border-white/10 text-[#C9A96A] group-hover:border-[#C9A96A]/60 group-hover:bg-[#C9A96A]/10 group-hover:shadow-[0_0_20px_rgba(201,169,106,0.3)] transition-all duration-300 flex items-center justify-center">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="text-xs font-mono text-[#9B9B95] group-hover:text-[#DFBA73] transition-colors font-bold">
                    0{index + 1}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-serif-display font-medium text-[#F4F0E8] group-hover:text-gold-gradient transition-all leading-snug">
                    {language === 'fa' && service.titleFarsi ? service.titleFarsi : service.title}
                  </h3>
                  <p className="text-xs text-[#C9A96A] mt-1 font-medium font-sans">
                    {language === 'fa' && service.subtitleFarsi ? service.subtitleFarsi : service.subtitle}
                  </p>
                </div>

                <p className="text-xs text-[#9B9B95] line-clamp-2 leading-relaxed font-light">
                  {language === 'fa' && service.descriptionFarsi ? service.descriptionFarsi : service.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-[#9B9B95] group-hover:text-[#DFBA73] transition-colors font-medium">
                  {language === 'fa' ? 'بررسی شرایط و مشاوره' : 'Explore Advisory'}
                </span>
                <div className="w-7 h-7 rounded-full bg-white/[0.06] group-hover:bg-[#C9A96A] group-hover:text-[#080909] flex items-center justify-center transition-all duration-300">
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div
          id="service-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#080909]/90 backdrop-blur-xl animate-in fade-in duration-300"
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#111313] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-10 no-scrollbar">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-6 right-6 p-2 text-[#9B9B95] hover:text-[#F4F0E8] bg-[#080909] rounded-full border border-white/10 transition-colors z-20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-[#080909] border border-[#C9A96A]/30 text-[#C9A96A]">
                {getIcon(selectedService.iconName)}
              </div>
              <span className="text-xs uppercase tracking-widest text-[#C9A96A] font-semibold">
                Strategic Practice Area
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-serif-display font-medium text-[#F4F0E8] mb-2">
              {selectedService.title}
            </h3>
            <p className="text-sm text-[#9B9B95] mb-6 leading-relaxed">
              {selectedService.description}
            </p>

            {/* Structured Insights */}
            <div className="space-y-6">
              {/* Target Audience */}
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-[#C9A96A] mb-3">
                  Ideal Profile &amp; Candidates
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedService.targetAudience.map((aud, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-md bg-[#080909] border border-white/[0.08] text-xs text-[#F4F0E8]"
                    >
                      {aud}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Benefits */}
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-[#C9A96A] mb-3">
                  Key Strategic Advantages
                </h4>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {selectedService.keyBenefits.map((ben, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-[#F4F0E8]/90">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A96A] flex-shrink-0 mt-0.5" />
                      <span>{ben}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Included Advisory Scope */}
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-[#C9A96A] mb-3">
                  Comprehensive Advisory Scope
                </h4>
                <div className="space-y-2 p-4 rounded-xl bg-[#080909] border border-white/[0.06]">
                  {selectedService.includedAdvisory.map((adv, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-[#9B9B95]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96A]" />
                      <span>{adv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#9B9B95]">
                Customized strategy dossier engineered for your profile.
              </span>
              <button
                onClick={() => {
                  const serviceName = selectedService.title;
                  setSelectedService(null);
                  onBookConsultation(serviceName);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-[#C9A96A] hover:bg-[#b89758] text-[#080909] text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Book Consultation for {selectedService.title}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
