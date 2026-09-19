/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, PhoneCall, Shield, ClipboardCheck } from 'lucide-react';
import { Language, SiteConfig } from './types';
import { TRANSLATIONS } from './data/translations';
import { getSiteConfig } from './data/siteConfig';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DestinationsSection } from './components/DestinationsSection';
import { BlueprintSection } from './components/BlueprintSection';
import { ExecutivePortalsBar } from './components/ExecutivePortalsBar';
import { InteractiveAssessmentHub } from './components/InteractiveAssessmentHub';
import { ConsultationSection } from './components/ConsultationSection';
import { Footer } from './components/Footer';
import { ServicesModal } from './components/ServicesModal';
import { CaseStudiesModal } from './components/CaseStudiesModal';
import { RashaAiModal } from './components/RashaAiModal';
import { QuickCallModal } from './components/QuickCallModal';
import { ComprehensiveAssessmentModal } from './components/ComprehensiveAssessmentModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { CinematicScrollExperience } from './components/CinematicScrollExperience';

export default function App() {
  // Set default language to Persian ('fa') as requested by user
  const [language, setLanguage] = useState<Language>('fa');
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(getSiteConfig());

  // Elegant Luxury Dark Theme as preferred by user
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Modal States
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [quickCallOpen, setQuickCallOpen] = useState(false);
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const [casesModalOpen, setCasesModalOpen] = useState(false);

  const [selectedDestinationForAssessment, setSelectedDestinationForAssessment] = useState<string>('');
  const [consultationPrefill, setConsultationPrefill] = useState<{
    destination?: string;
    message?: string;
  }>({});

  const t = TRANSLATIONS[language];

  // Apply theme class to html root
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  }, [theme]);

  // Set HTML document language and text direction (RTL for Persian and Arabic)
  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'fa' || language === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  // Synchronize dynamic typography themes across the entire site
  useEffect(() => {
    const persianFontClasses = [
      'font-theme-peyda',
      'font-theme-estedad',
      'font-theme-shabnam',
      'font-theme-vazir',
      'font-theme-sahel',
      'font-theme-amiri',
    ];
    const englishFontClasses = [
      'font-en-sora',
      'font-en-playfair',
      'font-en-manrope',
      'font-en-cormorant',
    ];

    document.documentElement.classList.remove(...persianFontClasses, ...englishFontClasses);

    const activeFaFont = siteConfig.persianFont || siteConfig.persianFontTheme || 'peyda';
    document.documentElement.classList.add(`font-theme-${activeFaFont}`);

    const activeEnFont = siteConfig.englishFont || siteConfig.englishFontTheme || 'sora';
    document.documentElement.classList.add(`font-en-${activeEnFont}`);
  }, [siteConfig.persianFont, siteConfig.persianFontTheme, siteConfig.englishFont, siteConfig.englishFontTheme]);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenConsultation = (details?: { destination?: string; message?: string }) => {
    if (details) {
      setConsultationPrefill(details);
    }
    handleNavigate('contact');
  };

  const handleSelectDestinationForAssessment = (destName: string) => {
    setSelectedDestinationForAssessment(destName);
    setAssessmentModalOpen(true);
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-[#FAF9F5] text-[#14171A]' : 'bg-[#080909] text-[#F4F0E8]'} font-sans-luxury selection:bg-[#C9A96A] selection:text-[#080909] relative transition-colors duration-300`}>
      {/* Cinematic Smooth Scroll Progress Bar & Floating HUD */}
      <CinematicScrollExperience
        language={language}
        onNavigate={handleNavigate}
      />

      {/* Primary Sticky / Glass Navbar with Theme Toggle, Quick Call, Services Portal & Case Records links */}
      <Navbar
        language={language}
        siteConfig={siteConfig}
        onLanguageChange={setLanguage}
        onOpenAi={() => setAiModalOpen(true)}
        onOpenAssessment={() => setAssessmentModalOpen(true)}
        onOpenQuickCall={() => setQuickCallOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenServices={() => setServicesModalOpen(true)}
        onOpenCases={() => setCasesModalOpen(true)}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
      />

      {/* Main Page Flow with Cinematic Smooth Section Transitions */}
      <main>
        {/* 1. Cinematic Full-Screen Hero with 3D Interactive Globe right beside the headline */}
        <HeroSection
          language={language}
          siteConfig={siteConfig}
          onStartJourney={() => setAssessmentModalOpen(true)}
          onExploreDestinations={() => handleNavigate('destinations')}
          onOpenQuickCall={() => setQuickCallOpen(true)}
          onSelectDestinationForAssessment={handleSelectDestinationForAssessment}
          onBookConsultationForCountry={(country) =>
            handleOpenConsultation({
              destination: country,
              message: `درخواست مشاوره اختصاصی جهت اخذ اقامت و مهاجرت به کشور ${country}`,
            })
          }
          isLightTheme={theme === 'light'}
        />

        {/* 2. "THE WORLD IS OPEN." Destinations Carousel & Deep Modals */}
        <DestinationsSection
          language={language}
          destinations={siteConfig.destinations}
          onSelectDestinationForAssessment={handleSelectDestinationForAssessment}
        />

        {/* 3. EXECUTIVE PORTALS: Dedicated 1-Click Access to Practice Areas & Case Records */}
        <ExecutivePortalsBar
          language={language}
          onOpenServices={() => setServicesModalOpen(true)}
          onOpenCases={() => setCasesModalOpen(true)}
          onOpenAssessmentHub={() => handleNavigate('assessment-hub')}
        />

        {/* 4. SMART IMMIGRATION INTELLIGENCE SUITE: Free Assessment Quiz & Points Chance Calculator */}
        <InteractiveAssessmentHub
          language={language}
          onOpenConsultation={handleOpenConsultation}
          onNavigateToContact={() => handleNavigate('contact')}
        />

        {/* 5. THE RASHA BLUEPRINT: Unified Interactive 6-Stage Roadmap & Core Principles */}
        <BlueprintSection
          language={language}
          whyRashaPrinciples={siteConfig.whyRashaPrinciples}
          processSteps={siteConfig.processSteps}
          onBookConsultation={() => handleNavigate('contact')}
          onExploreServices={() => setServicesModalOpen(true)}
        />

        {/* 6. "YOUR NEXT CHAPTER STARTS HERE." Private Advisory Consultation Desk */}
        <ConsultationSection
          language={language}
          siteConfig={siteConfig}
          prefilledDestination={consultationPrefill.destination}
          prefilledMessage={consultationPrefill.message}
        />
      </main>

      {/* Footer with International Compliance & Admin Access */}
      <Footer
        language={language}
        onLanguageChange={setLanguage}
        onNavigate={handleNavigate}
        onOpenAi={() => setAiModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenServices={() => setServicesModalOpen(true)}
        onOpenCases={() => setCasesModalOpen(true)}
      />

      {/* Floating Action Controls on Bottom Corner */}
      <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-40 flex flex-col gap-3">
        {/* Quick Priority Call Floating Pill */}
        <button
          id="floating-quick-call-btn"
          onClick={() => setQuickCallOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#0d1612] hover:bg-[#12231c] text-[#F4F0E8] border border-emerald-500/50 hover:border-emerald-400 rounded-2xl shadow-2xl shadow-black/90 transition-all duration-300 hover:scale-105 cursor-pointer"
          aria-label="Quick Priority Call"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div className="flex flex-col text-left rtl:text-right">
            <span className="text-[11px] font-bold text-emerald-300">
              {language === 'fa' ? 'تماس فوری' : 'Quick Call'}
            </span>
            <span className="text-[9px] text-emerald-400/80 font-mono">
              {language === 'fa' ? 'پاسخگویی در ۱۵ دقیقه' : '15-min callback'}
            </span>
          </div>
        </button>

        {/* Persistent "Ask RASHA AI" Button */}
        <button
          id="floating-rasha-ai-btn"
          onClick={() => setAiModalOpen(true)}
          className="group relative flex items-center gap-3 px-4 py-3 bg-[#111313] hover:bg-[#181a1a] text-[#F4F0E8] border border-[#C9A96A]/60 hover:border-[#C9A96A] rounded-2xl shadow-2xl shadow-black/80 transition-all duration-300 hover:scale-105 cursor-pointer"
          aria-label="Ask RASHA AI"
        >
          <span className="absolute -inset-0.5 bg-gradient-to-r from-[#C9A96A]/30 to-amber-500/20 blur-xs group-hover:opacity-100 transition-opacity -z-10 animate-pulse rounded-2xl" />
          <div className="relative">
            <div className="w-7 h-7 bg-[#181a1a] border border-[#C9A96A]/40 rounded-lg flex items-center justify-center text-[#C9A96A]">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A96A] group-hover:rotate-12 transition-transform" />
            </div>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#111313]" />
          </div>

          <div className="flex flex-col text-left rtl:text-right">
            <span className="text-xs uppercase font-bold text-[#F4F0E8] tracking-[0.14em]">
              {t.askAiCTA}
            </span>
            <span className="text-[9px] uppercase font-mono tracking-wider text-[#C9A96A]">
              24/7 Global Advisor
            </span>
          </div>
        </button>
      </div>

      {/* RASHA AI 24/7 Chat Modal */}
      <RashaAiModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        language={language}
        onOpenConsultation={handleOpenConsultation}
      />

      {/* Instant Quick Call & 15-Min Callback Modal */}
      <QuickCallModal
        isOpen={quickCallOpen}
        onClose={() => setQuickCallOpen(false)}
        language={language}
      />

      {/* Comprehensive Assessment Form Modal */}
      <ComprehensiveAssessmentModal
        isOpen={assessmentModalOpen}
        onClose={() => setAssessmentModalOpen(false)}
        language={language}
        initialDestination={selectedDestinationForAssessment}
      />

      {/* Master Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        language={language}
        onConfigUpdated={(updated) => setSiteConfig(updated)}
      />

      {/* Dedicated Luxury Practice Areas Portal Modal */}
      <ServicesModal
        isOpen={servicesModalOpen}
        onClose={() => setServicesModalOpen(false)}
        language={language}
        services={siteConfig.services}
        onBookConsultation={(serviceTitle) =>
          handleOpenConsultation({
            message: serviceTitle ? `Inquiry for ${serviceTitle} advisory scope.` : undefined,
          })
        }
      />

      {/* Dedicated Luxury Verified Case Studies & Client Records Dossier */}
      <CaseStudiesModal
        isOpen={casesModalOpen}
        onClose={() => setCasesModalOpen(false)}
        language={language}
        caseStudies={siteConfig.caseStudies}
        onBookConsultation={() => handleNavigate('contact')}
      />
    </div>
  );
}
