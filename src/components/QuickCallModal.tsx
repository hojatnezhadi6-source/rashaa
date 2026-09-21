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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#080909]/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-[#111313] border border-[#C9A96A]/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C9A96A] to-transparent" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C9A96A]/10 border border-[#C9A96A]/40 flex items-center justify-center text-[#C9A96A]">
              <PhoneCall className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#C9A96A]">
                  {language === 'fa' ? 'پاسخگویی فوری' : 'Instant Callback'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h3 className="text-base sm:text-lg font-serif-display font-medium text-[#F4F0E8]">
                {language === 'fa' ? 'تماس سریع و مشاوره تلفنی' : 'Priority Call Desk'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-[#9B9B95] hover:text-[#F4F0E8] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-4 sm:p-5 space-y-4 overflow-y-auto">
          {submitted ? (
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-serif-display text-[#F4F0E8]">
                  {language === 'fa' ? 'درخواست تماس فوری شما ثبت شد' : 'Instant Callback Scheduled'}
                </h4>
                <p className="text-xs text-[#9B9B95] max-w-sm mx-auto leading-relaxed">
                  {language === 'fa'
                    ? `مشاور ارشد راشا مهاجرت ظرف حداکثر ۱۵ دقیقه با شماره ${phone} تماس خواهد گرفت.`
                    : `A senior immigration counsel will connect with you via ${phone} in under 15 minutes.`}
                </p>
                <div className="inline-block mt-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-[#C9A96A]/30 text-[11px] font-mono text-[#C9A96A]">
                  {language === 'fa' ? 'کد پیگیری:' : 'Ref Code:'} {trackingCode}
                </div>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-2.5">
                <a
                  href={`https://wa.me/989120000000?text=${encodeURIComponent(
                    `سلام، من درخواست تماس فوری داده‌ام (کد پیگیری: ${trackingCode}). موضوع مشاوره: ${topic}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{language === 'fa' ? 'ارتباط در واتس‌اپ' : 'Chat on WhatsApp'}</span>
                </a>

                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-[#F4F0E8] rounded-lg text-xs font-medium cursor-pointer"
                >
                  {language === 'fa' ? 'بستن' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Direct Quick Connection Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href="tel:+982188990011"
                  className="p-3 rounded-xl bg-[#080909] border border-white/[0.08] hover:border-[#C9A96A] transition-all group flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between text-[11px] text-[#9B9B95]">
                    <span className="text-[#C9A96A] font-semibold">{language === 'fa' ? 'تماس مستقیم تلفنی' : 'Hotline'}</span>
                    <PhoneCall className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-xs sm:text-sm font-mono text-[#F4F0E8] font-bold dir-ltr">
                    021-8899 0011
                  </span>
                  <span className="text-[10px] text-emerald-400/80">{language === 'fa' ? 'پاسخگویی فوری' : 'Live Advisors'}</span>
                </a>

                <a
                  href="https://wa.me/989120000000?text=سلام،%20برای%20مشاوره%20مهاجرت%20با%20راشا%20مهاجرت%20پیام%20می‌دهم."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/25 hover:border-emerald-400/60 transition-all group flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between text-[11px] text-emerald-300">
                    <span className="font-semibold">{language === 'fa' ? 'واتس‌اپ رسمی' : 'WhatsApp'}</span>
                    <MessageCircle className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-xs sm:text-sm font-mono text-[#F4F0E8] font-bold dir-ltr">
                    +98 912 000 0000
                  </span>
                  <span className="text-[10px] text-emerald-400/80">{language === 'fa' ? 'ارسال صوت و مدارک' : '24/7 Chat'}</span>
                </a>
              </div>

              {/* Fast Callback Form */}
              <form onSubmit={handleSubmit} className="p-3.5 sm:p-4 rounded-xl bg-[#080909] border border-white/[0.08] space-y-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#C9A96A] uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{language === 'fa' ? 'درخواست تماس مشاور در ۱۵ دقیقه' : 'Request Callback in 15 Mins'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-[#9B9B95] mb-1">
                      {language === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={language === 'fa' ? 'نام شما' : 'Your name'}
                      className="w-full px-3 py-2 bg-[#111313] border border-white/10 rounded-lg text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#9B9B95] mb-1">
                      {language === 'fa' ? 'شماره همراه / تماس' : 'Phone Number'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="۰۹۱۲..."
                      className="w-full px-3 py-2 bg-[#111313] border border-white/10 rounded-lg text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none dir-ltr text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-[#9B9B95] mb-1">
                      {language === 'fa' ? 'موضوع مشاوره' : 'Topic'}
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-2.5 py-2 bg-[#111313] border border-white/10 rounded-lg text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                    >
                      <option value="Skilled & Tech Migration">{language === 'fa' ? 'مهاجرت کاری و نیروی متخصص' : 'Skilled Worker'}</option>
                      <option value="Study Abroad & Post-Study PR">{language === 'fa' ? 'مهاجرت تحصیلی' : 'Study Abroad'}</option>
                      <option value="Investment & Golden Visas">{language === 'fa' ? 'سرمایه‌گذاری و ثبت شرکت' : 'Investment'}</option>
                      <option value="Passive Income & Digital Nomad">{language === 'fa' ? 'تمکن مالی و دیجیتال نومد' : 'Passive Income'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#9B9B95] mb-1">
                      {language === 'fa' ? 'زمان تماس' : 'Preferred Time'}
                    </label>
                    <select
                      value={timePreference}
                      onChange={(e) => setTimePreference(e.target.value)}
                      className="w-full px-2.5 py-2 bg-[#111313] border border-white/10 rounded-lg text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                    >
                      <option value="Immediate (< 15 mins)">{language === 'fa' ? 'فوری (تا ۱۵ دقیقه)' : 'Immediate'}</option>
                      <option value="Today Afternoon">{language === 'fa' ? 'امروز بعد از ظهر' : 'Afternoon'}</option>
                      <option value="Today Evening (18:00 - 21:00)">{language === 'fa' ? 'امروز عصر (۱۸ تا ۲۱)' : 'Evening'}</option>
                      <option value="Tomorrow Morning">{language === 'fa' ? 'فردا صبح' : 'Tomorrow'}</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] hover:from-[#E8CA8C] hover:to-[#DFBA73] text-[#080909] font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow transition-all cursor-pointer mt-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'fa' ? 'درخواست تماس مشاور' : 'Call Me Back'}</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
