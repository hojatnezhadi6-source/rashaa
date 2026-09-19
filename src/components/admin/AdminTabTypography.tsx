import React from 'react';
import { Type, Sparkles, Check, Globe } from 'lucide-react';
import { PersianFontOption, EnglishFontOption, SiteConfig } from '../../types';

interface AdminTabTypographyProps {
  config: SiteConfig;
  onUpdateField: (field: keyof SiteConfig, val: any) => void;
  onShowSuccess: (msg: string) => void;
}

const PERSIAN_FONT_OPTIONS: {
  id: PersianFontOption;
  nameFa: string;
  usageFa: string;
  desc: string;
  sample: string;
  badge: string;
}[] = [
  {
    id: 'peyda',
    nameFa: 'Peyda (پیدا)',
    usageFa: 'تیتر فارسی مدرن',
    desc: 'مدرن، مینیمال و لوکس؛ ترند برتر وب‌سایت‌های بین‌المللی و شرکت‌های مهاجرتی پیشرو',
    sample: 'راشا مهاجرت؛ طراحی هوشمندانه اقامت و شهروندی بین‌المللی',
    badge: 'پیشنهادی تیتر مدرن',
  },
  {
    id: 'estedad',
    nameFa: 'Estedad (استعداد)',
    usageFa: 'تیتر فارسی رسمی و قدرتمند',
    desc: 'استوار، با صلابت و رسمی با خوانایی فوق‌العاده در صفحات شرکتی و وکالتی',
    sample: 'مشاوره استراتژیک سرمایه‌گذاری و پرونده‌های اقامت نخبگان',
    badge: 'پیشنهادی رسمی و حقوقی',
  },
  {
    id: 'shabnam',
    nameFa: 'Shabnam (شبنم)',
    usageFa: 'لوکس و باوقار',
    desc: 'هندسه چشم‌نواز و نرم با ساختار متعادل مناسب متن‌ها و تیترها',
    sample: 'آینده مقتدرانه خانواده شما در برترین پایتخت‌های جهان',
    badge: 'کلاسیک مدرن',
  },
  {
    id: 'vazir',
    nameFa: 'Vazirmatn (وزیرمتن)',
    usageFa: 'تکنیکال و شفاف',
    desc: 'دقت بالا و خوانایی بی‌نظیر برای ارقام، مقایسه کشورها و فرم‌های ویزا',
    sample: 'بررسی شاخص‌های کیفیت زندگی و جدول امتیازات مهاجرتی',
    badge: 'خوانایی بالا',
  },
  {
    id: 'sahel',
    nameFa: 'Sahel (ساحل)',
    usageFa: 'نرم و صمیمی',
    desc: 'حس گرم، صمیمی و در عین حال وزین مناسب مقالات و فرم‌های مشاوره',
    sample: 'مهاجرت تحصیلی و کاری با آرامش خاطر کامل',
    badge: 'متین و روان',
  },
  {
    id: 'amiri',
    nameFa: 'Amiri (امیری)',
    usageFa: 'سنتی و دیپلماتیک',
    desc: 'سبک نسخ اصیل با حس کالیگرافی دیپلماتیک و رسمی',
    sample: 'خدمات تشریفاتی کانسیرج و اخذ پاسپورت دوم',
    badge: 'تشریفاتی',
  },
];

