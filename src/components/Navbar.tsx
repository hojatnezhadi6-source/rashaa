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
    { label: language === 'fa' ? 'دفاتر جهانی' : 'Global Hubs', id: 'global-presence' },
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

  const phoneIran = siteConfig?.phoneIran || '021-8899 0011';
  const whatsappNum = siteConfig?.whatsappNumber || '+971501234567';

  return (
    <>
      {/* Top Thin Priority Hotline Ribbon */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-[#0c0e0e]/95 border-b border-white/[0.06] text-[10px] text-[#9B9B95] px-4 py-1.5 hidden md:flex items-center justify-between font-mono backdrop-blur-md">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#DFBA73]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{language === 'fa' ? 'پاسخگویی سریع ۲۴ ساعته مشاوران بین‌المللی' : '24/7 International Desk'}</span>
            </span>
            <span className="text-white/20">|</span>
            <a href="tel:+982188990011" className="hover:text-[#F4F0E8] transition-colors dir-ltr">
              {language === 'fa' ? `تلفن مشاوره: ${phoneIran}` : `Phone: ${phoneIran}`}
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>{language === 'fa' ? 'پشتیبانی واتس‌اپ' : 'WhatsApp Hotline'}</span>
            </a>
            <span className="text-white/20">|</span>
            {/* Discrete Admin Dashboard link */}
            <button
              id="top-admin-portal-link"
              onClick={onOpenAdmin}
              className="text-[#9B9B95] hover:text-[#C9A96A] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Shield className="w-3 h-3 text-[#C9A96A]" />
              <span>{language === 'fa' ? 'ورود مدیریت' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      <header
        id="main-navbar"
        className={`fixed left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'top-0 md:top-0 bg-[#080909]/92 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-2xl'
            : 'top-0 md:top-7 bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2 text-left group focus:outline-none cursor-pointer shrink-0"
          >
            <div className="text-base sm:text-xl tracking-[0.16em] sm:tracking-[0.25em] font-light text-[#F4F0E8] group-hover:text-[#C9A96A] transition-colors truncate max-w-[170px] min-[420px]:max-w-none">
              RASHA <span className="opacity-50">MOHAJERAT</span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[11px] uppercase tracking-[0.16em] font-medium text-[#9B9B95]">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className="hover:text-[#C9A96A] transition-colors relative py-1 cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Call Button */}
            <button
              id="navbar-quick-call-btn"
              onClick={onOpenQuickCall}
              className="px-3.5 py-1.5 border border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-300 text-[10px] tracking-[0.15em] uppercase font-semibold transition-all flex items-center gap-1.5 rounded-lg cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.15)]"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{language === 'fa' ? 'تماس سریع' : 'Quick Call'}</span>
            </button>

            {/* Assessment Form Button */}
            <button
              id="navbar-assessment-btn"
              onClick={onOpenAssessment}
              className="px-3.5 py-1.5 border border-[#C9A96A]/40 hover:border-[#C9A96A] bg-[#C9A96A]/10 text-[#DFBA73] text-[10px] tracking-[0.14em] uppercase font-semibold transition-all flex items-center gap-1.5 rounded-lg cursor-pointer"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-[#C9A96A]" />
              <span>{language === 'fa' ? 'فرم ارزیابی' : 'Assessment'}</span>
            </button>

            {/* AI Advisor Button */}
            <button
              id="navbar-ai-btn"
              onClick={onOpenAi}
              className="px-3.5 py-1.5 border border-white/10 hover:border-[#C9A96A]/60 bg-white/[0.03] text-[#F4F0E8] text-[10px] tracking-[0.14em] uppercase transition-all flex items-center gap-1.5 rounded-lg cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#C9A96A]" />
              <span>{t.askAiCTA}</span>
            </button>

            {/* Theme Toggle Button (Light / Dark) */}
            {onToggleTheme && (
              <button
                id="navbar-theme-toggle-btn"
                onClick={onToggleTheme}
                title={
                  theme === 'light'
                    ? (language === 'fa' ? 'تغییر به تم تیره' : 'Switch to Dark Mode')
                    : (language === 'fa' ? 'تغییر به تم روشن (سفید)' : 'Switch to Light Mode')
                }
                className="p-2 border border-white/10 hover:border-[#C9A96A]/60 bg-white/[0.03] text-[#DFBA73] hover:text-[#C9A96A] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                {theme === 'light' ? (
                  <Moon className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                )}
              </button>
            )}

            {/* Language Selector */}
            <div className="relative">
              <button
                id="lang-selector-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-mono uppercase text-[#9B9B95] hover:text-[#F4F0E8] border border-white/10 hover:border-[#C9A96A]/40 rounded-lg transition-colors cursor-pointer"
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
            >
              <Shield className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Actions & Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Quick Call Button on Mobile Header */}
            <button
              id="mobile-header-quick-call"
              onClick={onOpenQuickCall}
              className="p-2 text-emerald-400 bg-emerald-950/50 border border-emerald-500/40 rounded-xl min-w-[38px] min-h-[38px] flex items-center justify-center cursor-pointer shadow-sm"
              aria-label="Quick Call"
            >
              <PhoneCall className="w-4 h-4 animate-pulse" />
            </button>

            {/* AI Advisor Shortcut on Mobile Header (Visible on >=380px screens) */}
            <button
              id="mobile-header-ai-btn"
              onClick={onOpenAi}
              className="hidden min-[380px]:flex p-2 text-[#DFBA73] bg-[#111313] border border-[#C9A96A]/40 rounded-xl min-w-[38px] min-h-[38px] items-center justify-center cursor-pointer"
              aria-label="Ask Rasha AI"
            >
              <Sparkles className="w-4 h-4 text-[#C9A96A]" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F4F0E8] hover:text-[#C9A96A] bg-white/[0.04] border border-white/10 rounded-xl min-w-[42px] min-h-[42px] flex items-center justify-center focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#C9A96A]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="fixed inset-0 z-50 bg-[#080909]/98 backdrop-blur-2xl lg:hidden flex flex-col justify-between p-6 pt-20 animate-in fade-in duration-300 overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-5 right-5 rtl:right-auto rtl:left-5 p-2.5 rounded-full bg-white/[0.05] border border-white/10 text-[#9B9B95] hover:text-[#F4F0E8] cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="text-xs uppercase tracking-[0.25em] text-[#C9A96A] font-mono">
                {language === 'fa' ? 'منوی دسترسی سریع راشا' : 'RASHA Quick Menu'}
              </div>
              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg border border-white/10 bg-white/[0.04] text-[#D1D1C7]"
                >
                  {theme === 'light' ? <Moon className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{theme === 'light' ? 'تم تاریک' : 'تم روشن'}</span>
                </button>
              )}
            </div>

            {/* Highlighted Mobile Card for Smart Quiz & Calculator Hub */}
            <button
              onClick={() => handleNavClick('assessment-hub')}
              className="w-full text-right rtl:text-right ltr:text-left p-4 rounded-2xl bg-gradient-to-r from-[#DFBA73]/20 via-[#181a1b] to-[#121415] border border-[#DFBA73]/50 shadow-lg cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="w-8 h-8 rounded-lg bg-[#DFBA73]/20 text-[#DFBA73] flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </span>
                <span className="text-sm font-bold text-[#F4F0E8]">
                  {language === 'fa' ? 'مسیر مناسب مهاجرتت رو پیدا کن ✈️' : 'Immigration Pathway & Points'}
                </span>
              </div>
              <p className="text-[11px] text-[#A8A8A0] font-light">
                {language === 'fa'
                  ? 'تست رایگان چندمرحله‌ای + محاسبه‌گر دقیق امتیاز اقامت'
                  : 'Free multistep assessment quiz & points calculator'}
              </p>
            </button>

            {/* Standard Navigation Links */}
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-left rtl:text-right text-lg sm:text-xl font-serif-display text-[#F4F0E8] hover:text-[#C9A96A] transition-colors py-1 flex items-center justify-between group cursor-pointer"
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-white/20 group-hover:text-[#C9A96A] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all">
                    ←
                  </span>
                </button>
              ))}
            </div>
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
      )}
    </>
  );
};
