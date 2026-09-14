import React, { useState } from 'react';
import { PhoneCall, MessageCircle, Clock, ShieldCheck, X, CheckCircle2, MapPin, Sparkles, Send } from 'lucide-react';
import { Language } from '../types';
import { saveLead } from '../data/siteConfig';

interface QuickCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const QuickCallModal: React.FC<QuickCallModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('Skilled & Tech Migration');
  const [timePreference, setTimePreference] = useState('As soon as possible (< 15 mins)');
  const [submitted, setSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    const code = `CALL-${Math.floor(1000 + Math.random() * 9000)}`;
    setTrackingCode(code);

    saveLead({
      id: `lead-call-${Date.now()}`,
      fullName,
      phone,
      email: '',
      currentCountry: 'ایران / منطقه',
      targetDestination: 'General Priority Consultation',
      migrationGoal: topic,
      message: `درخواست تماس فوری: ${topic} | زمان ترجیحی: ${timePreference}`,
      source: 'quick_call',
      status: 'new',
      createdAt: new Date().toISOString(),
      trackingCode: code,
    });

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFullName('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#080909]/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#111313] border border-[#C9A96A]/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C9A96A] to-transparent" />

        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A96A]/10 border border-[#C9A96A]/40 flex items-center justify-center text-[#C9A96A]">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C9A96A]">
                  {language === 'fa' ? 'پاسخگویی فوری و ۲۴ ساعته' : 'Instant Hotline & Callback'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif-display font-light text-[#F4F0E8]">
                {language === 'fa' ? 'تماس سریع و مشاوره تلفنی فوری' : 'Direct Priority Call Desk'}
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

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          {submitted ? (
            <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-serif-display text-[#F4F0E8]">
                  {language === 'fa' ? 'درخواست تماس فوری شما ثبت شد' : 'Instant Callback Scheduled'}
                </h4>
                <p className="text-sm text-[#9B9B95] max-w-md mx-auto leading-relaxed">
                  {language === 'fa'
                    ? `مشاور ارشد راشا مهاجرت ظرف حداکثر ۱۵ دقیقه با شماره ${phone} تماس خواهد گرفت.`
                    : `A senior immigration counsel will connect with you via ${phone} in under 15 minutes.`}
                </p>
                <div className="inline-block mt-3 px-4 py-2 rounded-lg bg-white/[0.04] border border-[#C9A96A]/30 text-xs font-mono text-[#C9A96A]">
                  {language === 'fa' ? 'کد پیگیری درخواست:' : 'Reference Code:'} {trackingCode}
                </div>
              </div>

              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <a
                  href={`https://wa.me/971501234567?text=${encodeURIComponent(
                    `سلام، من درخواست تماس فوری داده‌ام (کد پیگیری: ${trackingCode}). مایل به گفتگو درباره ${topic} هستم.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{language === 'fa' ? 'ارتباط مستقیم در واتس‌اپ' : 'Chat Directly on WhatsApp'}</span>
                </a>

                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-white/[0.08] hover:bg-white/[0.12] text-[#F4F0E8] rounded-xl text-xs font-medium cursor-pointer"
                >
                  {language === 'fa' ? 'متوجه شدم / بستن' : 'Done / Close'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Direct Hotlines Section */}
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#C9A96A] font-semibold block mb-3">
                  {language === 'fa' ? 'شماره‌های مستقیم مشاوران بین‌المللی' : 'Direct International Advisory Desks'}
                </span>
                <div className="grid sm:grid-cols-3 gap-3">
                  <a
                    href="tel:+982188990011"
                    className="p-4 rounded-xl bg-[#080909] border border-white/[0.08] hover:border-[#C9A96A] transition-all group flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between text-xs text-[#9B9B95]">
                      <span className="font-mono text-[#C9A96A]">دفتر مرکزی تهران</span>
                      <PhoneCall className="w-3.5 h-3.5 group-hover:text-[#C9A96A]" />
                    </div>
                    <span className="text-sm font-mono text-[#F4F0E8] font-bold dir-ltr">
                      021-8899 0011
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">پاسخگویی فوری</span>
                  </a>

                  <a
                    href="tel:+97143987720"
                    className="p-4 rounded-xl bg-[#080909] border border-white/[0.08] hover:border-[#C9A96A] transition-all group flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between text-xs text-[#9B9B95]">
                      <span className="font-mono text-[#C9A96A]">دفتر دبی (امارات)</span>
                      <PhoneCall className="w-3.5 h-3.5 group-hover:text-[#C9A96A]" />
                    </div>
                    <span className="text-sm font-mono text-[#F4F0E8] font-bold dir-ltr">
                      +971 4 398 7720
                    </span>
                    <span className="text-[10px] text-[#9B9B95]">ساعات کاری خلیج فارس</span>
                  </a>

                  <a
                    href="tel:+442079460912"
                    className="p-4 rounded-xl bg-[#080909] border border-white/[0.08] hover:border-[#C9A96A] transition-all group flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between text-xs text-[#9B9B95]">
                      <span className="font-mono text-[#C9A96A]">دفتر لندن (انگلستان)</span>
                      <PhoneCall className="w-3.5 h-3.5 group-hover:text-[#C9A96A]" />
                    </div>
                    <span className="text-sm font-mono text-[#F4F0E8] font-bold dir-ltr">
                      +44 20 7946 0912
                    </span>
                    <span className="text-[10px] text-[#9B9B95]">ساعات اداری لندن</span>
                  </a>
                </div>
              </div>

              {/* Instant WhatsApp Connect */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-transparent border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#F4F0E8] block">
                      {language === 'fa' ? 'گفتگوی مستقیم ۲۴ ساعته در واتس‌اپ' : 'Direct WhatsApp Concierge'}
                    </span>
                    <span className="text-[11px] text-[#9B9B95]">
                      {language === 'fa' ? 'ارسال سریع پیام صوتی یا مدارک به مشاوران' : 'Instant messaging & document forwarding'}
                    </span>
                  </div>
                </div>

                <a
                  href="https://wa.me/971501234567?text=سلام،%20برای%20مشاوره%20مهاجرت%20با%20راشا%20مهاجرت%20پیام%20می‌دهم."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#080909] text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-emerald-950/50"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{language === 'fa' ? 'پیام در واتس‌اپ' : 'Start WhatsApp Chat'}</span>
                </a>
              </div>

              {/* Fast 15-Minute Callback Form */}
              <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-[#080909] border border-white/[0.08] space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A96A] uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  <span>{language === 'fa' ? 'درخواست تماس سریع در کمتر از ۱۵ دقیقه' : 'Request Callback within 15 Minutes'}</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase text-[#9B9B95] mb-1">
                      {language === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={language === 'fa' ? 'مثال: علیرضا افشار' : 'e.g. Alireza Afshar'}
                      className="w-full px-3.5 py-2.5 bg-[#111313] border border-white/10 rounded-lg text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase text-[#9B9B95] mb-1">
                      {language === 'fa' ? 'شماره تماس / واتس‌اپ' : 'Phone Number'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={language === 'fa' ? '۰۹۱۲... یا با پیش‌شماره کشور' : '+98 912 ...'}
                      className="w-full px-3.5 py-2.5 bg-[#111313] border border-white/10 rounded-lg text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase text-[#9B9B95] mb-1">
                      {language === 'fa' ? 'موضوع مشاوره' : 'Consultation Topic'}
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#111313] border border-white/10 rounded-lg text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                    >
                      <option value="Skilled & Tech Migration">{language === 'fa' ? 'مهاجرت کاری و نیروی متخصص' : 'Skilled & Tech Migration'}</option>
                      <option value="Study Abroad & Post-Study PR">{language === 'fa' ? 'مهاجرت تحصیلی و اقامت پس از تحصیل' : 'Study Abroad & Post-Study PR'}</option>
                      <option value="Investment & Golden Visas">{language === 'fa' ? 'سرمایه‌گذاری، ثبت شرکت و گلدن ویزا' : 'Investment & Golden Visas'}</option>
                      <option value="Passive Income & Digital Nomad">{language === 'fa' ? 'اقامت تمکن مالی و دیجیتال نومد' : 'Passive Income & Digital Nomad'}</option>
                      <option value="Family Sponsorship">{language === 'fa' ? 'اسپانسرشیپ و الحاق خانواده' : 'Family Sponsorship'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase text-[#9B9B95] mb-1">
                      {language === 'fa' ? 'زمان ترجیحی برای تماس' : 'Preferred Callback Time'}
                    </label>
                    <select
                      value={timePreference}
                      onChange={(e) => setTimePreference(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#111313] border border-white/10 rounded-lg text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                    >
                      <option value="Immediate (< 15 mins)">{language === 'fa' ? 'فوری (حداکثر تا ۱۵ دقیقه آینده)' : 'Immediate (< 15 mins)'}</option>
                      <option value="Today Afternoon">{language === 'fa' ? 'امروز بعد از ظهر' : 'Today Afternoon'}</option>
                      <option value="Today Evening (18:00 - 21:00)">{language === 'fa' ? 'امروز عصر (۱۸ تا ۲۱)' : 'Today Evening (18:00 - 21:00)'}</option>
                      <option value="Tomorrow Morning">{language === 'fa' ? 'فردا صبح' : 'Tomorrow Morning'}</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] hover:from-[#E8CA8C] hover:to-[#DFBA73] text-[#080909] font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#C9A96A]/20 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'fa' ? 'ثبت درخواست تماس و ارجاع به مشاور' : 'Submit Callback Request'}</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