const ENGLISH_FONT_OPTIONS: {
  id: EnglishFontOption;
  nameEn: string;
  usageFa: string;
  desc: string;
  sample: string;
  fontFamily: string;
}[] = [
  {
    id: 'sora',
    nameEn: 'Sora',
    usageFa: 'تیتر انگلیسی مدرن',
    desc: 'هندسی، با ابهت و معاصر، متناسب با برندهای تراز اول جهانی و Mobility Tech',
    sample: 'RASHA IMMIGRATION — BORDERLESS HORIZONS',
    fontFamily: "'Sora', sans-serif",
  },
  {
    id: 'playfair',
    nameEn: 'Playfair Display',
    usageFa: 'تیتر انگلیسی کلاسیک و لوکس',
    desc: 'سریف اصیل ایتالیایی با کنتراست خطوط بالا، نمایانگر پرستیژ و تشریفات دیپلماتیک',
    sample: 'Strategic Global Residency & Citizenship by Investment',
    fontFamily: "'Playfair Display', serif",
  },
  {
    id: 'manrope',
    nameEn: 'Manrope',
    usageFa: 'سوییسی شرکتی مینیمال',
    desc: 'مینیمال، بسیار خوانا و تمیز برای بخش‌های اطلاعاتی و جداول',
    sample: 'Corporate Global Mobility & Executive Visas',
    fontFamily: "'Manrope', sans-serif",
  },
  {
    id: 'cormorant',
    nameEn: 'Cormorant Garamond',
    usageFa: 'ادیتوریال اشرافی کهن',
    desc: 'ظرافت کلاسیک با حروف ادیتوریال مجلل برای مشتریان ویژه VIP',
    sample: 'Bespoke Private Client Immigration Services',
    fontFamily: "'Cormorant Garamond', serif",
  },
];

