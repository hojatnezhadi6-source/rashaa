import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Languages,
  Calendar,
  Wallet,
  Globe2,
  AlertCircle,
  HelpCircle,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Building,
  PlaneTakeoff,
  Award,
  PhoneCall,
  Clock,
  TrendingUp,
  FileCheck,
  Send,
  Lock,
} from 'lucide-react';
import { Language } from '../types';
import {
  calculateImmigrationEvaluation,
  MigrationAssessmentInput,
  AssessmentAnalysisResult,
} from '../utils/migrationAssessmentEngine';
import { saveLead } from '../data/siteConfig';

interface FreeAssessmentQuizProps {
  language: Language;
  onOpenConsultation?: (prefill?: { destination?: string; message?: string }) => void;
  onNavigateToContact?: () => void;
}

export const FreeAssessmentQuiz: React.FC<FreeAssessmentQuizProps> = ({
  language,
  onOpenConsultation,
  onNavigateToContact,
}) => {
  // Step navigation: 1 to 5 for questions, 6 for Lead Capture, 7 for Analysis Result
  const [step, setStep] = useState(1);
  const totalQuestionSteps = 5;

  // Form State
  const [formData, setFormData] = useState<MigrationAssessmentInput>({
    age: '26-35',
    currentCountry: 'ایران',
    education: 'کارشناسی ارشد (Master)',
    fieldOfStudy: 'مهندسی کامپیوتر و فناوری اطلاعات',
    experienceYears: '3-5',
    jobCategory: 'فناوری اطلاعات و نرم‌افزار',
    englishLevel: 'intermediate_b1_b2',
    destinationLanguageLevel: 'none',
    maritalStatus: 'single',
    hasSpouse: false,
    capitalRange: '15k_50k',
    primaryGoal: 'work',
    preferredCountries: ['Germany', 'Canada'],
  });

  // Lead capture state
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadContactPreference, setLeadContactPreference] = useState<'whatsapp' | 'call' | 'email'>('whatsapp');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Analysis result
  const [analysisResult, setAnalysisResult] = useState<AssessmentAnalysisResult | null>(null);

  const isFa = language === 'fa' || language === 'ar';

  const handleNext = () => {
    if (step < totalQuestionSteps) {
      setStep(step + 1);
    } else if (step === totalQuestionSteps) {
      // Run the modular engine
      const result = calculateImmigrationEvaluation(formData);
      setAnalysisResult(result);
      // Move to Lead Capture gate
      setStep(6);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLead(true);

    const generatedCode = `RASHA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Prepare lead data for CRM/backend
    saveLead({
      id: `lead-quiz-${Date.now()}`,
      fullName: leadName,
      phone: leadPhone,
      email: leadEmail,
      currentCountry: formData.currentCountry,
      age: formData.age,
      maritalStatus: formData.maritalStatus === 'single' ? 'مجرد' : 'متأهل',
      education: formData.education,
      jobTitle: `${formData.jobCategory} (${formData.fieldOfStudy})`,
      experienceYears: `${formData.experienceYears} سال`,
      languageLevel: formData.englishLevel,
      targetDestination: analysisResult?.primaryPathway?.countryFa || 'انتخاب بر اساس نتیجه',
      migrationGoal: formData.primaryGoal,
      budget: formData.capitalRange,
      message: `تست ارزیابی هوشمند تکمیل شد. امتیاز تخمینی: ${analysisResult?.totalScore || 75} از ۱۰۰. روش ترجیحی تماس: ${leadContactPreference}`,
      source: 'assessment_form',
      status: 'new',
      createdAt: new Date().toISOString(),
      trackingCode: generatedCode,
      estimatedScore: analysisResult?.totalScore,
    });

    setTimeout(() => {
      setIsSubmittingLead(false);
      setLeadSubmitted(true);
      // Reveal Full Result
      setStep(7);
    }, 600);
  };

  const handleDirectCTA = () => {
    if (onOpenConsultation) {
      onOpenConsultation({
        destination: analysisResult?.primaryPathway?.countryFa,
        message: `درخواست بررسی تخصصی نتایج تست ارزیابی رایگان (امتیاز ${analysisResult?.totalScore || 80} از ۱۰۰ - مسیر پیشنهادی: ${analysisResult?.primaryPathway?.titleFa}).`,
      });
    } else if (onNavigateToContact) {
      onNavigateToContact();
    }
  };

  return (
    <div id="free-assessment-tool" className="relative w-full rounded-3xl bg-gradient-to-b from-[#111314] via-[#0d0f10] to-[#080909] border border-white/[0.08] p-4 sm:p-8 md:p-10 shadow-2xl overflow-hidden">
      {/* Subtle Golden Glow Accent */}
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-[#C9A96A]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Badge & Title */}
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A96A]/10 border border-[#C9A96A]/30 text-[#DFBA73] text-xs font-mono font-medium shadow-[0_0_15px_rgba(201,169,106,0.15)]">
          <PlaneTakeoff className="w-3.5 h-3.5 text-[#C9A96A] animate-pulse" />
          <span>{isFa ? 'ارزیابی هوشمند و چندمرحله‌ای پرونده' : 'Multistep Eligibility Assessment'}</span>
        </div>

        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif-display text-[#F4F0E8] tracking-tight">
          {isFa ? '«مسیر مناسب مهاجرتت رو پیدا کن ✈️»' : 'Find Your Optimal Immigration Pathway ✈️'}
        </h3>

        <p className="text-sm text-[#A8A8A0] font-sans-luxury max-w-xl mx-auto leading-relaxed">
          {isFa
            ? 'در ۵ مرحله کوتاه مشخصات تحصیلی، مهارتی و بودجه خود را وارد کنید تا بهترین مقاصد و مسیرهای مناسب شما به صورت هوشمند تحلیل شوند.'
            : 'Answer 5 quick modules to generate an evidence-grounded strategic roadmap of viable destination countries and visa streams.'}
        </p>

        {/* Progress Bar (Visible during questions 1-5 and lead gate 6) */}
        {step <= totalQuestionSteps && (
          <div className="pt-5 max-w-md mx-auto space-y-2">
            <div className="flex items-center justify-between text-xs text-[#DFBA73] font-mono">
              <span className="font-semibold">
                {isFa ? `مرحله ${step} از ${totalQuestionSteps}` : `Step ${step} of ${totalQuestionSteps}`}
              </span>
              <span className="text-[#9B9B95]">
                {step === 1 && (isFa ? 'مشخصات فردی و اقامت' : 'Demographics')}
                {step === 2 && (isFa ? 'تحصیلات و رشته' : 'Education')}
                {step === 3 && (isFa ? 'سابقه کاری و عنوان شغلی' : 'Experience')}
                {step === 4 && (isFa ? 'سطح زبان انگلیسی و مقصد' : 'Languages')}
                {step === 5 && (isFa ? 'هدف اصلی و بودجه سرمایه' : 'Goal & Capital')}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden border border-white/[0.08]">
              <div
                className="h-full bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(201,169,106,0.6)]"
                style={{ width: `${(step / totalQuestionSteps) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Step Contents Container */}
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* STEP 1: Age, Current Country & Marital Status */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Age Select */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#DFBA73] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#C9A96A]" />
                  <span>{isFa ? 'بازه سنی شما' : 'Your Age Bracket'}</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: '18-25', labelFa: '۱۸ تا ۲۵ سال', labelEn: '18 – 25' },
                    { id: '26-35', labelFa: '۲۶ تا ۳۵ سال (طلایی)', labelEn: '26 – 35 (Prime)' },
                    { id: '36-45', labelFa: '۳۶ تا ۴۵ سال', labelEn: '36 – 45' },
                    { id: '46+', labelFa: '۴۶ سال به بالا', labelEn: '46+ years' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, age: item.id })}
                      className={`p-3 rounded-xl border text-xs font-medium transition-all text-right rtl:text-right ltr:text-left cursor-pointer ${
                        formData.age === item.id
                          ? 'border-[#DFBA73] bg-[#DFBA73]/15 text-[#F4F0E8] shadow-[0_0_15px_rgba(201,169,106,0.2)]'
                          : 'border-white/[0.08] bg-white/[0.02] text-[#A8A8A0] hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {isFa ? item.labelFa : item.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Country */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#DFBA73] flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-[#C9A96A]" />
                  <span>{isFa ? 'کشور محل اقامت فعلی' : 'Current Country of Residence'}</span>
                </label>
                <select
                  value={formData.currentCountry}
                  onChange={(e) => setFormData({ ...formData, currentCountry: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#181a1b] border border-white/10 text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none transition-all cursor-pointer"
                >
                  <option value="ایران">ایران (Iran)</option>
                  <option value="امارات (دبی)">امارات متحده عربی (دبی / ابوظبی)</option>
                  <option value="ترکیه">ترکیه (Turkey)</option>
                  <option value="عمان / قطر">کشورهای حوزه خلیج فارس (عمان / قطر)</option>
                  <option value="سایر کشورها">سایر کشورها</option>
                </select>
                <p className="text-[11px] text-[#808078] leading-tight">
                  {isFa ? 'محل اقامت در تعیین شرایط ویزا و محل انگشت‌نگاری مؤثر است.' : 'Determines jurisdiction for biometrics and consular filing.'}
                </p>
              </div>
            </div>

            {/* Marital Status */}
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <label className="block text-xs font-semibold text-[#DFBA73] flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#C9A96A]" />
                <span>{isFa ? 'وضعیت تأهل و همراهی همسر' : 'Marital Status & Family Accompaniment'}</span>
              </label>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'single',
                    labelFa: 'مجرد',
                    subFa: 'اقدام انفرادی',
                    labelEn: 'Single',
                    hasSpouse: false,
                  },
                  {
                    id: 'married_no_children',
                    labelFa: 'متأهل (بدون فرزند)',
                    subFa: 'همراه با همسر',
                    labelEn: 'Married (No kids)',
                    hasSpouse: true,
                  },
                  {
                    id: 'married_with_children',
                    labelFa: 'متأهل (دارای فرزند)',
                    subFa: 'خانواده کامل',
                    labelEn: 'Married with Children',
                    hasSpouse: true,
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        maritalStatus: item.id as any,
                        hasSpouse: item.hasSpouse,
                      })
                    }
                    className={`p-3.5 rounded-xl border text-xs text-right rtl:text-right ltr:text-left transition-all cursor-pointer ${
                      formData.maritalStatus === item.id
                        ? 'border-[#DFBA73] bg-[#DFBA73]/15 text-[#F4F0E8] shadow-[0_0_15px_rgba(201,169,106,0.2)]'
                        : 'border-white/[0.08] bg-white/[0.02] text-[#A8A8A0] hover:border-white/20'
                    }`}
                  >
                    <div className="font-semibold text-[#F4F0E8]">{isFa ? item.labelFa : item.labelEn}</div>
                    <div className="text-[11px] text-[#DFBA73]/80 mt-0.5">{item.subFa}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Education & Field of Study */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#DFBA73] flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#C9A96A]" />
                <span>{isFa ? 'آخرین مدرک تحصیلی معتبر' : 'Highest Completed Academic Credential'}</span>
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { id: 'phd', labelFa: 'دکتری تخصصی (PhD / Doctorate)', labelEn: 'Doctorate / PhD' },
                  { id: 'master', labelFa: 'کارشناسی ارشد (Master’s Degree)', labelEn: 'Master’s Degree' },
                  { id: 'bachelor', labelFa: 'کارشناسی (Bachelor’s Degree)', labelEn: 'Bachelor’s Degree' },
                  { id: 'associate', labelFa: 'کاردانی یا دیپلم فنی‌وحرفه‌ای', labelEn: 'Associate Degree / Technical Diploma' },
                  { id: 'highschool', labelFa: 'دیپلم متوسطه دبیرستان', labelEn: 'High School Diploma' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, education: item.labelFa })}
                    className={`p-3.5 rounded-xl border text-xs text-right rtl:text-right ltr:text-left transition-all cursor-pointer ${
                      formData.education.includes(item.labelFa) || formData.education === item.labelFa
                        ? 'border-[#DFBA73] bg-[#DFBA73]/15 text-[#F4F0E8] shadow-[0_0_15px_rgba(201,169,106,0.2)]'
                        : 'border-white/[0.08] bg-white/[0.02] text-[#A8A8A0] hover:border-white/20'
                    }`}
                  >
                    <span className="font-medium text-[#F4F0E8]">{isFa ? item.labelFa : item.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Field of Study */}
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <label className="block text-xs font-semibold text-[#DFBA73]">
                {isFa ? 'رشته تحصیلی یا تخصص دانشگاهی' : 'Major / Field of Study'}
              </label>
              <input
                type="text"
                value={formData.fieldOfStudy}
                onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                placeholder={isFa ? 'مثال: مهندسی کامپیوتر، مدیریت، معماری، هوش مصنوعی...' : 'e.g. Computer Science, Architecture, Business...'}
                className="w-full px-4 py-3 rounded-xl bg-[#181a1b] border border-white/10 text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none transition-all placeholder:text-[#686860]"
              />
              <p className="text-[11px] text-[#808078]">
                {isFa ? 'رشته‌های فنی‌مهندسی، علوم پایه، پزشکی و هوش مصنوعی در کشورهای آلمان و کانادا اولویت دارند.' : 'STEM, IT, and medical specialties receive priority allocations.'}
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Work Experience & Job Category */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Experience Years */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#DFBA73] flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[#C9A96A]" />
                <span>{isFa ? 'سابقه کار رسمی یا غیررسمی (به سال)' : 'Years of Specialized Work Experience'}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: '0', labelFa: 'کمتر از ۱ سال', labelEn: 'Under 1 yr' },
                  { id: '1-2', labelFa: '۱ تا ۲ سال', labelEn: '1 – 2 yrs' },
                  { id: '3-5', labelFa: '۳ تا ۵ سال (عالی)', labelEn: '3 – 5 yrs' },
                  { id: '6-8', labelFa: '۶ تا ۸ سال', labelEn: '6 – 8 yrs' },
                  { id: '9+', labelFa: 'بیش از ۸ سال', labelEn: '8+ yrs' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, experienceYears: item.id })}
                    className={`p-3 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                      String(formData.experienceYears) === item.id
                        ? 'border-[#DFBA73] bg-[#DFBA73]/15 text-[#F4F0E8] shadow-[0_0_15px_rgba(201,169,106,0.2)]'
                        : 'border-white/[0.08] bg-white/[0.02] text-[#A8A8A0] hover:border-white/20'
                    }`}
                  >
                    {isFa ? item.labelFa : item.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Title / Industry Category */}
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <label className="block text-xs font-semibold text-[#DFBA73]">
                {isFa ? 'حوزه یا عنوان شغلی اصلی شما' : 'Industry or Primary Job Category'}
              </label>
              <select
                value={formData.jobCategory}
                onChange={(e) => setFormData({ ...formData, jobCategory: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#181a1b] border border-white/10 text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none transition-all cursor-pointer"
              >
                <option value="فناوری اطلاعات و نرم‌افزار">مهندسی نرم‌افزار، IT، هوش مصنوعی و امنیت سایبری</option>
                <option value="مهندسی و صنایع">مهندسی مکانیک، برق، عمران و صنایع</option>
                <option value="مدیریت و مالی">مدیریت پروژه، مالی، حسابداری و مارکتینگ</option>
                <option value="پزشکی و سلامت">پزشکی، دندانپزشکی، داروسازی و پرستاری</option>
                <option value="معماری و هنر">معماری، گرافیک، طراحی دیجیتال و مدیا</option>
                <option value="کسب‌وکار آزاد و کارآفرینی">صاحب بیزینس، فروشگاه، تولیدی یا استارتاپ</option>
                <option value="سایر مشاغل">سایر زمینه‌های تخصصی</option>
              </select>
              <p className="text-[11px] text-[#808078]">
                {isFa ? 'برای ویزاهای مهارتی، بررسی طبقه‌بندی ناک (NOC کانادا) یا آژانس فدرال آلمان انجام می‌شود.' : 'Mapped against statutory occupational matrices (NOC/ANZSCO).'}
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: Language Proficiency */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* English Level */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#DFBA73] flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-[#C9A96A]" />
                <span>{isFa ? 'سطح زبان انگلیسی شما' : 'English Language Competence'}</span>
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'native_ielts8',
                    labelFa: 'مسلط و عالی (آیلتس ۸+ یا معادل)',
                    subFa: 'حداکثر امتیاز CLB 9/10',
                    labelEn: 'Superior (IELTS 8+ / CLB 9+)',
                  },
                  {
                    id: 'advanced_c1_c2_ielts7',
                    labelFa: 'پیشرفته (آیلتس ۶.۵ تا ۷.۵)',
                    subFa: 'بسیار مناسب برای اکسپرس اینتری و کار',
                    labelEn: 'Advanced (IELTS 6.5 – 7.5)',
                  },
                  {
                    id: 'intermediate_b1_b2',
                    labelFa: 'متوسط (مکالمه و درک عمومی - B1/B2)',
                    subFa: 'قابل ارتقا با برنامه‌ریزی ۳ ماهه',
                    labelEn: 'Intermediate (B1 / B2)',
                  },
                  {
                    id: 'none_basic',
                    labelFa: 'مبتدی یا نیاز به یادگیری از پایه',
                    subFa: 'نیاز به تمرکز اولیه روی دوره زبان',
                    labelEn: 'Beginner / Minimal',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, englishLevel: item.id })}
                    className={`p-3.5 rounded-xl border text-xs text-right rtl:text-right ltr:text-left transition-all cursor-pointer ${
                      formData.englishLevel === item.id
                        ? 'border-[#DFBA73] bg-[#DFBA73]/15 text-[#F4F0E8] shadow-[0_0_15px_rgba(201,169,106,0.2)]'
                        : 'border-white/[0.08] bg-white/[0.02] text-[#A8A8A0] hover:border-white/20'
                    }`}
                  >
                    <div className="font-semibold text-[#F4F0E8]">{isFa ? item.labelFa : item.labelEn}</div>
                    <div className="text-[11px] text-[#DFBA73]/80 mt-0.5">{item.subFa}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Destination Language (German/French) */}
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <label className="block text-xs font-semibold text-[#DFBA73]">
                {isFa ? 'آیا به زبان کشور مقصد نیز تسلط دارید؟ (مثلاً آلمانی یا فرانسوی)' : 'Target Host Language Competence (German / French)?'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'none', labelFa: 'آشنایی ندارم', labelEn: 'None' },
                  { id: 'a1_a2', labelFa: 'سطح پایه (A1 / A2)', labelEn: 'Basic (A1/A2)' },
                  { id: 'b1_b2', labelFa: 'سطح متوسط (B1 / B2)', labelEn: 'Solid (B1/B2)' },
                  { id: 'c1_c2', labelFa: 'پیشرفته (C1 / C2)', labelEn: 'Advanced (C1/C2)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, destinationLanguageLevel: item.id })}
                    className={`p-2.5 rounded-xl border text-xs text-center transition-all cursor-pointer ${
                      formData.destinationLanguageLevel === item.id
                        ? 'border-emerald-400 bg-emerald-950/30 text-emerald-300'
                        : 'border-white/[0.08] bg-white/[0.02] text-[#A8A8A0] hover:border-white/20'
                    }`}
                  >
                    {isFa ? item.labelFa : item.labelEn}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#808078]">
                {isFa ? 'داشتن مدرک زبان آلمانی A1 شانس کارت شانس را ۱۰۰٪ قطعی‌تر می‌کند.' : 'German A1 significantly strengthens Germany Opportunity Card eligibility.'}
              </p>
            </div>
          </div>
        )}

        {/* STEP 5: Main Goal & Budget / Capital */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Primary Goal */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#DFBA73] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#C9A96A]" />
                <span>{isFa ? 'هدف اصلی شما از مهاجرت' : 'Primary Immigration Strategic Objective'}</span>
              </label>
              <div className="grid sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'work', labelFa: 'کار و استخدام تخصصی', labelEn: 'Employment' },
                  { id: 'permanent_residency', labelFa: 'دریافت اقامت دائم مستقیم', labelEn: 'Direct PR' },
                  { id: 'job_search', labelFa: 'جستجوی فرصت شغلی (کارت شانس)', labelEn: 'Job Search Visa' },
                  { id: 'study', labelFa: 'تحصیل در دانشگاه‌های برتر', labelEn: 'Higher Education' },
                  { id: 'investment', labelFa: 'سرمایه‌گذاری و تمکن مالی', labelEn: 'Investment' },
                  { id: 'startup', labelFa: 'استارتاپ و کارآفرینی', labelEn: 'Startup Visa' },
                  { id: 'undecided', labelFa: 'هنوز مطمئن نیستم (راهنمایی کنید)', labelEn: 'Undecided' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, primaryGoal: item.id as any })}
                    className={`p-3 rounded-xl border text-xs font-medium text-right rtl:text-right ltr:text-left transition-all cursor-pointer ${
                      formData.primaryGoal === item.id
                        ? 'border-[#DFBA73] bg-[#DFBA73]/15 text-[#F4F0E8] shadow-[0_0_15px_rgba(201,169,106,0.2)]'
                        : 'border-white/[0.08] bg-white/[0.02] text-[#A8A8A0] hover:border-white/20'
                    }`}
                  >
                    {isFa ? item.labelFa : item.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Capital / Budget Range */}
            <div className="space-y-3 pt-2 border-t border-white/[0.06]">
              <label className="block text-xs font-semibold text-[#DFBA73] flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-[#C9A96A]" />
                <span>{isFa ? 'میزان سرمایه یا بودجه تقریبی در دسترس برای مهاجرت' : 'Approximate Capital / Settlement Liquidity'}</span>
              </label>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'under_15k', labelFa: 'زیر ۱۵ هزار دلار', subFa: 'مناسب روش‌های کار با کارفرما یا بورسیه', labelEn: 'Under $15k USD' },
                  { id: '15k_50k', labelFa: '۱۵ تا ۵۰ هزار دلار', subFa: 'پوشش تمکن کارت شانس، اکسپرس اینتری و سال اول تحصیل', labelEn: '$15k – $50k USD' },
                  { id: '50k_100k', labelFa: '۵۰ تا ۱۰۰ هزار دلار', subFa: 'بسیار راحت برای اقامت خانوادگی و خودحمایتی', labelEn: '$50k – $100k USD' },
                  { id: '100k_250k', labelFa: '۱۰۰ تا ۲۵۰ هزار دلار', subFa: 'مناسب ثبت شرکت اروپا و تمکن مالی مستقل', labelEn: '$100k – $250k USD' },
                  { id: 'above_250k', labelFa: 'بالای ۲۵۰ هزار دلار', subFa: 'ویزای طلایی دبی، خرید ملک اروپا و استارتاپ', labelEn: 'Over $250k USD' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, capitalRange: item.id })}
                    className={`p-3 rounded-xl border text-xs text-right rtl:text-right ltr:text-left transition-all cursor-pointer ${
                      formData.capitalRange === item.id
                        ? 'border-[#DFBA73] bg-[#DFBA73]/15 text-[#F4F0E8] shadow-[0_0_15px_rgba(201,169,106,0.2)]'
                        : 'border-white/[0.08] bg-white/[0.02] text-[#A8A8A0] hover:border-white/20'
                    }`}
                  >
                    <div className="font-semibold text-[#F4F0E8]">{isFa ? item.labelFa : item.labelEn}</div>
                    <div className="text-[11px] text-[#DFBA73]/80 mt-0.5">{item.subFa}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Lead Generation Gate (Before revealing full results) */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-lg mx-auto">
            <div className="p-5 rounded-2xl bg-[#161819] border border-[#DFBA73]/30 text-center space-y-2 shadow-xl">
              <div className="w-12 h-12 rounded-full bg-[#DFBA73]/15 border border-[#DFBA73]/40 text-[#DFBA73] flex items-center justify-center mx-auto mb-1">
                <FileCheck className="w-6 h-6 animate-bounce" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-[#F4F0E8]">
                {isFa ? '«نتیجه ارزیابی شما آماده است»' : 'Your Assessment Analysis is Prepared'}
              </h4>
              <p className="text-xs text-[#C5C5BC] leading-relaxed">
                {isFa
                  ? 'برای دریافت نتیجه کامل، مشاهده نمودار امتیازات و بررسی تخصصی‌تر، اطلاعات تماس خود را وارد کنید:'
                  : 'To unlock your complete breakdown, country roadmap, and priority advisory dossier, please enter your contact coordinates:'}
              </p>
            </div>

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#DFBA73] mb-1.5">
                  {isFa ? 'نام و نام خانوادگی' : 'Full Legal Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder={isFa ? 'مثال: محمد امینی' : 'e.g. David Miller'}
                  className="w-full px-4 py-3 rounded-xl bg-[#181a1b] border border-white/10 text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none transition-all placeholder:text-[#686860]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#DFBA73] mb-1.5">
                  {isFa ? 'شماره موبایل (دارای واتس‌اپ)' : 'Mobile Number (WhatsApp)'} *
                </label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="+98 912 345 6789"
                  className="w-full px-4 py-3 rounded-xl bg-[#181a1b] border border-white/10 text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none transition-all placeholder:text-[#686860] text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#DFBA73] mb-1.5">
                  {isFa ? 'آدرس ایمیل' : 'Email Address'} *
                </label>
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#181a1b] border border-white/10 text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none transition-all placeholder:text-[#686860] text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#DFBA73] mb-1.5">
                  {isFa ? 'روش ترجیحی تماس و ارسال گزارش' : 'Preferred Contact Channel'}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'whatsapp', labelFa: 'واتس‌اپ', labelEn: 'WhatsApp' },
                    { id: 'call', labelFa: 'تماس تلفنی', labelEn: 'Direct Call' },
                    { id: 'email', labelFa: 'ایمیل رسمی', labelEn: 'Email Dossier' },
                  ].map((chan) => (
                    <button
                      key={chan.id}
                      type="button"
                      onClick={() => setLeadContactPreference(chan.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                        leadContactPreference === chan.id
                          ? 'border-[#DFBA73] bg-[#DFBA73]/20 text-[#F4F0E8]'
                          : 'border-white/10 bg-white/[0.02] text-[#A8A8A0]'
                      }`}
                    >
                      {isFa ? chan.labelFa : chan.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingLead}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#DFBA73] via-[#C9A96A] to-[#B38F4E] hover:from-[#E8CA8C] hover:to-[#DFBA73] text-[#080909] font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C9A96A]/20 transition-all cursor-pointer"
              >
                {isSubmittingLead ? (
                  <span>{isFa ? 'در حال تحلیل نهایی...' : 'Processing dossier...'}</span>
                ) : (
                  <>
                    <span>{isFa ? 'مشاهده فوری گزارش و تحلیل مسیرها' : 'Unlock Comprehensive Analysis'}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#787870] font-mono">
                <Lock className="w-3 h-3 text-[#DFBA73]" />
                <span>{isFa ? 'اطلاعات شما با پروتکل‌های محرمانگی وکالت بین‌الملل نگهداری می‌شود.' : 'Secured via standard GDPR statutory confidentiality.'}</span>
              </div>
            </form>
          </div>
        )}

        {/* STEP 7: Comprehensive Results & Pathway Analysis Display */}
        {step === 7 && analysisResult && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-400">
            {/* 1. Score Highlight Banner with Circular Representation */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#181a1b] via-[#121415] to-[#0a0c0c] border border-[#DFBA73]/40 shadow-2xl relative overflow-hidden">
              <div className="grid md:grid-cols-12 gap-6 items-center">
                {/* Score Number & Circular Meter */}
                <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-white/10"
                        strokeWidth="3.2"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        style={{
                          strokeDasharray: `${analysisResult.totalScore}, 100`,
                          stroke: analysisResult.tier.color,
                        }}
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-black font-mono text-[#F4F0E8]">
                        {analysisResult.totalScore}
                      </span>
                      <span className="text-[10px] text-[#A8A8A0] font-mono">از ۱۰۰</span>
                    </div>
                  </div>

                  <div
                    className="mt-3 px-3 py-1 rounded-full text-xs font-bold font-mono"
                    style={{
                      backgroundColor: `${analysisResult.tier.color}20`,
                      color: analysisResult.tier.color,
                      border: `1px solid ${analysisResult.tier.color}50`,
                    }}
                  >
                    {isFa ? analysisResult.tier.titleFa : analysisResult.tier.titleEn}
                  </div>
                </div>

                {/* Score Meaning & Guidance */}
                <div className="md:col-span-8 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-[#DFBA73] font-mono">
                    <Award className="w-3.5 h-3.5 text-[#DFBA73]" />
                    <span>{isFa ? 'ارزیابی اولیه و تحلیل راهبردی پرونده' : 'Initial Algorithmic Appraisal'}</span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-bold text-[#F4F0E8]">
                    {isFa
                      ? `امتیاز کلی شما: ${analysisResult.totalScore} از ۱۰۰ (${analysisResult.tier.titleFa})`
                      : `Your Evaluated Score: ${analysisResult.totalScore} / 100 (${analysisResult.tier.titleEn})`}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#D1D1C7] leading-relaxed">
                    {isFa ? analysisResult.tier.descriptionFa : analysisResult.tier.descriptionEn}
                  </p>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed">
                    <AlertCircle className="w-4 h-4 text-amber-400 inline ml-1.5 shrink-0" />
                    <span>
                      {isFa
                        ? 'این برآورد اولیه بر پایه داده‌های خوداظهاری شماست و به منزله تضمین صدور ویزا نیست؛ انتخاب مسیر نیازمند ارزیابی موشکافانه اسناد هویتی و شغلی است.'
                        : 'Preliminary appraisal. Does not warrant official visa approval; statutory filing requires verified documentation.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5-Factor Score Breakdown */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-xs font-bold text-[#DFBA73] mb-3">
                  {isFa ? 'تفکیک امتیازات ۵ گانه شما:' : '5-Factor Pillar Breakdown:'}
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {analysisResult.breakdown.map((item) => (
                    <div
                      key={item.category}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-[#F4F0E8]">{isFa ? item.titleFa : item.titleEn}</span>
                          <span className="font-mono text-[#DFBA73]">
                            {item.score}/{item.maxScore}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-[#DFBA73] rounded-full"
                            style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-[#9B9B95] mt-2.5 leading-snug">
                        {isFa ? item.noteFa : item.noteEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Primary Recommended Pathway */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#DFBA73]">
                <TrendingUp className="w-4 h-4 text-[#C9A96A]" />
                <span>{isFa ? 'بهترین مسیر پیشنهادی بر اساس پروفایل شما' : 'Top Recommended Strategic Pathway'}</span>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#191d1e] to-[#101314] border border-[#DFBA73]/50 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{analysisResult.primaryPathway.flag}</span>
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#DFBA73]/15 text-[#DFBA73] text-[10px] font-mono font-bold">
                        {isFa ? analysisResult.primaryPathway.categoryFa : analysisResult.primaryPathway.categoryEn}
                      </span>
                      <h5 className="text-lg sm:text-xl font-bold text-[#F4F0E8] mt-1">
                        {isFa ? analysisResult.primaryPathway.titleFa : analysisResult.primaryPathway.titleEn}
                      </h5>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-[#C9A96A]">
                    <Clock className="w-4 h-4" />
                    <span>{isFa ? `زمان تقریبی: ${analysisResult.primaryPathway.estimatedTimelineFa}` : `Timeline: ${analysisResult.primaryPathway.estimatedTimelineEn}`}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#D1D1C7] leading-relaxed">
                  {isFa ? analysisResult.primaryPathway.descriptionFa : analysisResult.primaryPathway.descriptionEn}
                </p>

                <div className="pt-3 border-t border-white/[0.06] space-y-2">
                  <span className="text-xs font-semibold text-[#DFBA73]">
                    {isFa ? 'الزامات کلیدی این مسیر:' : 'Key Statutory Prerequisites:'}
                  </span>
                  <div className="grid sm:grid-cols-3 gap-2 text-xs text-[#A8A8A0]">
                    {(isFa
                      ? analysisResult.primaryPathway.requirementsSummaryFa
                      : analysisResult.primaryPathway.requirementsSummaryEn
                    ).map((req, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 2 to 3 Alternative Pathways */}
            <div className="space-y-3">
              <div className="text-sm font-bold text-[#DFBA73]">
                {isFa ? 'گزینه‌های جایگزین مناسب (Plan B / C):' : 'Viable Alternative Pathways:'}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {analysisResult.alternativePathways.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{alt.flag}</span>
                        <h6 className="font-bold text-xs sm:text-sm text-[#F4F0E8]">
                          {isFa ? alt.titleFa : alt.titleEn}
                        </h6>
                      </div>
                      <span className="text-[10px] font-mono text-[#DFBA73]">
                        {isFa ? alt.estimatedTimelineFa : alt.estimatedTimelineEn}
                      </span>
                    </div>

                    <p className="text-xs text-[#9B9B95] leading-relaxed">
                      {isFa ? alt.descriptionFa : alt.descriptionEn}
                    </p>

                    <div className="text-[11px] text-[#C9A96A] space-y-1 pt-2 border-t border-white/[0.04]">
                      {(isFa ? alt.requirementsSummaryFa : alt.requirementsSummaryEn).slice(0, 2).map((r, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-[#C9A96A]" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Strengths & Weaknesses Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isFa ? 'نقاط قوت رزومه شما' : 'Identified Profile Strengths'}</span>
                </div>
                <ul className="space-y-2 text-xs text-emerald-200/90">
                  {(isFa ? analysisResult.strengthsFa : analysisResult.strengthsEn).map((st, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses / Needs Attention */}
              <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>{isFa ? 'نقاط نیازمند تقویت یا پیگیری' : 'Aspects Requiring Optimization'}</span>
                </div>
                <ul className="space-y-2 text-xs text-amber-200/90">
                  {(isFa ? analysisResult.weaknessesFa : analysisResult.weaknessesEn).map((wk, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{wk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 5. Recommended Next Steps */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
              <div className="text-xs font-bold text-[#DFBA73] flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                <span>{isFa ? 'پیشنهاد قدم‌های بعدی جهت اقدام رسمی:' : 'Recommended Action Milestones:'}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5 text-xs text-[#D1D1C7]">
                {(isFa ? analysisResult.nextStepsFa : analysisResult.nextStepsEn).map((stepTxt, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                    <span className="font-mono text-[#DFBA73] font-bold text-xs">{idx + 1}.</span>
                    <span>{stepTxt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Professional High-Impact CTA */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#DFBA73]/20 via-[#C9A96A]/15 to-transparent border border-[#DFBA73]/50 text-center space-y-4">
              <h4 className="text-xl sm:text-2xl font-bold text-[#F4F0E8]">
                {isFa ? 'بررسی دقیق‌تر و شروع تنظیم پرونده با وکلای رسمی' : 'Schedule Dedicated Advisory Consultation'}
              </h4>
              <p className="text-xs sm:text-sm text-[#D1D1C7] max-w-xl mx-auto leading-relaxed">
                {isFa
                  ? 'اطلاعات اولیه شما ثبت گردید. جهت تبدیل این برآورد به یک پرونده آماده سابمیت، همین حالا وقت مشاوره خود را رزرو کنید.'
                  : 'Convert this appraisal into an actionable, statutory visa submission backed by certified legal counsel.'}
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDirectCTA}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] hover:from-[#E8CA8C] hover:to-[#DFBA73] text-[#080909] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-[#C9A96A]/30 transition-all duration-300 hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{isFa ? 'دریافت مشاوره تخصصی / بررسی شرایط من' : 'Book Specialized Advisory'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-5 py-3.5 sm:py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#D1D1C7] border border-white/10 text-xs font-semibold transition-all cursor-pointer text-center"
                >
                  {isFa ? 'شروع مجدد تست با اطلاعات دیگر' : 'Retake Assessment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation Buttons (for questions 1-5) */}
        {step <= totalQuestionSteps && (
          <div className="mt-8 pt-5 border-t border-white/[0.08] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className={`w-full sm:w-auto px-5 py-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
                step === 1
                  ? 'opacity-30 border-white/5 text-[#686860] cursor-not-allowed'
                  : 'border-white/15 bg-white/[0.04] text-[#D1D1C7] hover:border-white/30 hover:text-white'
              }`}
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{isFa ? 'مرحله قبلی' : 'Previous'}</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#DFBA73] via-[#C9A96A] to-[#B38F4E] hover:from-[#E8CA8C] hover:to-[#DFBA73] text-[#080909] text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#C9A96A]/20 transition-all hover:scale-102 cursor-pointer min-h-[44px]"
            >
              <span>
                {step === totalQuestionSteps
                  ? isFa
                    ? 'تحلیل نهایی و مشاهده نتایج'
                    : 'Analyze & View Results'
                  : isFa
                  ? 'مرحله بعدی'
                  : 'Next'}
              </span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
