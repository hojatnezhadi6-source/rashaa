import React, { useState, useEffect } from 'react';
import {
  Globe,
  Shield,
  PhoneCall,
} from 'lucide-react';
import { Language, SiteConfig } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface NavbarProps {
  language: Language;
  siteConfig?: SiteConfig;
  onLanguageChange: (lang: Language) => void;
  onOpenAi: () => void;
  onOpenAssessment: () => void;
  onOpenQuickCall: () => void;
  onOpenAdmin: () => void;
  onOpenServices?: () => void;
  onOpenCases?: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  siteConfig: _siteConfig,
  onLanguageChange,
  onOpenAi: _onOpenAi,
  onOpenAssessment: _onOpenAssessment,
  onOpenQuickCall,
  onOpenAdmin,
  onOpenServices,
  onOpenCases,
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t.navDestinations, id: 'destinations' },
    { label: language === 'fa' ? 'تست و محاسبه شانس' : 'Assessment & Score', id: 'assessment-hub' },
    { label: language === 'fa' ? 'حوزه‌های خدمات' : t.navServices, id: 'services', isModal: 'services' },
    { label: language === 'fa' ? 'پرونده‌های موفق' : 'Case Records', id: 'cases', isModal: 'cases' },
    { label: t.navContact, id: 'contact' },
  ];

  const handleNavClick = (target: string | { id: string; isModal?: string }) => {
    if (typeof target === 'string') {
      if (target === 'services' && onOpenServices) {
        onOpenServices();
      } else if (target === 'cases' && onOpenCases) {
        onOpenCases();
      } else {
        onNavigate(target);
      }
    } else {
      if (target.isModal === 'services' && onOpenServices) {
        onOpenServices();
      } else if (target.isModal === 'cases' && onOpenCases) {
        onOpenCases();
      } else {
        onNavigate(target.id);
      }
    }
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'fa', label: 'فارسی (Persian)', flag: 'فا' },
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'ar', label: 'العربية (Arabic)', flag: 'عر' },
    { code: 'es', label: 'Español', flag: 'ES' },
  ];

  return (
    <>
      {/* Sleek, Clean, Uncluttered Luxury Navbar with Main Navigation exclusively at the top */}
      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#080909]/95 backdrop-blur-md border-b border-white/[0.08] py-2.5 sm:py-3 shadow-2xl'
            : 'bg-gradient-to-b from-[#080909]/90 via-[#080909]/80 to-transparent py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2 text-left rtl:text-right group focus:outline-none cursor-pointer shrink-0"
          >
            <div
              className="tracking-[0.14em] sm:tracking-[0.25em] font-light text-[#F4F0E8] group-hover:text-[#C9A96A] transition-colors text-base min-[380px]:text-lg sm:text-xl md:text-[22px] truncate"
            >
              RASHA <span className="opacity-50">MOHAJERAT</span>
            </div>
          </button>

          {/* Top Main Navigation Links: Exclusively at the very top of the site */}
          <nav
            id="top-main-navigation-bar"
            className="hidden sm:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-inner"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`top-nav-link-${item.id}`}
                onClick={() => handleNavClick(item)}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs lg:text-[13px] font-sans-luxury text-[#D1D1C7] hover:text-[#DFBA73] hover:bg-white/[0.06] transition-all cursor-pointer whitespace-nowrap font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Clean, Minimal Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Priority Call CTA */}
            <button
              id="navbar-quick-call-cta"
              onClick={onOpenQuickCall}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold transition-all cursor-pointer shadow-sm hover:border-emerald-500/60"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden min-[400px]:inline">{language === 'fa' ? 'مشاوره فوری' : 'Quick Call'}</span>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                id="lang-selector-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-mono uppercase text-[#9B9B95] hover:text-[#F4F0E8] border border-white/10 hover:border-[#C9A96A]/40 rounded-lg transition-colors cursor-pointer"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#C9A96A]" />
                <span>{languages.find((l) => l.code === language)?.flag}</span>
              </button>

              {langDropdownOpen && (
                <div
                  id="lang-dropdown-menu"
                  className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-44 bg-[#111313] border border-white/10 shadow-2xl py-1.5 z-50 rounded-xl animate-in fade-in zoom-in-95 duration-200"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left rtl:text-right px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        language === lang.code
                          ? 'text-[#C9A96A] bg-white/[0.04] font-medium'
                          : 'text-[#9B9B95] hover:text-[#F4F0E8] hover:bg-white/[0.02]'
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-[10px] font-mono opacity-70">{lang.flag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Dashboard Entry Button */}
            <button
              id="navbar-admin-icon-btn"
              onClick={onOpenAdmin}
              title={language === 'fa' ? 'پنل مدیریت سایت' : 'Admin Suite'}
              className="p-2 border border-white/10 hover:border-[#C9A96A]/60 bg-white/[0.03] text-[#9B9B95] hover:text-[#C9A96A] rounded-lg transition-colors cursor-pointer"
              aria-label="Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip: directly and cleanly visible right at the very top of the site on smaller screens */}
        <div className="sm:hidden px-3 pt-2 pb-0.5 overflow-x-auto no-scrollbar">
          <nav
            id="top-main-navigation-bar-mobile"
            className="flex items-center gap-1.5 py-0.5 min-w-max mx-auto justify-center"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`top-nav-mobile-link-${item.id}`}
                onClick={() => handleNavClick(item)}
                className="px-2.5 py-1 rounded-full text-[11px] font-sans-luxury text-[#D1D1C7] hover:text-[#DFBA73] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all cursor-pointer whitespace-nowrap font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
};
