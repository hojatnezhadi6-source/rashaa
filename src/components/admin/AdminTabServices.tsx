import React, { useState } from 'react';
import { Briefcase, Plus, Trash2, Edit2, Check, Sparkles } from 'lucide-react';
import { ServiceItem, SiteConfig } from '../../types';

interface AdminTabServicesProps {
  config: SiteConfig;
  onUpdateServices: (services: ServiceItem[]) => void;
  onShowSuccess: (msg: string) => void;
}

export const AdminTabServices: React.FC<AdminTabServicesProps> = ({
  config,
  onUpdateServices,
  onShowSuccess,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitleFa, setNewTitleFa] = useState('کانسیرج اختصاصی خانواده‌های ویژه');
  const [newSubtitleFa, setNewSubtitleFa] = useState('مشاوره اختصاصی سطح اول بین‌المللی');
  const [newDescFa, setNewDescFa] = useState('راهکارهای جامع مهاجرت خانوادگی، ساختاربندی دارایی‌ها و خدمات اقامتی تشریفاتی.');
  const [newTargetFa, setNewTargetFa] = useState('خانواده‌های متمول و سرمایه‌گذاران بخش خصوصی');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=80');

  const handleSaveEdit = (id: string, updatedFields: Partial<ServiceItem>) => {
    const updated = (config.services || []).map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
    onUpdateServices(updated);
    setEditingId(null);
    onShowSuccess('حوزه تخصصی و خدمات با موفقیت ویرایش شد.');
  };

  const handleDelete = (id: string) => {
    if ((config.services || []).length <= 1) {
      alert('حداقل یک خدمت باید در سایت فعال باشد.');
      return;
    }
    const updated = (config.services || []).filter((s) => s.id !== id);
    onUpdateServices(updated);
    onShowSuccess('خدمت مورد نظر از وب‌سایت حذف شد.');
  };

  const handleAdd = () => {
    if (!newTitleFa) return;
    const newId = `svc-${Date.now()}`;
    const serviceToAdd: ServiceItem = {
      id: newId,
      title: 'Specialized Advisory',
      titleFarsi: newTitleFa,
      subtitle: 'Direct Statutory Framework',
      subtitleFarsi: newSubtitleFa,
      description: 'Comprehensive immigration and corporate advisory solutions.',
      descriptionFarsi: newDescFa,
      targetAudience: ['Corporate & Private Clients'],
      targetAudienceFarsi: [newTargetFa],
      image: newImage,
      iconName: 'Shield',
      keyBenefits: ['Statutory assessment', 'Bespoke strategy'],
      keyBenefitsFarsi: ['ارزیابی جامع حقوقی', 'استراتژی اختصاصی'],
      includedAdvisory: ['Direct Filing', 'Settlement Advisory'],
      includedAdvisoryFarsi: ['ارائه مستقیم پرونده', 'خدمات استقرار'],
    };

    onUpdateServices([...(config.services || []), serviceToAdd]);
    setShowAddModal(false);
    onShowSuccess(`خدمت «${serviceToAdd.titleFarsi}» به وب‌سایت افزوده شد.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#080909] border border-white/10">
        <div>
          <h3 className="text-base font-bold text-[#F4F0E8] flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#C9A96A]" />
            مدیریت خدمات و حوزه‌های تخصصی مهاجرت (Services Section)
          </h3>
          <p className="text-xs text-[#9B9B95] mt-1 font-light">
            تعداد خدمات فعال: {(config.services || []).length} خدمت | می‌توانید عناوین، جامعه هدف و توضیحات هر خدمت را سفارشی‌سازی نمایید.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] hover:from-[#E8CA8C] hover:to-[#DFBA73] text-[#080909] font-bold text-xs rounded-xl shadow-lg shadow-[#C9A96A]/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          افزودن حوزه خدمت جدید
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {(config.services || []).map((svc) => {
          const isEditing = editingId === svc.id;

          return (
            <div
              key={svc.id}
              className="p-5 rounded-xl bg-[#080909] border border-white/10 flex flex-col justify-between hover:border-[#C9A96A]/40 transition-all"
            >
              {isEditing ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] text-[#9B9B95] block mb-1">عنوان فارسی خدمت:</label>
                    <input
                      type="text"
                      defaultValue={svc.titleFarsi || svc.title}
                      id={`svc-title-fa-${svc.id}`}
                      className="w-full px-2.5 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#9B9B95] block mb-1">عنوان فرعی / تگ لاین (فارسی):</label>
                    <input
                      type="text"
                      defaultValue={svc.subtitleFarsi || svc.subtitle}
                      id={`svc-sub-fa-${svc.id}`}
                      className="w-full px-2.5 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#9B9B95] block mb-1">جامعه هدف (مناسب برای چه افرادی):</label>
                    <input
                      type="text"
                      defaultValue={svc.targetAudienceFarsi?.[0] || ''}
                      id={`svc-target-fa-${svc.id}`}
                      className="w-full px-2.5 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#9B9B95] block mb-1">توضیحات کامل خدمت:</label>
                    <textarea
                      defaultValue={svc.descriptionFarsi || svc.description}
                      id={`svc-desc-fa-${svc.id}`}
                      rows={3}
                      className="w-full px-2.5 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#9B9B95] block mb-1">آدرس عکس پس‌زمینه خدمت:</label>
                    <input
                      type="text"
                      defaultValue={svc.image}
                      id={`svc-img-${svc.id}`}
                      className="w-full px-2.5 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        const titleFarsi = (document.getElementById(`svc-title-fa-${svc.id}`) as HTMLInputElement)?.value;
                        const subtitleFarsi = (document.getElementById(`svc-sub-fa-${svc.id}`) as HTMLInputElement)?.value;
                        const targetAudienceVal = (document.getElementById(`svc-target-fa-${svc.id}`) as HTMLInputElement)?.value;
                        const descriptionFarsi = (document.getElementById(`svc-desc-fa-${svc.id}`) as HTMLTextAreaElement)?.value;
                        const image = (document.getElementById(`svc-img-${svc.id}`) as HTMLInputElement)?.value;
                        handleSaveEdit(svc.id, {
                          titleFarsi,
                          subtitleFarsi,
                          targetAudienceFarsi: [targetAudienceVal],
                          descriptionFarsi,
                          image,
                        });
                      }}
                      className="flex-1 py-1.5 bg-[#C9A96A] text-[#080909] font-bold rounded flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      ذخیره تغییرات
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 bg-white/10 text-white rounded cursor-pointer"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#DFBA73] px-2 py-0.5 rounded bg-[#C9A96A]/10 border border-[#C9A96A]/20">
                      حوزه تخصصی
                    </span>
                    <span className="text-[11px] text-[#9B9B95]">
                      {svc.targetAudienceFarsi?.[0] || svc.targetAudience?.[0] || 'متقاضیان بین‌المللی'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#F4F0E8]">
                      {svc.titleFarsi || svc.title}
                    </h4>
                    <p className="text-xs text-[#C9A96A] mt-0.5">
                      {svc.subtitleFarsi || svc.subtitle}
                    </p>
                    <p className="text-xs text-[#9B9B95] mt-2 line-clamp-3 leading-relaxed">
                      {svc.descriptionFarsi || svc.description}
                    </p>
                  </div>
                </div>
              )}

              {!isEditing && (
                <div className="flex items-center justify-between pt-3 mt-4 border-t border-white/10 text-xs">
                  <button
                    onClick={() => setEditingId(svc.id)}
                    className="flex items-center gap-1 text-[#DFBA73] hover:text-[#F4F0E8] transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(svc.id)}
                    disabled={(config.services || []).length <= 1}
                    className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#111313] border border-[#C9A96A]/60 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-[#F4F0E8] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A96A]" />
              افزودن خدمت یا حوزه تخصصی جدید
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-[#9B9B95] block mb-1">عنوان فارسی خدمت:</label>
                <input
                  type="text"
                  value={newTitleFa}
                  onChange={(e) => setNewTitleFa(e.target.value)}
                  placeholder="مثال: اقامت بازنشستگی و تمکن مالی اروپا"
                  className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9B9B95] block mb-1">عنوان فرعی (تگ لاین):</label>
                <input
                  type="text"
                  value={newSubtitleFa}
                  onChange={(e) => setNewSubtitleFa(e.target.value)}
                  placeholder="مثال: بدون نیاز به راه‌اندازی کسب‌وکار با درآمد پایدار"
                  className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9B9B95] block mb-1">جامعه هدف متقاضیان:</label>
                <input
                  type="text"
                  value={newTargetFa}
                  onChange={(e) => setNewTargetFa(e.target.value)}
                  placeholder="مثال: پزشکان، مدیران ارشد و صاحبان املاک"
                  className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9B9B95] block mb-1">توضیح تفصیلی:</label>
                <textarea
                  value={newDescFa}
                  onChange={(e) => setNewDescFa(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={handleAdd}
                className="flex-1 py-2.5 bg-[#C9A96A] hover:bg-[#DFBA73] text-[#080909] font-bold text-xs rounded-xl cursor-pointer"
              >
                تأیید و افزودن خدمت
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs rounded-xl cursor-pointer"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
