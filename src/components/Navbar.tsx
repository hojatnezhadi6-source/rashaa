import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Globe,
  Menu,
  X,
  ArrowUpRight,
  Shield,
  PhoneCall,
  ClipboardCheck,
  MessageCircle,
  Sun,
  Moon,
  Calculator,
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
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  siteConfig,
  onLanguageChange,
  onOpenAi,
  onOpenAssessment,
  onOpenQuickCall,
  onOpenAdmin,
  onOpenServices,
  onOpenCases,
  onNavigate,
  theme = 'light',
  onToggleTheme,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    { label: t.navProcess, id: 'process' },
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
    setMobileMenuOpen(false);
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'fa', label: 'فارسی (Persian)', flag: 'فا' },
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'ar', label: 'العربية (Arabic)', flag: 'عر' },
    { code: 'es', label: 'Español', flag: 'ES' },
  ];

  return (
    <>
      {/* Sleek, Clean, Uncluttered Luxury Navbar */}
      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#080909]/92 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-2xl'
            : 'bg-gradient-to-b from-[#080909]/80 to-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2 text-left group focus:outline-none cursor-pointer shrink-0"
          >
            <div className="text-base sm:text-xl tracking-[0.18em] sm:tracking-[0.25em] font-light text-[#F4F0E8] group-hover:text-[#C9A96A] transition-colors truncate">
              RASHA <span className="opacity-50">MOHAJERAT</span>
            </div>
          </button>

          {/* Clean, Minimal Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button (Light / Dark) */}
            {onToggleTheme && (
              <button
                id="navbar-theme-toggle-btn"
                onClick={onToggleTheme}
                title={
                  theme === 'light'
                    ? (language === 'fa' ? 'تغییر به تم تیره' : 'Switch to Dark Mode')
                    : (language === 'fa' ? 'تغییر به تم روشن' : 'Switch to Light Mode')
                }
                className="p-2 border border-white/10 hover:border-[#C9A96A]/60 bg-white/[0.03] text-[#DFBA73] hover:text-[#C9A96A] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4 text-amber-500" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
                )}
              </button>
            )}

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
                      <span className="text-[10px] font-mono text-[#9B9B95]/70">{lang.flag}</span>
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

            {/* Luxury Menu Toggle Button */}
            <button
              id="main-menu-toggle"
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 border border-white/10 hover:border-[#C9A96A]/60 bg-white/[0.03] hover:bg-white/[0.06] text-[#F4F0E8] hover:text-[#C9A96A] rounded-lg transition-all cursor-pointer font-sans-luxury text-xs tracking-wider"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 text-[#C9A96A]" />
              <span className="text-[11px] font-medium hidden min-[400px]:inline">
                {language === 'fa' ? 'منو' : 'Menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Luxury Slide-Over Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer-overlay"
          className="fixed inset-0 z-50 bg-[#080909]/80 backdrop-blur-md flex justify-end rtl:justify-start animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            id="mobile-drawer"
            className="relative w-full max-w-sm sm:max-w-md h-full bg-[#101212] border-l rtl:border-l-0 rtl:border-r border-white/10 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right rtl:slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header of Drawer */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="text-xs uppercase tracking-[0.25em] text-[#C9A96A] font-mono">
                {language === 'fa' ? 'فهرست بخش‌های راشا' : 'Navigation Menu'}
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full bg-white/[0.05] border border-white/10 text-[#9B9B95] hover:text-[#F4F0E8] cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-2 py-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-left rtl:text-right text-base sm:text-lg font-serif-display text-[#F4F0E8] hover:text-[#C9A96A] transition-colors py-2.5 px-3 rounded-xl hover:bg-white/[0.03] flex items-center justify-between group cursor-pointer"
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-white/20 group-hover:text-[#C9A96A] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all">
                    ←
                  </span>
                </button>
              ))}
            </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-white/10 mt-6">
            {/* Mobile Action Buttons */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuickCall();
              }}
              className="w-full py-3 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs uppercase tracking-wider rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>{language === 'fa' ? 'تماس سریع و فوری با مشاور' : 'Priority Quick Call'}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAi();
              }}
              className="w-full py-3 bg-[#111313] hover:bg-[#161818] border border-[#C9A96A]/40 text-[#DFBA73] text-xs uppercase tracking-wider rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-[#C9A96A]" />
              <span>{language === 'fa' ? 'گفتگو با مشاور هوش مصنوعی راشا ۲۴/۷' : 'Ask RASHA AI Advisor 24/7'}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAssessment();
              }}
              className="w-full py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-[#D1D1C7] text-xs uppercase tracking-wider rounded-xl font-medium flex items-center justify-center gap-2 cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4 text-[#C9A96A]" />
              <span>{language === 'fa' ? 'فرم ارزیابی جامع پرونده' : 'Complete Assessment Form'}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2 bg-black/40 border border-white/[0.06] text-[#888] hover:text-[#C9A96A] text-[11px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-[#C9A96A]" />
              <span>{language === 'fa' ? 'ورود به پنل مدیریت سایت' : 'Admin Suite'}</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
              <span className="text-xs text-[#9B9B95] uppercase tracking-wider">
                {language === 'fa' ? 'زبان / Language' : 'Language'}
              </span>
              <div className="flex gap-1.5">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onLanguageChange(l.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                      language === l.code
                        ? 'border-[#C9A96A] text-[#DFBA73] bg-[#C9A96A]/10 font-bold'
                        : 'border-white/10 text-[#9B9B95] hover:border-white/20'
                    }`}
                  >
                    {l.flag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
};
