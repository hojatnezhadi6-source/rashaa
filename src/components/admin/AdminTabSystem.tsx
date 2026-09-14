import React, { useRef } from 'react';
import { Download, Upload, RotateCcw, ShieldCheck, Database, Key } from 'lucide-react';
import { SiteConfig } from '../../types';
import { DEFAULT_SITE_CONFIG, saveSiteConfig } from '../../data/siteConfig';

interface AdminTabSystemProps {
  config: SiteConfig;
  onResetToDefaults: () => void;
  onImportConfig: (newCfg: SiteConfig) => void;
  onShowSuccess: (msg: string) => void;
}

export const AdminTabSystem: React.FC<AdminTabSystemProps> = ({
  config,
  onResetToDefaults,
  onImportConfig,
  onShowSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `rasha-site-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowSuccess('فایل پشتیبان کامل سایت دانلود شد.');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          onImportConfig(parsed);
          onShowSuccess('تنظیمات و محتوای سایت از فایل پشتیبان بازیابی شد.');
        }
      } catch (err) {
        alert('خطا در خواندن فایل پشتیبان. لطفاً از صحت فرمت JSON اطمینان حاصل کنید.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFactoryReset = () => {
    if (
      confirm(
        'هشدار: آیا مطمئنید که می‌خواهید تمام تغییرات، بنرها، مقالات و مقاصد را به حالت اولیه کارخانه بازنشانی نمایید؟'
      )
    ) {
      onResetToDefaults();
      onShowSuccess('تمام اطلاعات و تنظیمات سایت به مقادیر اولیه بازنشانی شد.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Backup & Restore */}
      <div className="p-5 rounded-2xl bg-[#080909] border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-[#F4F0E8] flex items-center gap-2">
          <Database className="w-5 h-5 text-[#C9A96A]" />
          پشتیبان‌گیری و انتقال تنظیمات سایت (Backup & Restore)
        </h3>
        <p className="text-xs text-[#9B9B95] leading-relaxed">
          می‌توانید از کلیه تنظیمات، تصاویر، مقاصد، خدمات و مقالات سایت یک نسخه پشتیبان با فرمت JSON دانلود کرده و در آینده مجدداً بازیابی کنید:
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#DFBA73]" />
            دانلود فایل پشتیبان (JSON Export)
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#DFBA73]" />
            بارگذاری فایل پشتیبان (JSON Import)
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      {/* Security & Access */}
      <div className="p-5 rounded-2xl bg-[#080909] border border-white/10 space-y-3">
        <h3 className="text-base font-bold text-[#F4F0E8] flex items-center gap-2">
          <Key className="w-5 h-5 text-[#C9A96A]" />
          رمزهای ورود فعال پنل مدیریت
        </h3>
        <p className="text-xs text-[#9B9B95] leading-relaxed">
          جهت ورود به پنل، می‌توانید از یکی از گذرواژه‌های پیش‌فرض زیر استفاده فرمایید:
        </p>
        <div className="flex gap-2">
          {['admin', 'rasha2025', '1234'].map((pwd) => (
            <span
              key={pwd}
              className="px-3 py-1.5 rounded-lg bg-[#111313] border border-white/10 font-mono text-xs text-[#DFBA73]"
            >
              {pwd}
            </span>
          ))}
        </div>
      </div>

      {/* Factory Reset */}
      <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
        <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-rose-400" />
          بازنشانی به تنظیمات پیش‌فرض کارخانه (Factory Reset)
        </h3>
        <p className="text-xs text-rose-200/70 leading-relaxed">
          در صورت تمایل به بازگرداندن کلیه محتوا، بنرها، عناوین و کشورهای سایت به حالت روز اول، روی دکمه زیر کلیک نمایید:
        </p>
        <button
          onClick={handleFactoryReset}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/50 text-rose-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          بازنشانی کلیه اطلاعات سایت
        </button>
      </div>
    </div>
  );
};
