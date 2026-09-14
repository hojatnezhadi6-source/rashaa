import React from 'react';
import { Type, Sparkles, Check } from 'lucide-react';
import { PersianFontOption, SiteConfig } from '../../types';

interface AdminTabTypographyProps {
  config: SiteConfig;
  onUpdateField: (field: keyof SiteConfig, val: any) => void;
  onShowSuccess: (msg: string) => void;
}

const FONT_OPTIONS: { id: PersianFontOption; nameFa: string; nameEn: string; desc: string; sample: string }[] = [
  {
    id: 'shabnam',
    nameFa: 'فونت شبنم (لوکس و مدرن)',
    nameEn: 'Shabnam Luxury',
    desc: 'انتخاب پیش‌فرض و استاندارد موسسات حقوقی تراز اول، با هندسه چشم‌نواز و خوانایی فوق‌العاده',
    sample: 'راشا مهاجرت؛ طراحی هوشمندانه اقامت بین‌المللی',
  },
  {
    id: 'sahel',
    nameFa: 'فونت ساحل (نرم و متین)',
    nameEn: 'Sahel Elegant',
    desc: 'حس گرم، صمیمی و در عین حال وزین مناسب مقالات و صفحات مشاوره مهاجرتی',
    sample: 'آینده مقتدرانه خانواده شما در بهترین پایتخت‌های جهان',
  },
  {
    id: 'vazir',
    nameFa: 'فونت وزیرمتن (شفاف و تکنیکال)',
    nameEn: 'Vazirmatn Clean',
    desc: 'دقت بالا و خوانایی بی‌نظیر برای ارقام، مقایسه کشورها و فرم‌های ثبت نام',
    sample: 'بررسی پرونده‌های سرمایه‌گذاری، استارتاپ و ویزای نخبگان',
  },
  {
    id: 'amiri',
    nameFa: 'فونت امیری (کلاسیک و تشریفاتی)',
    nameEn: 'Amiri Royal Display',
    desc: 'سبک نسخ اصیل با حس کالیگرافی دیپلماتیک و سلطنتی',
    sample: 'خدمات ویژه کانسیرج و اخذ شهروندی از طریق سرمایه‌گذاری',
  },
];

export const AdminTabTypography: React.FC<AdminTabTypographyProps> = ({
  config,
  onUpdateField,
  onShowSuccess,
}) => {
  return (
    <div className="space-y-6">
      {/* Persian Font Family Customizer */}
      <div className="p-5 rounded-2xl bg-[#080909] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#DFBA73]">
            <Type className="w-5 h-5 text-[#C9A96A]" />
            <h3 className="text-base font-bold text-[#F4F0E8]">انتخاب فونت فارسی کل سایت (Typography Theme)</h3>
          </div>
          <span className="text-[11px] px-3 py-1 rounded-full bg-[#C9A96A]/20 text-[#E8CA8C] font-mono border border-[#C9A96A]/30">
            فونت فعال: {config.persianFont || 'shabnam'}
          </span>
        </div>
        <p className="text-xs text-[#9B9B95] leading-relaxed">
          با کلیک روی هر گزینه، فونت کل وب‌سایت (تیترها، منوها، کارت‌ها، و فرم‌ها) به سرعت تغییر خواهد کرد:
        </p>

        <div className="grid sm:grid-cols-2 gap-3.5">
          {FONT_OPTIONS.map((opt) => {
            const isSelected = (config.persianFont || 'shabnam') === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => {
                  onUpdateField('persianFont', opt.id);
                  onShowSuccess(`فونت سایت با موفقیت به «${opt.nameFa}» تغییر یافت.`);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#171a1a] to-[#121414] border-[#C9A96A] shadow-[0_0_20px_rgba(201,169,106,0.25)]'
                    : 'bg-[#111313] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#DFBA73]' : 'text-[#F4F0E8]'}`}>
                    {opt.nameFa}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[#C9A96A] text-[#080909] flex items-center justify-center text-xs font-bold">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#9B9B95] mb-3 leading-relaxed">
                  {opt.desc}
                </p>
                <div
                  className="p-2.5 rounded bg-black/40 border border-white/5 text-xs text-[#F4F0E8]"
                  style={{
                    fontFamily:
                      opt.id === 'shabnam'
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

      {/* Main Hero Headlines & Slogans */}
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
