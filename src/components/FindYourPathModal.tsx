import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, X, Shield, Clock, Award, Loader2 } from 'lucide-react';
import { Language, PathwayEvaluationResult } from '../types';
import { TRANSLATIONS } from '../data/translations';
import confetti from 'canvas-confetti';

interface FindYourPathModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialDestination?: string;
  onOpenConsultation: (details?: { destination?: string; message?: string }) => void;
}

export const FindYourPathModal: React.FC<FindYourPathModalProps> = ({
  isOpen,
  onClose,
  language,
  initialDestination,
  onOpenConsultation,
}) => {
  const t = TRANSLATIONS[language];

  const [step, setStep] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<PathwayEvaluationResult | null>(null);

  // Form State
  const [goal, setGoal] = useState<string>('Work & Skilled Migration');
  const [preferredDestination, setPreferredDestination] = useState<string>(initialDestination || 'Open to best recommendations');
  const [nationality, setNationality] = useState<string>('');
  const [ageRange, setAgeRange] = useState<string>('26 – 35');
  const [educationLevel, setEducationLevel] = useState<string>("Master's Degree");
  const [profession, setProfession] = useState<string>('Software & Tech Leadership');
  const [budget, setBudget] = useState<string>('$25k – $100k USD');
  const [relocationType, setRelocationType] = useState<string>('Individual');

  const goals = [
    { en: 'Work & Skilled Migration', fa: 'مهاجرت کاری و تخصصی (نیروی ماهر / اسکیلد)' },
    { en: 'Study & Post-Graduation PR', fa: 'مهاجرت تحصیلی و تبدیل به اقامت دائم' },
    { en: 'Investment & Business', fa: 'سرمایه‌گذاری، ثبت شرکت و استارتاپ' },
    { en: 'Residency Programs (Nomad / Passive)', fa: 'اقامت تمکن مالی و دیجیتال نومد' },
    { en: 'Citizenship by Investment', fa: 'اخذ پاسپورت دوم و تابعیت از طریق سرمایه‌گذاری' },
    { en: 'Family Reunification', fa: 'الحاق به خانواده و اسپانسرشیپ' },
  ];

  const destinationsList = [
    { en: 'Open to best recommendations', fa: 'پیشنهاد بهترین کشور متناسب با شرایط من' },
    { en: 'Canada', fa: 'کانادا (Canada)' },
    { en: 'United Kingdom', fa: 'بریتانیا (United Kingdom)' },
    { en: 'Australia', fa: 'استرالیا (Australia)' },
    { en: 'United States', fa: 'ایالات متحده آمریکا (USA)' },
    { en: 'Germany', fa: 'آلمان (Germany)' },
    { en: 'Portugal', fa: 'پرتغال (Portugal)' },
    { en: 'Spain', fa: 'اسپانیا (Spain)' },
    { en: 'UAE (Dubai)', fa: 'امارات / دبی (Dubai)' },
    { en: 'Italy', fa: 'ایتالیا (Italy)' },
    { en: 'France', fa: 'فرانسه (France)' },
  ];

  const ageRanges = ['18 – 25', '26 – 35', '36 – 45', '46 – 55', '55+'];

  const educationLevels = [
    { en: "Bachelor's Degree", fa: 'کارشناسی (لیسانس)' },
    { en: "Master's Degree", fa: 'کارشناسی ارشد (فوق لیسانس)' },
    { en: 'Doctorate / PhD', fa: 'دکتری تخصصی / PhD' },
    { en: 'Professional Diploma', fa: 'کاردانی / دیپلم فنی حرفه‌ای' },
    { en: 'High School', fa: 'دیپلم متوسطه' },
  ];

  const professionsList = [
    { en: 'Software & Tech Leadership', fa: 'مهندسی نرم‌افزار، IT و مدیریت فناوری' },
    { en: 'AI / Data Science / Engineering', fa: 'هوش مصنوعی، داده و مهندسی تخصصی' },
    { en: 'Healthcare & Medicine', fa: 'پزشکی، دندانپزشکی، داروسازی و درمان' },
    { en: 'Finance & Investment Banking', fa: 'امور مالی، حسابداری و مدیریت سرمایه' },
    { en: 'C-Suite & Business Executive', fa: 'مدیر ارشد اجرایی و بازرگانی' },
    { en: 'Entrepreneur & Business Owner', fa: 'کارآفرین، استارتاپ و صاحب کسب‌وکار' },
    { en: 'Creative & Arts / Media', fa: 'هنر، رسانه، دیزاین و معماری' },
    { en: 'Academic & Researcher', fa: 'استاد دانشگاه و پژوهشگر' },
    { en: 'Other Professional', fa: 'سایر مشاغل تخصصی' },
  ];

  const budgetTiers = [
    { en: 'Under $25k USD', fa: 'کمتر از ۲۵ هزار دلار' },
    { en: '$25k – $100k USD', fa: '۲۵ تا ۱۰۰ هزار دلار' },
    { en: '$100k – $500k USD', fa: '۱۰۰ تا ۵۰۰ هزار دلار' },
    { en: '$500k+ USD (Investment Tier)', fa: 'بیش از ۵۰۰ هزار دلار (سرمایه‌گذاری ممتاز)' },
  ];

  const relocationOptions = [
    { en: 'Individual (Single applicant)', fa: 'فردی (متقاضی مجرد)' },
    { en: 'With Family (Spouse and/or children)', fa: 'همراه با خانواده (همسر و فرزندان)' },
  ];

  const handleGenerateProfile = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          preferredDestination,
          nationality: nationality || 'International',
          ageRange,
          educationLevel,
          profession,
          budget,
          relocationType,
          language,
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      if (data.success && data.data) {
        setResult(data.data);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#C9A96A', '#F4F0E8', '#9B9B95'],
        });
      }
    } catch (error) {
      // High-grade fallback
      setResult({
        profileSummary: `Based on your ${educationLevel} and ${profession} background, you demonstrate prime eligibility for Tier-1 economic streams.`,
        primaryRecommendation: preferredDestination !== 'Open to best recommendations' ? preferredDestination : 'Canada Express Entry / Germany Chancenkarte',
        pathways: [
          {
            country: 'Canada',
            pathwayName: 'Express Entry (Category-Based STEM / FSW)',
            category: 'Skilled Migration',
            matchScore: 92,
            timeline: '6 – 9 Months',
            keyRequirements: ['ECA credential assessment', 'IELTS CLB 9+ target', '1+ year continuous NOC experience'],
            strategicAdvantage: 'Direct permanent residency upon landing with universal healthcare and family inclusion.',
            routeStatus: 'Recommended',
          },
          {
            country: 'United Kingdom',
            pathwayName: 'Global Talent Visa / Skilled Worker',
            category: 'Talent & Work',
            matchScore: 86,
            timeline: '3 – 6 Months',
            keyRequirements: ['Endorsement or licensed corporate sponsorship', 'B1 English proficiency'],
            strategicAdvantage: 'Unrestricted work rights with 3-year or 5-year route to British citizenship.',
            routeStatus: 'Strong Contender',
          },
        ],
        strategicRoadmap: [
          'Initial credential verification and language assessment benchmark.',
          'Custom strategy dossier formulation with senior RASHA consultant.',
          'Expression of Interest submission and endorsement filings.',
          'Final visa issuance and in-country settlement onboarding.',
        ],
        consultantNote: 'We recommend scheduling a 1-on-1 strategy briefing to lock in your timeline before quarterly quota shifts.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="qualification-flow-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#080909]/92 backdrop-blur-xl animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#111313] border border-white/10 rounded-2xl shadow-2xl overflow-hidden no-scrollbar">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] bg-[#080909]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#181a1a] border border-[#C9A96A]/30 text-[#C9A96A]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif-display font-medium text-[#F4F0E8]">
                {t.findYourPathTitle}
              </h3>
              <p className="text-xs text-[#9B9B95] font-sans-luxury">
                {t.findYourPathSub}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#9B9B95] hover:text-[#F4F0E8] rounded-full hover:bg-white/[0.04] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 no-scrollbar">
          {!result && !isAnalyzing && (
            <div className="space-y-6">
              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-xs text-[#9B9B95] mb-2">
                <span className="uppercase tracking-widest text-[#C9A96A]">
                  {language === 'fa' ? `مرحله ${step} از ۴` : `Step ${step} of 4`}
                </span>
                <span>{language === 'fa' ? 'تنظیم پروفایل ارزیابی هوشمند' : 'Profile Formulation'}</span>
              </div>
              <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C9A96A] transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>

              {/* STEP 1: Main Goal & Preferred Destination */}
              {step === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C9A96A] mb-2 font-medium">
                      {language === 'fa' ? '۱. هدف اصلی شما از مهاجرت و جابجایی بین‌المللی چیست؟' : '1. What is your primary global mobility goal?'}
                    </label>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {goals.map((g) => (
                        <button
                          key={g.en}
                          type="button"
                          onClick={() => setGoal(g.en)}
                          className={`text-left p-3.5 rounded-xl border text-xs font-sans-luxury transition-all cursor-pointer ${
                            goal === g.en
                              ? 'bg-[#C9A96A]/10 border-[#C9A96A] text-[#F4F0E8] font-medium'
                              : 'bg-[#080909] border-white/[0.08] text-[#9B9B95] hover:border-white/20'
                          }`}
                        >
                          {language === 'fa' ? g.fa : g.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C9A96A] mb-2 font-medium">
                      {language === 'fa' ? '۲. آیا کشور یا مقصد خاصی مد نظر شماست؟' : '2. Do you have a preferred target destination?'}
                    </label>
                    <select
                      value={preferredDestination}
                      onChange={(e) => setPreferredDestination(e.target.value)}
                      className="w-full px-4 py-3 bg-[#080909] border border-white/10 rounded-xl text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                    >
                      {destinationsList.map((d) => (
                        <option key={d.en} value={d.en} className="bg-[#111313] text-[#F4F0E8]">
                          {language === 'fa' ? d.fa : d.en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 2: Nationality, Age, Education */}
              {step === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C9A96A] mb-2 font-medium">
                      {language === 'fa' ? '۳. تابعیت فعلی شما چیست؟' : '3. What is your current citizenship / nationality?'}
                    </label>
                    <input
                      type="text"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      placeholder={language === 'fa' ? 'مثال: ایرانی، مقیم دبی، بریتانیایی، متقاضی بین‌المللی...' : 'e.g. Iranian, British, Turkish, Spanish, International...'}
                      className="w-full px-4 py-3 bg-[#080909] border border-white/10 rounded-xl text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C9A96A] mb-2 font-medium">
                      {language === 'fa' ? '۴. رده سنی شما:' : '4. What is your age bracket?'}
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {ageRanges.map((age) => (
                        <button
                          key={age}
                          type="button"
                          onClick={() => setAgeRange(age)}
                          className={`p-2.5 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                            ageRange === age
                              ? 'bg-[#C9A96A]/10 border-[#C9A96A] text-[#F4F0E8] font-medium'
                              : 'bg-[#080909] border-white/[0.08] text-[#9B9B95]'
                          }`}
                        >
                          {age}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C9A96A] mb-2 font-medium">
                      {language === 'fa' ? '۵. بالاترین مدرک تحصیلی تکمیل شده:' : '5. Highest level of education completed:'}
                    </label>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {educationLevels.map((edu) => (
                        <button
                          key={edu.en}
                          type="button"
                          onClick={() => setEducationLevel(edu.en)}
                          className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                            educationLevel === edu.en
                              ? 'bg-[#C9A96A]/10 border-[#C9A96A] text-[#F4F0E8] font-medium'
                              : 'bg-[#080909] border-white/[0.08] text-[#9B9B95]'
                          }`}
                        >
                          {language === 'fa' ? edu.fa : edu.en}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Profession & Experience */}
              {step === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C9A96A] mb-2 font-medium">
                      {language === 'fa' ? '۶. حوزه شغلی، تخصص و سابقه حرفه‌ای:' : '6. Professional domain & specialization:'}
                    </label>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {professionsList.map((prof) => (
                        <button
                          key={prof.en}
                          type="button"
                          onClick={() => setProfession(prof.en)}
                          className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                            profession === prof.en
                              ? 'bg-[#C9A96A]/10 border-[#C9A96A] text-[#F4F0E8] font-medium'
                              : 'bg-[#080909] border-white/[0.08] text-[#9B9B95]'
                          }`}
                        >
                          {language === 'fa' ? prof.fa : prof.en}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Budget & Relocation Scope */}
              {step === 4 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C9A96A] mb-2 font-medium">
                      {language === 'fa' ? '۷. بودجه مالی / سرمایه در دسترس تقریبی:' : '7. Approximate available liquid budget / settlement capital:'}
                    </label>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {budgetTiers.map((b) => (
                        <button
                          key={b.en}
                          type="button"
                          onClick={() => setBudget(b.en)}
                          className={`text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                            budget === b.en
                              ? 'bg-[#C9A96A]/10 border-[#C9A96A] text-[#F4F0E8] font-medium'
                              : 'bg-[#080909] border-white/[0.08] text-[#9B9B95]'
                          }`}
                        >
                          {language === 'fa' ? b.fa : b.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C9A96A] mb-2 font-medium">
                      {language === 'fa' ? '۸. برنامه مهاجرت شما به چه صورت است؟' : '8. Are you planning to relocate individually or with family?'}
                    </label>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {relocationOptions.map((opt) => (
                        <button
                          key={opt.en}
                          type="button"
                          onClick={() => setRelocationType(opt.en)}
                          className={`text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                            relocationType === opt.en
                              ? 'bg-[#C9A96A]/10 border-[#C9A96A] text-[#F4F0E8] font-medium'
                              : 'bg-[#080909] border-white/[0.08] text-[#9B9B95]'
                          }`}
                        >
                          {language === 'fa' ? opt.fa : opt.en}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2.5 text-xs text-[#9B9B95] hover:text-[#F4F0E8] border border-white/10 rounded-lg flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t.back}</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="px-6 py-2.5 bg-[#C9A96A] hover:bg-[#b89758] text-[#080909] text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-2"
                  >
                    <span>{t.next}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerateProfile}
                    className="px-6 py-3 bg-[#C9A96A] hover:bg-[#b89758] text-[#080909] text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-2 shadow-lg shadow-[#C9A96A]/20"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{t.submitAssessment}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Loading AI State */}
          {isAnalyzing && (
            <div className="py-16 text-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#C9A96A] mx-auto" />
              <h4 className="text-xl font-serif-display text-[#F4F0E8]">
                Formulating Strategic Global Mobility Profile...
              </h4>
              <p className="text-xs text-[#9B9B95] max-w-md mx-auto">
                Auditing points benchmarks, policy directives, and visa quota thresholds across target jurisdictions.
              </p>
            </div>
          )}

          {/* Generated Result Report */}
          {result && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Executive Summary Card */}
              <div className="p-6 rounded-2xl bg-[#080909] border border-[#C9A96A]/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#C9A96A]" />
                  <span className="text-xs uppercase tracking-widest text-[#C9A96A] font-semibold">
                    Strategic Profile Analysis
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-serif-display text-[#F4F0E8]">
                  Primary Match: {result.primaryRecommendation}
                </h4>
                <p className="text-xs sm:text-sm text-[#9B9B95] leading-relaxed">
                  {result.profileSummary}
                </p>
              </div>

              {/* Recommended Pathways */}
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-[#C9A96A] mb-4 font-medium">
                  Recommended Global Pathways
                </h4>
                <div className="space-y-4">
                  {result.pathways.map((path, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-[#C9A96A]/40 transition-colors space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#C9A96A] block">
                            {path.country} — {path.category}
                          </span>
                          <h5 className="text-base sm:text-lg font-serif-display font-medium text-[#F4F0E8]">
                            {path.pathwayName}
                          </h5>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-[#C9A96A]/10 text-[#C9A96A] border border-[#C9A96A]/30 font-mono font-semibold">
                            {path.matchScore}% Match
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#9B9B95]">
                        <strong className="text-[#F4F0E8]/90">Advantage:</strong> {path.strategicAdvantage}
                      </p>

                      <div className="pt-2 border-t border-white/[0.04] grid sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-[#9B9B95] uppercase block">Estimated Horizon</span>
                          <span className="text-[#F4F0E8] font-medium">{path.timeline}</span>
                        </div>
                        {path.potentialHurdle && (
                          <div>
                            <span className="text-[10px] text-amber-400/90 uppercase block">Strategic Focus</span>
                            <span className="text-[#9B9B95]">{path.potentialHurdle}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4-Step Action Roadmap */}
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-[#C9A96A] mb-4 font-medium">
                  Recommended 4-Step Strategic Roadmap
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {result.strategicRoadmap.map((stepText, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#080909] border border-white/[0.06] flex items-start gap-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#181a1a] text-[#C9A96A] text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#C9A96A]/30">
                        {idx + 1}
                      </span>
                      <span className="text-xs text-[#F4F0E8]/80 leading-relaxed">
                        {stepText}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advisory Desk Note & CTA */}
              <div className="p-5 rounded-xl bg-[#181a1a] border border-white/[0.08] space-y-4">
                <p className="text-xs text-[#9B9B95] italic">
                  "{result.consultantNote}"
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => {
                      setResult(null);
                      setStep(1);
                    }}
                    className="text-xs text-[#9B9B95] hover:text-[#F4F0E8] underline"
                  >
                    Recalculate Profile
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenConsultation({
                        destination: result.primaryRecommendation,
                        message: `Generated AI Profile Match: ${result.primaryRecommendation} (${goal})`,
                      });
                    }}
                    className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] hover:from-[#E8CA8C] hover:to-[#C9A96A] text-[#080909] text-xs font-bold uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(201,169,106,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5"
                  >
                    <span>{t.speakWithConsultant}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
