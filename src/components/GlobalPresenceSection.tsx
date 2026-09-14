import React, { useState } from 'react';
import { Globe, Globe2, MapPin, Clock, Building, ArrowUpRight } from 'lucide-react';
import { Language } from '../types';
import { CITY_HUBS } from '../data/content';
import { TRANSLATIONS } from '../data/translations';

interface GlobalPresenceSectionProps {
  language: Language;
  onBookConsultation: () => void;
}

export const GlobalPresenceSection: React.FC<GlobalPresenceSectionProps> = ({
  language,
  onBookConsultation,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedHub, setSelectedHub] = useState<number>(0);

  const activeHub = CITY_HUBS[selectedHub];

  return (
    <section id="global-presence" className="py-14 sm:py-18 bg-[#080909] relative overflow-hidden border-t border-white/[0.08]">
      {/* Background Global Network Satellite Lights */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2200&q=80"
          alt="Global Network"
          className="w-full h-full object-cover filter brightness-[0.09] contrast-[1.2]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080909] via-[#080909]/85 to-[#080909]" />
        <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] bg-[#C9A96A]/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-12 space-y-2.5">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#C9A96A]/10 border border-[#C9A96A]/30">
            <Globe2 className="w-3.5 h-3.5 text-[#C9A96A]" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#E8CA8C] font-semibold font-mono">
              {language === 'fa' ? 'شبکه دفاتر بین‌المللی' : 'Global Footprint'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif-display font-light text-[#F4F0E8] tracking-tight">
            {t.globalPresenceTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#9B9B95] font-sans-luxury max-w-2xl leading-relaxed font-light">
            {t.globalPresenceSubtitle}
          </p>
        </div>

        {/* Global Hubs Interactive Matrix */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Office Grid Chips */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-3.5">
            {CITY_HUBS.map((hub, idx) => {
              const isSelected = idx === selectedHub;
              return (
                <div
                  key={hub.id}
                  id={`hub-card-${hub.id}`}
                  onClick={() => setSelectedHub(idx)}
                  className={`p-5 rounded-xl cursor-pointer transition-all duration-300 border ${
                    isSelected
                      ? 'bg-[#111313] border-[#C9A96A] shadow-xl shadow-[#C9A96A]/10'
                      : 'bg-[#0a0b0b] border-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-serif-display font-medium text-[#F4F0E8]">
                      {language === 'fa' && hub.nameFarsi ? hub.nameFarsi : hub.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#C9A96A] uppercase px-2 py-0.5 rounded bg-[#080909] border border-white/[0.06]">
                      {language === 'fa' && hub.timezoneFarsi ? hub.timezoneFarsi : hub.timezone}
                    </span>
                  </div>
                  <div className="text-xs text-[#9B9B95] mb-2">
                    {language === 'fa' && hub.countryFarsi ? hub.countryFarsi : hub.country}
                  </div>
                  <div className="text-[11px] text-[#C9A96A]/90 truncate">
                    {language === 'fa' && hub.specializationFarsi ? hub.specializationFarsi : hub.specialization}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Office Deep Detail Dossier */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-2xl bg-[#111313] border border-white/[0.08] relative overflow-hidden shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C9A96A]">
                  <Building className="w-4 h-4" />
                  <span>{language === 'fa' ? 'میز اختصاصی وکلای بین‌المللی' : 'Regional Advisory Desk'}</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <div>
                <h3 className="text-3xl font-serif-display font-medium text-[#F4F0E8]">
                  {language === 'fa' && activeHub.nameFarsi ? `دفتر بین‌المللی ${activeHub.nameFarsi}` : `${activeHub.name} Desk`}
                </h3>
                <p className="text-xs text-[#9B9B95] mt-1">
                  {language === 'fa' && activeHub.countryFarsi ? activeHub.countryFarsi : activeHub.country}
                </p>
              </div>

              <div className="space-y-4 text-xs font-sans-luxury border-y border-white/[0.08] py-4">
                <div>
                  <span className="text-[#9B9B95] uppercase tracking-wider block mb-1">
                    {language === 'fa' ? 'تخصص حقوقی و صلاحیت حوزه' : 'Jurisdiction Specialization'}
                  </span>
                  <span className="text-[#F4F0E8] font-medium text-sm">
                    {language === 'fa' && activeHub.specializationFarsi ? activeHub.specializationFarsi : activeHub.specialization}
                  </span>
                </div>

                <div>
                  <span className="text-[#9B9B95] uppercase tracking-wider block mb-1">
                    {language === 'fa' ? 'منطقه زمانی کاری' : 'Operating Timezone'}
                  </span>
                  <span className="text-[#F4F0E8] font-mono">
                    {language === 'fa' && activeHub.timezoneFarsi ? activeHub.timezoneFarsi : activeHub.timezone}
                  </span>
                </div>

                <div>
                  <span className="text-[#9B9B95] uppercase tracking-wider block mb-1">
                    {language === 'fa' ? 'آدرس مرکز پذیرش متقاضیان VIP' : 'Address / Private Client Center'}
                  </span>
                  <span className="text-[#F4F0E8] leading-relaxed block">
                    {language === 'fa' && activeHub.addressFarsi ? activeHub.addressFarsi : activeHub.address}
                  </span>
                </div>
              </div>

              <button
                onClick={onBookConsultation}
                className="w-full py-3.5 bg-[#C9A96A] hover:bg-[#b89758] text-[#080909] font-semibold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>
                  {language === 'fa'
                    ? `درخواست مشاوره در دفتر ${activeHub.nameFarsi || activeHub.name}`
                    : `Request Consultation at ${activeHub.name}`}
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

