import React from 'react';
import { Phone, Mail, MessageSquare, Clock, MapPin } from 'lucide-react';
import { SiteConfig } from '../../types';

interface AdminTabContactProps {
  config: SiteConfig;
  onUpdateField: (field: keyof SiteConfig, val: any) => void;
  onShowSuccess: (msg: string) => void;
}

export const AdminTabContact: React.FC<AdminTabContactProps> = ({
  config,
  onUpdateField,
  onShowSuccess,
}) => {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-[#080909] border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-[#F4F0E8] flex items-center gap-2">
          <Phone className="w-5 h-5 text-[#C9A96A]" />
          مدیریت خطوط تماس و کانسیرج بین‌المللی (Contact & Hotlines)
        </h3>
        <p className="text-xs text-[#9B9B95]">
          این شماره‌ها در منوی بالا (تماس فوری VIP)، پانویس سایت و بخش فرم رزرو مشاوره نمایش داده می‌شوند.
        </p>

        <div className="grid md:grid-cols-2 gap-4 text-xs pt-2">
          <div>
            <label className="text-[11px] text-[#C9A96A] block mb-1.5 font-bold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              شماره دفتر دبی (امارات متحده عربی):
            </label>
            <input
              type="text"
              value={config.phoneDubai || '+971 4 398 7720'}
              onChange={(e) => onUpdateField('phoneDubai', e.target.value)}
              placeholder="+971 4 398 7720"
              className="w-full px-3.5 py-2.5 bg-[#111313] border border-white/15 rounded-xl text-white focus:border-[#C9A96A] focus:outline-none font-mono text-left ltr"
            />
          </div>

          <div>
            <label className="text-[11px] text-[#C9A96A] block mb-1.5 font-bold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              شماره دفتر لندن (بریتانیا):
            </label>
            <input
              type="text"
              value={config.phoneLondon || '+44 20 7946 0912'}
              onChange={(e) => onUpdateField('phoneLondon', e.target.value)}
              placeholder="+44 20 7946 0912"
              className="w-full px-3.5 py-2.5 bg-[#111313] border border-white/15 rounded-xl text-white focus:border-[#C9A96A] focus:outline-none font-mono text-left ltr"
            />
          </div>

          <div>
            <label className="text-[11px] text-[#C9A96A] block mb-1.5 font-bold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              شماره خط ویژه تهران (ایران):
            </label>
            <input
              type="text"
              value={config.phoneIran || '+98 21 8877 6655'}
              onChange={(e) => onUpdateField('phoneIran', e.target.value)}
              placeholder="+98 21 8877 6655"
              className="w-full px-3.5 py-2.5 bg-[#111313] border border-white/15 rounded-xl text-white focus:border-[#C9A96A] focus:outline-none font-mono text-left ltr"
            />
          </div>

          <div>
            <label className="text-[11px] text-[#C9A96A] block mb-1.5 font-bold flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              شماره واتس‌اپ رسمی (جهت چت مستقیم مراجعین):
            </label>
            <input
              type="text"
              value={config.whatsappNumber || '+971 50 123 4567'}
              onChange={(e) => onUpdateField('whatsappNumber', e.target.value)}
              placeholder="+971 50 123 4567"
              className="w-full px-3.5 py-2.5 bg-[#111313] border border-white/15 rounded-xl text-white focus:border-[#C9A96A] focus:outline-none font-mono text-left ltr"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-[11px] text-[#C9A96A] block mb-1.5 font-bold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              ایمیل رسمی دسک مشاوره حقوقی:
            </label>
            <input
              type="email"
              value={config.consultationEmail || 'advisory@rashamohajerat.com'}
              onChange={(e) => onUpdateField('consultationEmail', e.target.value)}
              placeholder="advisory@rashamohajerat.com"
              className="w-full px-3.5 py-2.5 bg-[#111313] border border-white/15 rounded-xl text-white focus:border-[#C9A96A] focus:outline-none font-mono text-left ltr"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