export const AdminTabTypography: React.FC<AdminTabTypographyProps> = ({
  config,
  onUpdateField,
  onShowSuccess,
}) => {
  const currentPersianFont = config.persianFont || config.persianFontTheme || 'peyda';
  const currentEnglishFont = config.englishFont || config.englishFontTheme || 'sora';

  return (
    <div className="space-y-6">
      {/* 1. Persian Font Selection */}
      <div className="p-5 rounded-2xl bg-[#080909] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#DFBA73]">
            <Type className="w-5 h-5 text-[#C9A96A]" />
            <h3 className="text-base font-bold text-[#F4F0E8]">
              انتخاب فونت فارسی تیترها و متون (Persian Typography)
            </h3>
          </div>
          <span className="text-[11px] px-3 py-1 rounded-full bg-[#C9A96A]/20 text-[#E8CA8C] font-mono border border-[#C9A96A]/30 self-start sm:self-auto">
            فونت فعال: {currentPersianFont}
          </span>
        </div>

        <p className="text-xs text-[#9B9B95] leading-relaxed">
          فونت فارسی تیترها و متون کل سایت (شامل کارت‌ها، دکمه‌ها و هدرها) بلافاصله با انتخاب هر گزینه تغییر می‌کند:
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {PERSIAN_FONT_OPTIONS.map((opt) => {
            const isSelected = currentPersianFont === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => {
                  onUpdateField('persianFont', opt.id);
                  onUpdateField('persianFontTheme', opt.id);
                  onShowSuccess(`فونت فارسی با موفقیت به «${opt.nameFa} — ${opt.usageFa}» تغییر یافت.`);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#171a1a] to-[#121414] border-[#C9A96A] shadow-[0_0_20px_rgba(201,169,106,0.25)]'
                    : 'bg-[#111313] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${isSelected ? 'text-[#DFBA73]' : 'text-[#F4F0E8]'}`}>
                      {opt.nameFa}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-[#C9A96A] border border-white/5 font-mono">
                      {opt.usageFa}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[#C9A96A] text-[#080909] flex items-center justify-center text-xs font-bold">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#9B9B95] mb-2.5 leading-relaxed">
                  {opt.desc}
                </p>

                <div
                  className="p-2.5 rounded bg-black/40 border border-white/5 text-xs text-[#F4F0E8] font-bold"
                  style={{
                    fontFamily:
                      opt.id === 'peyda'
                        ? '"Peyda", "Shabnam", system-ui, sans-serif'
                        : opt.id === 'estedad'
                        ? '"Estedad", "Vazirmatn", system-ui, sans-serif'
                        : opt.id === 'shabnam'
                        ? '"Shabnam", system-ui, sans-serif'
                        : opt.id === 'sahel'
                        ? '"Sahel", system-ui, sans-serif'
                        : opt.id === 'vazir'
                        ? '"Vazirmatn", system-ui, sans-serif'
                        : '"Amiri", serif',
                  }}
                >
                  {opt.sample}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. English & Latin Font Selection */}
      <div className="p-5 rounded-2xl bg-[#080909] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#DFBA73]">
            <Globe className="w-5 h-5 text-[#C9A96A]" />
            <h3 className="text-base font-bold text-[#F4F0E8]">
              انتخاب فونت انگلیسی / بین‌المللی (English & Global Display)
            </h3>
          </div>
          <span className="text-[11px] px-3 py-1 rounded-full bg-[#C9A96A]/20 text-[#E8CA8C] font-mono border border-[#C9A96A]/30 self-start sm:self-auto">
            فونت فعال: {currentEnglishFont}
          </span>
        </div>

        <p className="text-xs text-[#9B9B95] leading-relaxed">
          فونت عناوین انگلیسی، نشان‌های بین‌المللی و عبارات لاتین در تمام صفحات:
        </p>

        <div className="grid sm:grid-cols-2 gap-3.5">
          {ENGLISH_FONT_OPTIONS.map((opt) => {
            const isSelected = currentEnglishFont === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => {
                  onUpdateField('englishFont', opt.id);
                  onUpdateField('englishFontTheme', opt.id);
                  onShowSuccess(`فونت انگلیسی با موفقیت به «${opt.nameEn} — ${opt.usageFa}» تغییر یافت.`);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#171a1a] to-[#121414] border-[#C9A96A] shadow-[0_0_20px_rgba(201,169,106,0.25)]'
                    : 'bg-[#111313] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${isSelected ? 'text-[#DFBA73]' : 'text-[#F4F0E8]'}`}>
                      {opt.nameEn}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-[#C9A96A] border border-white/5 font-mono">
                      {opt.usageFa}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[#C9A96A] text-[#080909] flex items-center justify-center text-xs font-bold">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#9B9B95] mb-2.5 leading-relaxed">
                  {opt.desc}
                </p>

                <div
                  className="p-2.5 rounded bg-black/40 border border-white/5 text-xs text-[#F4F0E8] tracking-wide"
                  style={{ fontFamily: opt.fontFamily }}
                >
                  {opt.sample}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Main Hero Headlines & Slogans */}
      <div className="p-5 rounded-2xl bg-[#080909] border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-[#F4F0E8] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#C9A96A]" />
          تیترها و عبارات نمایشی صفحه اول (Hero Headlines)
        </h3>

        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-[11px] text-[#C9A96A] block mb-1.5 font-bold">تیتر اول صفحه (فارسی):</label>
            <input
              type="text"
              value={config.heroHeadline1Fa}
              onChange={(e) => onUpdateField('heroHeadline1Fa', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111313] border border-white/15 rounded-xl text-white focus:border-[#C9A96A] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] text-[#C9A96A] block mb-1.5 font-bold">تیتر دوم صفحه (فارسی):</label>
            <input
              type="text"
              value={config.heroHeadline2Fa}
              onChange={(e) => onUpdateField('heroHeadline2Fa', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111313] border border-white/15 rounded-xl text-white focus:border-[#C9A96A] focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-[11px] text-[#C9A96A] block mb-1.5 font-bold">متن تشریحی و شعار زیر تیتر (فارسی):</label>
            <textarea
              value={config.heroSubtitleFa}
              onChange={(e) => onUpdateField('heroSubtitleFa', e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 bg-[#111313] border border-white/15 rounded-xl text-white focus:border-[#C9A96A] focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-[11px] text-[#C9A96A] block mb-1.5 font-bold">بج و اعلان طلایی بالای صفحه (Badge Text):</label>
            <input
              type="text"
              value={config.badgeTextFa}
              onChange={(e) => onUpdateField('badgeTextFa', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111313] border border-white/15 rounded-xl text-white focus:border-[#C9A96A] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
