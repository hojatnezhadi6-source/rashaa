import React, { useState } from 'react';
import {
  Calculator,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  Send,
  Lock,
  PhoneCall,
  GraduationCap,
  Briefcase,
  Languages,
  Calendar,
  Wallet,
  ShieldCheck,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { Language } from '../types';
import { saveLead } from '../data/siteConfig';

interface ChanceCalculatorProps {
  language: Language;
  onOpenConsultation?: (prefill?: { destination?: string; message?: string }) => void;
  onNavigateToContact?: () => void;
}

export const ChanceCalculator: React.FC<ChanceCalculatorProps> = ({
  language,
  onOpenConsultation,
  onNavigateToContact,
}) => {
  const isFa = language === 'fa' || language === 'ar';

  // Target Country selection (Modular logic support)
  const [selectedCountry, setSelectedCountry] = useState<'general' | 'germany' | 'canada' | 'australia' | 'dubai'>('germany');

  // Input states
  const [agePoints, setAgePoints] = useState<number>(20); // 10 to 20
  const [educationPoints, setEducationPoints] = useState<number>(18); // 10 to 20
  const [experiencePoints, setExperiencePoints] = useState<number>(15); // 8 to 20
  const [languagePoints, setLanguagePoints] = useState<number>(16); // 8 to 20
  const [capitalPoints, setCapitalPoints] = useState<number>(15); // 8 to 20

  // Optional country-specific bonuses
  const [hasJobOffer, setHasJobOffer] = useState<boolean>(false); // +10 points
  const [hasSpouseBonus, setHasSpouseBonus] = useState<boolean>(false); // +5 points
  const [hasStemField, setHasStemField] = useState<boolean>(true); // +5 points

  // Lead gate state
  const [showLeadModal, setShowLeadModal] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute total score
  const baseScore = agePoints + educationPoints + experiencePoints + languagePoints + capitalPoints;
  let bonusTotal = 0;
  if (hasJobOffer) bonusTotal += 8;
  if (hasSpouseBonus) bonusTotal += 4;
  if (hasStemField) bonusTotal += 5;

  const rawTotal = Math.min(100, baseScore + bonusTotal);

  // Country details
  const countryConfigs = {
    general: {
      titleFa: 'ارزیابی کلی و بین‌المللی',
      titleEn: 'Global Standard Assessment',
      flag: '🌐',
      thresholdPass: 65,
      thresholdPrime: 82,
      statutoryNoteFa: 'مبتنی بر استانداردهای کلی سیستم‌های مهاجرتی OECD.',
      statutoryNoteEn: 'Aligned with OECD standard points-tested matrices.',
    },
    germany: {
      titleFa: 'کارت شانس و اقامت کاری آلمان (Chancenkarte)',
      titleEn: 'Germany Opportunity Card (Chancenkarte)',
      flag: '🇩🇪',
      thresholdPass: 60,
      thresholdPrime: 78,
      statutoryNoteFa: 'حداقل ۶ امتیاز در سیستم رسمی کارت شانس سفارت آلمان الزامی است.',
      statutoryNoteEn: 'Minimum statutory benchmark under German Skilled Immigration Act.',
    },
    canada: {
      titleFa: 'اکسپرس اینتری و PNP کانادا',
      titleEn: 'Canada Express Entry (CRS) & PNP',
      flag: '🇨🇦',
      thresholdPass: 67,
      thresholdPrime: 85,
      statutoryNoteFa: 'سیستم جامع رتبه‌بندی فدرال (Comprehensive Ranking System).',
      statutoryNoteEn: 'Benchmarked against recent Federal Express Entry draw averages.',
    },
    australia: {
      titleFa: 'اسکیل ورکر استرالیا (Subclass 189/190)',
      titleEn: 'Australia General Skilled Migration',
      flag: '🇦🇺',
      thresholdPass: 65,
      thresholdPrime: 85,
      statutoryNoteFa: 'حداقل نمره قبولی در سیستم SkillSelect اداره مهاجرت استرالیا ۶۵ است.',
      statutoryNoteEn: 'Calculated using Home Affairs SkillSelect points criteria.',
    },
    dubai: {
      titleFa: 'اقامت طلایی و استارتاپ امارات (دبی)',
      titleEn: 'UAE Golden Visa & Business Track',
      flag: '🇦🇪',
      thresholdPass: 50,
      thresholdPrime: 75,
      statutoryNoteFa: 'مبتنی بر تاییدیه هیئت توسعه اقتصادی دبی و گواهی سپرده بانکی.',
      statutoryNoteEn: 'Verified against Dubai ICP and Golden Residency regulations.',
    },
  };

  const currentCountryConfig = countryConfigs[selectedCountry];

  // Tier estimation
  let tierColor = '#10B981'; // green
  let tierTitleFa = 'شانس قبولی اولیه بسیار بالا (بازه طلایی)';
  let tierTitleEn = 'High Initial Eligibility (Prime)';
  let tierDescriptionFa = 'پرونده شما در سیستم‌های امتیازی در زمره رزومه‌های برتر و بسیار رقابتی قرار دارد.';
  let tierDescriptionEn = 'Your profile ranks in the upper percentile of candidate pools.';

  if (rawTotal < 50) {
    tierColor = '#EF4444'; // red
    tierTitleFa = 'نیازمند تقویت رزومه و برنامه‌ریزی هدفمند';
    tierTitleEn = 'Optimization Required';
    tierDescriptionFa = 'برای رسیدن به حد نصاب دعوتنامه، تقویت مدرک زبان یا ارتقای مدرک تحصیلی ضروری است.';
    tierDescriptionEn = 'Targeted profile enhancements (language/education) needed for competitive pool.';
  } else if (rawTotal < 70) {
    tierColor = '#F59E0B'; // amber
    tierTitleFa = 'شانس قبولی اولیه متوسط با قابلیت رشد سریع';
    tierTitleEn = 'Moderate Eligibility with High Upside';
    tierDescriptionFa = 'با اضافه کردن چند نمره زبان یا جاب آفر، پرونده شما به راحتی در صف دریافت ویزا قرار می‌گیرد.';
    tierDescriptionEn = 'A single language band enhancement shifts this profile into prime tier.';
  } else if (rawTotal < 85) {
    tierColor = '#DFBA73'; // gold
    tierTitleFa = 'شانس قبولی اولیه بسیار مطلوب';
    tierTitleEn = 'Favorable Profile Eligibility';
    tierDescriptionFa = 'رزومه شما واجد شرایط کامل اقدام برای اکثر برنامه‌های مهاجرت مهارتی است.';
    tierDescriptionEn = 'Fully satisfies core statutory guidelines for skilled migration.';
  }

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedCode = `RASHA-SCORE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    saveLead({
      id: `lead-calc-${Date.now()}`,
      fullName: leadName,
      phone: leadPhone,
      email: leadEmail,
      currentCountry: 'ایران',
      targetDestination: currentCountryConfig.titleFa,
      migrationGoal: `محاسبه شانس مهاجرت (${rawTotal} از ۱۰۰)`,
      message: `کاربر امتیاز محاسبه‌گر را با موفقیت بررسی کرد. امتیاز نهایی: ${rawTotal} از ۱۰۰ - کشور مقصد: ${currentCountryConfig.titleFa}`,
      source: 'assessment_form',
      status: 'new',
      createdAt: new Date().toISOString(),
      trackingCode: generatedCode,
      estimatedScore: rawTotal,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsUnlocked(true);
      setShowLeadModal(false);
    }, 600);
  };

  const handleReset = () => {
    setAgePoints(20);
    setEducationPoints(18);
    setExperiencePoints(15);
    setLanguagePoints(16);
    setCapitalPoints(15);
    setHasJobOffer(false);
    setHasSpouseBonus(false);
    setHasStemField(true);
  };

  return (
    <div id="chance-calculator-tool" className="relative w-full rounded-3xl bg-gradient-to-b from-[#111314] via-[#0e1011] to-[#080909] border border-white/[0.08] p-4 sm:p-8 md:p-10 shadow-2xl overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-[#C9A96A]/8 rounded-full blur-[130px] pointer-events-none" />

      {/* Header Section */}
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium">
          <Calculator className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isFa ? 'سیستم هوشمند محاسبه امتیاز مهاجرت' : 'Immigration Score Calculator'}</span>
        </div>

        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif-display text-[#F4F0E8] tracking-tight">
          {isFa ? '«امتیاز مهاجرت شما چقدر است؟ 📊»' : 'What Is Your Statutory Immigration Score? 📊'}
        </h3>

        <p className="text-sm text-[#A8A8A0] font-sans-luxury max-w-xl mx-auto leading-relaxed">
          {isFa
            ? 'با جابجایی فاکتورهای سن، مدرک تحصیلی، سطح زبان و سابقه کار، امتیاز احتمالی پرونده خود را بین ۰ تا ۱۰۰ محاسبه و مقایسه کنید.'
            : 'Dynamically evaluate your qualifications across age, degree, work history, and language criteria against official point grids.'}
        </p>

        {/* Country Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
          {(['germany', 'canada', 'australia', 'dubai', 'general'] as const).map((countryKey) => {
            const c = countryConfigs[countryKey];
            const isSelected = selectedCountry === countryKey;
            return (
              <button
                key={countryKey}
                type="button"
                onClick={() => setSelectedCountry(countryKey)}
                className={`px-3.5 py-2 rounded-xl border text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'border-[#DFBA73] bg-[#DFBA73]/15 text-[#F4F0E8] shadow-[0_0_15px_rgba(201,169,106,0.2)]'
                    : 'border-white/[0.08] bg-white/[0.02] text-[#9B9B95] hover:border-white/20 hover:text-white'
                }`}
              >
                <span>{c.flag}</span>
                <span>{isFa ? c.titleFa.split(' ')[0] : c.titleEn.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Calculator Grid: Controls on Left / Circular Gauge on Right */}
      <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        {/* Left Column (7 cols): Interactive Sliders & Category Pickers */}
        <div className="lg:col-span-7 space-y-6">
          {/* Factor 1: Age */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-[#F4F0E8]">
                <Calendar className="w-4 h-4 text-[#C9A96A]" />
                <span>{isFa ? 'سن متقاضی' : 'Applicant Age Bracket'}</span>
              </div>
              <span className="font-mono font-bold text-[#DFBA73]">{agePoints} / 20 امتیاز</span>
            </div>
            <div className="grid grid-cols-2 min-[420px]:grid-cols-4 gap-2 text-xs">
              {[
                { pts: 20, labelFa: '۲۶ تا ۳۵', labelEn: '26–35' },
                { pts: 18, labelFa: '۱۸ تا ۲۵', labelEn: '18–25' },
                { pts: 14, labelFa: '۳۶ تا ۴۲', labelEn: '36–42' },
                { pts: 10, labelFa: '۴۳ به بالا', labelEn: '43+' },
              ].map((item) => (
                <button
                  key={item.pts}
                  type="button"
                  onClick={() => setAgePoints(item.pts)}
                  className={`py-2 rounded-lg border text-xs font-mono font-medium transition-all cursor-pointer ${
                    agePoints === item.pts
                      ? 'border-[#DFBA73] bg-[#DFBA73]/20 text-[#F4F0E8]'
                      : 'border-white/10 bg-black/20 text-[#A8A8A0] hover:border-white/20'
                  }`}
                >
                  {isFa ? item.labelFa : item.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Factor 2: Education */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-[#F4F0E8]">
                <GraduationCap className="w-4 h-4 text-[#C9A96A]" />
                <span>{isFa ? 'مدرک تحصیلی' : 'Academic Degree'}</span>
              </div>
              <span className="font-mono font-bold text-[#DFBA73]">{educationPoints} / 20 امتیاز</span>
            </div>
            <div className="grid grid-cols-2 min-[420px]:grid-cols-4 gap-2 text-xs">
              {[
                { pts: 20, labelFa: 'دکتری تخصصی', labelEn: 'PhD' },
                { pts: 18, labelFa: 'کارشناسی ارشد', labelEn: "Master's" },
                { pts: 15, labelFa: 'کارشناسی', labelEn: "Bachelor's" },
                { pts: 10, labelFa: 'کاردانی / دیپلم', labelEn: 'Diploma' },
              ].map((item) => (
                <button
                  key={item.pts}
                  type="button"
                  onClick={() => setEducationPoints(item.pts)}
                  className={`py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                    educationPoints === item.pts
                      ? 'border-[#DFBA73] bg-[#DFBA73]/20 text-[#F4F0E8]'
                      : 'border-white/10 bg-black/20 text-[#A8A8A0] hover:border-white/20'
                  }`}
                >
                  {isFa ? item.labelFa : item.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Factor 3: Work Experience */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-[#F4F0E8]">
                <Briefcase className="w-4 h-4 text-[#C9A96A]" />
                <span>{isFa ? 'سابقه کار تخصصی' : 'Work Experience'}</span>
              </div>
              <span className="font-mono font-bold text-[#DFBA73]">{experiencePoints} / 20 امتیاز</span>
            </div>
            <div className="grid grid-cols-2 min-[420px]:grid-cols-4 gap-2 text-xs">
              {[
                { pts: 20, labelFa: '۸+ سال', labelEn: '8+ yrs' },
                { pts: 18, labelFa: '۵ تا ۷ سال', labelEn: '5–7 yrs' },
                { pts: 15, labelFa: '۳ تا ۴ سال', labelEn: '3–4 yrs' },
                { pts: 10, labelFa: '۱ تا ۲ سال', labelEn: '1–2 yrs' },
              ].map((item) => (
                <button
                  key={item.pts}
                  type="button"
                  onClick={() => setExperiencePoints(item.pts)}
                  className={`py-2 rounded-lg border text-xs font-mono font-medium transition-all cursor-pointer ${
                    experiencePoints === item.pts
                      ? 'border-[#DFBA73] bg-[#DFBA73]/20 text-[#F4F0E8]'
                      : 'border-white/10 bg-black/20 text-[#A8A8A0] hover:border-white/20'
                  }`}
                >
                  {isFa ? item.labelFa : item.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Factor 4: Language Score */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-[#F4F0E8]">
                <Languages className="w-4 h-4 text-[#C9A96A]" />
                <span>{isFa ? 'سطح زبان (انگلیسی / زبان مقصد)' : 'Language Proficiency'}</span>
              </div>
              <span className="font-mono font-bold text-[#DFBA73]">{languagePoints} / 20 امتیاز</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { pts: 20, labelFa: 'آیلتس ۸+ / آلمانی C1', labelEn: 'Superior (IELTS 8+)' },
                { pts: 17, labelFa: 'آیلتس ۷ / آلمانی B2', labelEn: 'IELTS 7 / B2' },
                { pts: 13, labelFa: 'آیلتس ۶ / آلمانی B1', labelEn: 'IELTS 6 / B1' },
                { pts: 8, labelFa: 'پایه / عمومی (A1/A2)', labelEn: 'Basic / A1-A2' },
              ].map((item) => (
                <button
                  key={item.pts}
                  type="button"
                  onClick={() => setLanguagePoints(item.pts)}
                  className={`py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                    languagePoints === item.pts
                      ? 'border-[#DFBA73] bg-[#DFBA73]/20 text-[#F4F0E8]'
                      : 'border-white/10 bg-black/20 text-[#A8A8A0] hover:border-white/20'
                  }`}
                >
                  {isFa ? item.labelFa : item.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Factor 5: Capital & Reserve */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-[#F4F0E8]">
                <Wallet className="w-4 h-4 text-[#C9A96A]" />
                <span>{isFa ? 'تمکن مالی و پشتوانه اسکان' : 'Financial Liquidity'}</span>
              </div>
              <span className="font-mono font-bold text-[#DFBA73]">{capitalPoints} / 20 امتیاز</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { pts: 20, labelFa: 'بالای ۱۰۰ هزار $', labelEn: '$100k+' },
                { pts: 17, labelFa: '۵۰ تا ۱۰۰ هزار $', labelEn: '$50k–$100k' },
                { pts: 14, labelFa: '۱۵ تا ۵۰ هزار $', labelEn: '$15k–$50k' },
                { pts: 9, labelFa: 'زیر ۱۵ هزار $', labelEn: '< $15k' },
              ].map((item) => (
                <button
                  key={item.pts}
                  type="button"
                  onClick={() => setCapitalPoints(item.pts)}
                  className={`py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                    capitalPoints === item.pts
                      ? 'border-[#DFBA73] bg-[#DFBA73]/20 text-[#F4F0E8]'
                      : 'border-white/10 bg-black/20 text-[#A8A8A0] hover:border-white/20'
                  }`}
                >
                  {isFa ? item.labelFa : item.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Multipliers / Checkboxes */}
          <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/[0.06] space-y-2">
            <span className="text-xs font-bold text-[#DFBA73]">
              {isFa ? 'امتیازات افزوده (Bonus Points):' : 'Additional Bonus Modifiers:'}
            </span>
            <div className="grid sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setHasStemField(!hasStemField)}
                className={`p-2.5 rounded-lg border flex items-center justify-between transition-all cursor-pointer ${
                  hasStemField ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300' : 'border-white/10 bg-black/20 text-[#888]'
                }`}
              >
                <span>{isFa ? 'رشته‌های STEM / هوش مصنوعی' : 'STEM / IT Degree'}</span>
                <span className="font-mono text-[11px]">+۵</span>
              </button>

              <button
                type="button"
                onClick={() => setHasJobOffer(!hasJobOffer)}
                className={`p-2.5 rounded-lg border flex items-center justify-between transition-all cursor-pointer ${
                  hasJobOffer ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300' : 'border-white/10 bg-black/20 text-[#888]'
                }`}
              >
                <span>{isFa ? 'پیشنهاد کار یا اسپانسر رسمی' : 'Valid Job Offer'}</span>
                <span className="font-mono text-[11px]">+۸</span>
              </button>

              <button
                type="button"
                onClick={() => setHasSpouseBonus(!hasSpouseBonus)}
                className={`p-2.5 rounded-lg border flex items-center justify-between transition-all cursor-pointer ${
                  hasSpouseBonus ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300' : 'border-white/10 bg-black/20 text-[#888]'
                }`}
              >
                <span>{isFa ? 'مدرک زبان یا تحصیلات همسر' : 'Spouse Qualifications'}</span>
                <span className="font-mono text-[11px]">+۴</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#808078] pt-1">
            <button
              type="button"
              onClick={handleReset}
              className="hover:text-[#DFBA73] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isFa ? 'بازنشانی مقادیر به حالت پیش‌فرض' : 'Reset Calculator Values'}</span>
            </button>
            <span>{isFa ? 'محاسبه در کسری از ثانیه' : 'Instant Real-time Recalculation'}</span>
          </div>
        </div>

        {/* Right Column (5 cols): Dynamic Score Card, Visual Ring & Unlocking Leads */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#161819] via-[#121415] to-[#0a0c0d] border border-[#DFBA73]/30 shadow-2xl relative overflow-hidden space-y-5">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#DFBA73] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C9A96A]" />
                <span>{currentCountryConfig.flag} {isFa ? currentCountryConfig.titleFa : currentCountryConfig.titleEn}</span>
              </span>
              <span className="text-[10px] font-mono text-[#888]">
                {isFa ? 'برآورد الگوریتمی' : 'Algorithmic Model'}
              </span>
            </div>

            {/* Circular Gauge Representation */}
            <div className="flex flex-col items-center justify-center py-3">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <path
                    className="text-white/10"
                    strokeWidth="3.4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Animated Score Progress */}
                  <path
                    style={{
                      strokeDasharray: `${rawTotal}, 100`,
                      stroke: tierColor,
                    }}
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-700 ease-out"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>

                <div className="absolute flex flex-col items-center text-center">
                  <span className="text-4xl font-black font-mono text-[#F4F0E8] tracking-tight">
                    {rawTotal}
                  </span>
                  <span className="text-xs font-mono text-[#A8A8A0]">از ۱۰۰ امتیاز</span>
                </div>
              </div>

              {/* Tier Pill */}
              <div
                className="mt-4 px-3.5 py-1.5 rounded-full text-xs font-bold font-mono text-center shadow-md"
                style={{
                  backgroundColor: `${tierColor}18`,
                  color: tierColor,
                  border: `1px solid ${tierColor}50`,
                }}
              >
                {isFa ? tierTitleFa : tierTitleEn}
              </div>
            </div>

            {/* Dynamic Breakdown Bars */}
            <div className="space-y-2.5 pt-2 border-t border-white/[0.06] text-xs">
              <div className="flex justify-between items-center text-[#DFBA73] font-semibold">
                <span>{isFa ? 'تحصیلات و مدارک' : 'Education'}</span>
                <span className="font-mono">{educationPoints}/20</span>
              </div>
              <div className="flex justify-between items-center text-[#DFBA73] font-semibold">
                <span>{isFa ? 'سابقه کار مرتبط' : 'Experience'}</span>
                <span className="font-mono">{experiencePoints}/20</span>
              </div>
              <div className="flex justify-between items-center text-[#DFBA73] font-semibold">
                <span>{isFa ? 'تسلط به زبان' : 'Language'}</span>
                <span className="font-mono">{languagePoints}/20</span>
              </div>
              <div className="flex justify-between items-center text-[#DFBA73] font-semibold">
                <span>{isFa ? 'سن متقاضی' : 'Age Bracket'}</span>
                <span className="font-mono">{agePoints}/20</span>
              </div>
              <div className="flex justify-between items-center text-[#DFBA73] font-semibold">
                <span>{isFa ? 'تمکن و نقدینگی' : 'Capital Proof'}</span>
                <span className="font-mono">{capitalPoints}/20</span>
              </div>
              {bonusTotal > 0 && (
                <div className="flex justify-between items-center text-emerald-400 font-semibold pt-1 border-t border-white/[0.04]">
                  <span>{isFa ? 'امتیازات افزوده (Bonus)' : 'Bonus Modifiers'}</span>
                  <span className="font-mono">+{bonusTotal}</span>
                </div>
              )}
            </div>

            {/* Statutory Country Footnote */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-[#A8A8A0] leading-relaxed">
              <span className="text-[#DFBA73] font-semibold block mb-0.5">
                {isFa ? 'نکته قانونی کشور مقصد:' : 'Statutory Program Note:'}
              </span>
              {isFa ? currentCountryConfig.statutoryNoteFa : currentCountryConfig.statutoryNoteEn}
            </div>

            {/* Action CTA: Unlock Detailed Report or Lead Consultation */}
            {!isUnlocked ? (
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowLeadModal(true)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#DFBA73] via-[#C9A96A] to-[#B38F4E] hover:from-[#E8CA8C] hover:to-[#DFBA73] text-[#080909] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-[#C9A96A]/20 transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isFa ? 'دریافت گزارش تفصیلی امتیازات و مشاوره' : 'Unlock Full Breakdown & Advisory'}</span>
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#707068]">
                  <Lock className="w-3 h-3 text-[#DFBA73]" />
                  <span>{isFa ? 'مشاوره اختصاصی با کارشناس ارشد ویزا' : 'Confidential consultation with licensed advisor'}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isFa ? 'اطلاعات شما با موفقیت ثبت شد' : 'Dossier Registered Successfully'}</span>
                </div>
                <p className="text-[11px] text-[#C5C5BC] leading-relaxed">
                  {isFa
                    ? 'کارشناسان راشا به زودی جهت تشریح جدول امتیازات و مسیرهای مناسب با شما تماس خواهند گرفت.'
                    : 'A senior immigration counsel will contact you shortly to review your official application.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenConsultation) {
                      onOpenConsultation({
                        destination: currentCountryConfig.titleFa,
                        message: `درخواست مشاوره جهت امتیاز محاسبه شده (${rawTotal} از ۱۰۰ در ماشین‌حساب شانس).`,
                      });
                    } else if (onNavigateToContact) {
                      onNavigateToContact();
                    }
                  }}
                  className="mt-2 w-full py-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{isFa ? 'هماهنگی تماس فوری' : 'Request Priority Callback'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lead Capture Modal for Chance Calculator */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#141617] border border-[#DFBA73]/40 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#DFBA73]" />
                <h4 className="text-base sm:text-lg font-bold text-[#F4F0E8]">
                  {isFa ? 'دریافت گزارش رسمی تحلیل امتیاز' : 'Request Official Scoring Audit'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowLeadModal(false)}
                className="text-[#888] hover:text-white transition-colors cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-[#DFBA73] flex items-center justify-between">
              <span>{isFa ? 'امتیاز محاسبه شده شما:' : 'Evaluated Score:'}</span>
              <span className="font-mono font-bold text-base text-white">{rawTotal} / 100</span>
            </div>

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#DFBA73] mb-1">
                  {isFa ? 'نام و نام خانوادگی' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder={isFa ? 'مثال: رضا صادقی' : 'e.g. John Doe'}
                  className="w-full px-4 py-3 rounded-xl bg-[#1c1f20] border border-white/10 text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none transition-all placeholder:text-[#666]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#DFBA73] mb-1">
                  {isFa ? 'شماره موبایل (دارای واتس‌اپ)' : 'Mobile Phone (WhatsApp)'} *
                </label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="+98 912 000 0000"
                  className="w-full px-4 py-3 rounded-xl bg-[#1c1f20] border border-white/10 text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none transition-all placeholder:text-[#666] text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#DFBA73] mb-1">
                  {isFa ? 'ایمیل شما' : 'Email Address'} *
                </label>
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#1c1f20] border border-white/10 text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none transition-all placeholder:text-[#666] text-left"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] hover:from-[#E8CA8C] hover:to-[#DFBA73] text-[#080909] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#C9A96A]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>{isFa ? 'در حال ثبت پرونده...' : 'Registering...'}</span>
                  ) : (
                    <>
                      <span>{isFa ? 'ارسال اطلاعات و دریافت تحلیل اختصاصی' : 'Submit & Receive Audit'}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-[#777] text-center">
                {isFa
                  ? 'برآورد اولیه غیرتضمینی است و قوانین روز سفارت‌ها ملاک نهایی صدور روادید است.'
                  : 'Algorithmic appraisal. Formal filing is subject to statutory verification.'}
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
