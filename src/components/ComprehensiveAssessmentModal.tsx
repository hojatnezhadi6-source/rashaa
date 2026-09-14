import React, { useState } from 'react';
import { Sparkles, X, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft, MessageCircle, FileText, Send, User, GraduationCap, Briefcase, Globe, DollarSign } from 'lucide-react';
import { Language } from '../types';
import { saveLead } from '../data/siteConfig';

interface ComprehensiveAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialDestination?: string;
}

export const ComprehensiveAssessmentModal: React.FC<ComprehensiveAssessmentModalProps> = ({
  isOpen,
  onClose,
  language,
  initialDestination,
}) => {
  const [step, setStep] = useState(1);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [currentCountry, setCurrentCountry] = useState('ایران');
  const [age, setAge] = useState('26 – 35');
  const [maritalStatus, setMaritalStatus] = useState('متاهل (همراه با خانواده)');

  const [education, setEducation] = useState("کارشناسی ارشد (Master's)");
  const [jobTitle, setJobTitle] = useState('');
  const [experienceYears, setExperienceYears] = useState('3 تا 5 سال سابقه کاری');
  const [languageLevel, setLanguageLevel] = useState('آیلتس ۶.۵ تا ۷.۵ یا معادل آن');

  const [targetDestination, setTargetDestination] = useState(initialDestination || 'Canada');
  const [migrationGoal, setMigrationGoal] = useState('مهاجرت کاری و اسکیلد ورکر');
  const [budget, setBudget] = useState('$25k – $100k USD');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [calculatedScore, setCalculatedScore] = useState(88);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Calculate a realistic eligibility percentage score based on inputs
    let score = 75;
    if (education.includes('ارشد') || education.includes('Master') || education.includes('دکتری')) score += 10;
    if (languageLevel.includes('۷') || languageLevel.includes('8') || languageLevel.includes('پیشرفته')) score += 8;
    if (experienceYears.includes('3') || experienceYears.includes('5')) score += 5;
    score = Math.min(97, score);
    setCalculatedScore(score);

    const generatedCode = `RASHA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTrackingCode(generatedCode);

    saveLead({
      id: `lead-assess-${Date.now()}`,
      fullName,
      phone,
      email,
      currentCountry,
      age,
      maritalStatus,
      education,
      jobTitle,
      experienceYears,
      languageLevel,
      targetDestination,
      migrationGoal,
      budget,
      message,
      source: 'assessment_form',
      status: 'new',
      createdAt: new Date().toISOString(),
      trackingCode: generatedCode,
      estimatedScore: score,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setSubmitted(false);
    setStep(1);
    onClose();
  };

  const whatsappMessage = encodeURIComponent(
    `درود، فرم ارزیابی مهاجرت را در وبسایت راشا مهاجرت تکمیل کردم:\n` +
      `کد رهگیری: ${trackingCode}\n` +
      `نام: ${fullName}\n` +
      `شماره: ${phone}\n` +
      `تحصیلات: ${education}\n` +
      `شغل: ${jobTitle} (${experienceYears})\n` +
      `مقصد: ${targetDestination}\n` +
      `هدف: ${migrationGoal}\n` +
      `سطح زبان: ${languageLevel}\n` +
      `امتیاز تخمینی: ${calculatedScore}%\n` +
      `لطفاً پرونده بنده را جهت مشاوره تخصصی بررسی فرمایید.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#080909]/90 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-[#111313] border border-[#C9A96A]/30 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#DFBA73] via-[#C9A96A] to-[#B38F4E]" />

        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C9A96A]/20 to-transparent border border-[#C9A96A]/40 flex items-center justify-center text-[#C9A96A]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C9A96A]">
                  {language === 'fa' ? 'ارزیابی تخصصی و ارسال پرونده به وکلای راشا' : 'Comprehensive Dossier & Assessment'}
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] bg-[#C9A96A]/10 text-[#C9A96A] border border-[#C9A96A]/20 font-mono">
                  رایگان و محرمانه
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif-display font-light text-[#F4F0E8]">
                {language === 'fa' ? 'فرم ارزیابی جامع شرایط مهاجرت' : 'Global Mobility Assessment Form'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-[#9B9B95] hover:text-[#F4F0E8] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {submitted ? (
            <div className="py-6 text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl sm:text-3xl font-serif-display text-[#F4F0E8]">
                  {language === 'fa' ? 'پرونده شما با موفقیت ثبت و به مشاوران ارسال شد' : 'Assessment Submitted Successfully'}
                </h4>
                <p className="text-sm text-[#9B9B95] max-w-lg mx-auto leading-relaxed font-sans-luxury">
                  {language === 'fa'
                    ? `جناب آقای/سرکار خانم ${fullName}، اطلاعات شما در سامانه وکلای راشا ثبت گردید. کارشناس ارشد پرونده پس از بررسی اولیه سوابق با شما تماس خواهد گرفت.`
                    : `Thank you ${fullName}. Your profile has been transferred to our senior immigration desk.`}
                </p>
              </div>

              {/* Assessment Score Card */}
              <div className="max-w-md mx-auto p-5 rounded-2xl bg-[#080909] border border-[#C9A96A]/30 flex items-center justify-between">
                <div className="text-left rtl:text-right">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#9B9B95] block">
                    {language === 'fa' ? 'شانس اولیه موفقیت در کشور هدف:' : 'Estimated Preliminary Eligibility:'}
                  </span>
                  <span className="text-sm font-semibold text-[#F4F0E8]">
                    {targetDestination} — {migrationGoal}
                  </span>
                  <span className="text-xs text-[#C9A96A] block mt-1 font-mono">
                    کد رهگیری: {trackingCode}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-[#C9A96A]/10 border border-[#C9A96A] text-[#DFBA73] font-mono font-bold text-xl">
                  {calculatedScore}%
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <a
                  href={`https://wa.me/971501234567?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/40"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{language === 'fa' ? 'ارسال فوری خلاصه پرونده به مشاور در واتس‌اپ' : 'Send Dossier via WhatsApp'}</span>
                </a>

                <button
                  onClick={handleReset}
                  className="px-6 py-3.5 bg-white/[0.08] hover:bg-white/[0.12] text-[#F4F0E8] rounded-xl text-xs font-medium cursor-pointer"
                >
                  {language === 'fa' ? 'بستن پنجره' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step indicator */}
              <div className="flex items-center justify-between text-xs text-[#9B9B95] border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded font-mono ${step === 1 ? 'bg-[#C9A96A] text-[#080909] font-bold' : 'bg-white/5 text-[#9B9B95]'}`}>
                    ۱. مشخصات فردی
                  </span>
                  <span className={`px-2.5 py-1 rounded font-mono ${step === 2 ? 'bg-[#C9A96A] text-[#080909] font-bold' : 'bg-white/5 text-[#9B9B95]'}`}>
                    ۲. سوابق و زبان
                  </span>
                  <span className={`px-2.5 py-1 rounded font-mono ${step === 3 ? 'bg-[#C9A96A] text-[#080909] font-bold' : 'bg-white/5 text-[#9B9B95]'}`}>
                    ۳. مقصد و سرمایه
                  </span>
                </div>
                <span className="font-mono text-[#C9A96A]">مرحله {step} از ۳</span>
              </div>

              {/* STEP 1: Personal Profile */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-[#C9A96A] mb-1.5 font-medium">
                        نام و نام خانوادگی کامل *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="مثال: دکتر مهیار رضایی"
                        className="w-full px-4 py-3 bg-[#080909] border border-white/10 rounded-xl text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-[#C9A96A] mb-1.5 font-medium">
                        شماره تماس و واتس‌اپ *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="۰۹۱۲... یا پیش‌شماره کشور"
                        className="w-full px-4 py-3 bg-[#080909] border border-white/10 rounded-xl text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-[#9B9B95] mb-1.5 font-medium">
                        آدرس ایمیل
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-4 py-3 bg-[#080909] border border-white/10 rounded-xl text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-[#9B9B95] mb-1.5 font-medium">
                        کشور یا شهر محل سکونت فعلی
                      </label>
                      <input
                        type="text"
                        value={currentCountry}
                        onChange={(e) => setCurrentCountry(e.target.value)}
                        placeholder="ایران (تهران)، دبی، استانبول و..."
                        className="w-full px-4 py-3 bg-[#080909] border border-white/10 rounded-xl text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-[#9B9B95] mb-1.5 font-medium">
                        رده سنی شما
                      </label>
                      <select
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-4 py-3 bg-[#080909] border border-white/10 rounded-xl text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                      >
                        <option value="18 – 25">۱۸ تا ۲۵ سال</option>
                        <option value="26 – 35">۲۶ تا ۳۵ سال (حداکثر امتیاز سن)</option>
                        <option value="36 – 45">۳۶ تا ۴۵ سال</option>
                        <option value="46 – 55">۴۶ تا ۵۵ سال</option>
                        <option value="55+">بیش از ۵۵ سال</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-[#9B9B95] mb-1.5 font-medium">
                        وضعیت تأهل و همراهان
                      </label>
                      <select
                        value={maritalStatus}
                        onChange={(e) => setMaritalStatus(e.target.value)}
                        className="w-full px-4 py-3 bg-[#080909] border border-white/10 rounded-xl text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                      >
                        <option value="مجرد (اقدام انفرادی)">مجرد (اقدام انفرادی)</option>
                        <option value="متاهل (همراه با همسر)">متاهل (همراه با همسر)</option>
                        <option value="متاهل (همسر و ۱ فرزند)">متاهل (همسر و ۱ فرزند)</option>
                        <option value="متاهل (همسر و ۲ یا چند فرزند)">متاهل (همسر و ۲ یا چند فرزند)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={!fullName || !phone}
                      onClick={() => setStep(2)}
                      className="px-7 py-3 bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] hover:from-[#E8CA8C] hover:to-[#DFBA73] text-[#080909] font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-40"
                    >
                      <span>مرحله بعد: تحصیلات و شغل</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Education, Work & Language */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-[#C9A96A] mb-1.5 font-medium">
                        آخرین مدرک تحصیلی
                      </label>
                      <select
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        className="w-full px-4 py-3 bg-[#080909] border border-white/10 rounded-xl text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                      >
                        <option value="Doctorate / PhD">دکتری تخصصی / PhD / فوق تخصص</option>
                        <option value="کارشناسی ارشد (Master's)">کارشناسی ارشد (فوق لیسانس)</option>
                        <option value="کارشناسی (Bachelor's)">کارشناسی (لیسانس)</option>
                        <option value="کاردانی / دیپلم فنی حرفه‌ای">کاردانی / دیپلم فنی حرفه‌ای</option>
                        <option value="دیپلم دبیرستان">دیپلم دبیرستان</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-[#C9A96A] mb-1.5 font-medium">
                        عنوان شغلی و زمینه تخصصی *
                      </label>
                      <input
                        type="text"
                        required
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="مثال: مهندس نرم‌افزار، پزشک، مدیر بازرگانی، معمار..."
                        className="w-full px-4 py-3 bg-[#080909] border border-white/10 rounded-xl text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-[#9B9B95] mb-1.5 font-medium">
                        سابقه کار مرتبط (با بیمه یا مستندات)
                      </label>
                      <select
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        className="w-full px-4 py-3 bg-[#080909] border border-white/10 rounded-xl text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                      >
                        <option value="کمتر از ۱ سال">کمتر از ۱ سال</option>
                        <option value="۱ تا ۳ سال">۱ تا ۳ سال</option>
                        <option value="3 تا 5 سال سابقه کاری">۳ تا ۵ سال سابقه کاری</option>
                        <option value="۵ تا ۱۰ سال سابقه تخصصی">۵ تا ۱۰ سال سابقه تخصصی</option>
                        <option value="بیش از ۱۰ سال سابقه مدیریت">بیش از ۱۰ سال سابقه مدیریت/تخصص</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-[#9B9B95] mb-1.5 font-medium">
                        سطح زبان خارجی (انگلیسی/آلمانی/فرانسوی)
                      </label>
                      <select
                        value={languageLevel}
                        onChange={(e) => setLanguageLevel(e.target.value)}
                        className="w-full px-4 py-3 bg-[#080909] border border-white/10 rounded-xl text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                      >
                        <option value="آیلتس ۷.۵ به بالا یا CLB 9+">آیلتس ۷.۵ به بالا یا CLB 9+ (ممتاز)</option>
                        <option value="آیلتس ۶.۵ تا ۷.۵ یا معادل آن">آیلتس ۶.۵ تا ۷.۵ یا معادل آن (خوب)</option>
                        <option value="آیلتس ۵.۵ تا ۶ یا زبان متوسط">آیلتس ۵.۵ تا ۶ یا زبان متوسط</option>
                        <option value="مدرک آلمانی B1 یا B2">مدرک آلمانی B1 یا B2</option>
                        <option value="در حال یادگیری / بدون مدرک فعلی">در حال یادگیری / بدون مدرک فعلی</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 text-xs text-[#9B9B95] hover:text-[#F4F0E8] flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                      <span>بازگشت به مرحله ۱</span>
                    </button>

                    <button
                      type="button"
                      disabled={!jobTitle}
                      onClick={() => setStep(3)}
                      className="px-7 py-3 bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] hover:from-[#E8CA8C] hover:to-[#DFBA73] text-[#080909] font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-40"
                    >
                      <span>مرحله بعد: انتخاب مقصد و ارسال</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Target Country & Capital */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-[#C9A96A] mb-1.5 font-medium">
                        کشور یا مقصد مورد علاقه شما
                      </label>
                      <select
                        value={targetDestination}
                        onChange={(e) => setTargetDestination(e.target.value)}
                        className="w-full px-4 py-3 bg-[#080909] border border-white/10 rounded-xl text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                      >
                        <option value="Canada">کانادا (اکسپرس اینتری / PNP / استارتاپ)</option>
                        <option value="United Kingdom">انگلستان (اسکیلد ورکر / گلوبال تلنت / تحصیلی)</option>
                        <option value="Germany">آلمان (کارت شانس / بلوکارت / آسبیلدونگ)</option>
                        <option value="Australia">استرالیا (ساب‌کلاس ۱۸۹، ۱۹۰، ۴۹۱)</option>
                        <option value="United States">ایالات متحده آمریکا (EB-1, EB-2 NIW, E-2)</option>
                        <option value="Portugal & Spain">پرتغال و اسپانیا (گلدن ویزا / تمکن مالی D8, D7)</option>
                        <option value="UAE (Dubai)">امارات / دبی (گلدن ویزا ۱۰ ساله / ثبت شرکت)</option>
                        <option value="Italy & France">ایتالیا و فرانسه (تحصیلی و تجاری)</option>
                        <option value="پیشنهاد وکلای راشا متناسب با شرایط من">پیشنهاد وکلای راشا متناسب با شرایط من</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-[#C9A96A] mb-1.5 font-medium">
                        روش مهاجرتی مد نظر
                      </label>
                      <select
                        value={migrationGoal}
                        onChange={(e) => setMigrationGoal(e.target.value)}
                        className="w-full px-4 py-3 bg-[#080909] border border-white/10 rounded-xl text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                      >
                        <option value="مهاجرت کاری و اسکیلد ورکر">مهاجرت کاری و نیروی ماهر (Skilled Worker)</option>
                        <option value="تحصیلی و تبدیل به اقامت دائم">تحصیلی و تبدیل به اقامت دائم (Study & PR)</option>
                        <option value="سرمایه‌گذاری، ثبت شرکت و استارتاپ">سرمایه‌گذاری، ثبت شرکت و استارتاپ</option>
                        <option value="اقامت تمکن مالی و دیجیتال نومد">اقامت تمکن مالی و درآمد غیرفعال (Passive Income)</option>
                        <option value="اخذ پاسپورت دوم و شهروندی">اخذ پاسپورت دوم و تابعیت (Citizenship)</option>
                        <option value="اسپانسرشیپ و الحاق خانواده">اسپانسرشیپ و الحاق خانواده</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-[#9B9B95] mb-1.5 font-medium">
                      میزان سرمایه یا بودجه در دسترس تقریبی (جهت اثبات تمکن یا هزینه پروسه)
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-4 py-3 bg-[#080909] border border-white/10 rounded-xl text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                    >
                      <option value="Under $25k USD">کمتر از ۲۵ هزار دلار (مناسب کاری و اکسپرس اینتری)</option>
                      <option value="$25k – $100k USD">$۲۵ تا ۱۰۰ هزار دلار (مناسب تحصیلی و جاب آفر)</option>
                      <option value="$100k – $500k USD">$۱۰۰ تا ۵۰۰ هزار دلار (مناسب استارتاپ و تمکن مالی)</option>
                      <option value="$500k+ USD">$۵۰۰ هزار دلار به بالا (سرمایه‌گذاری ممتاز و گلدن ویزا)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-[#9B9B95] mb-1.5 font-medium">
                      توضیحات تکمیلی، شرایط خاص یا سوال ویژه (اختیاری)
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="اگر مدرک زبان خاصی دارید، ریجکتی قبلی داشته‌اید یا تمایل به مشاوره حضوری در دفتر تهران/دبی دارید بنویسید..."
                      className="w-full px-4 py-3 bg-[#080909] border border-white/10 rounded-xl text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 text-xs text-[#9B9B95] hover:text-[#F4F0E8] flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                      <span>بازگشت به مرحله ۲</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3.5 bg-gradient-to-r from-[#DFBA73] via-[#C9A96A] to-[#B38F4E] hover:from-[#E8CA8C] hover:to-[#DFBA73] text-[#080909] font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-xl shadow-[#C9A96A]/25 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'در حال تحلیل و ارسال...' : 'ارسال نهایی پرونده به وکلای راشا'}</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
