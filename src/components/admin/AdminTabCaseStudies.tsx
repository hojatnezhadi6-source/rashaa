import React, { useState } from 'react';
import { Award, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { CaseStudy, SiteConfig } from '../../types';

interface AdminTabCaseStudiesProps {
  config: SiteConfig;
  onUpdateCaseStudies: (cases: CaseStudy[]) => void;
  onShowSuccess: (msg: string) => void;
}

export const AdminTabCaseStudies: React.FC<AdminTabCaseStudiesProps> = ({
  config,
  onUpdateCaseStudies,
  onShowSuccess,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCase, setNewCase] = useState<Partial<CaseStudy>>({
    profile: 'Private Wealth Family',
    profileFarsi: 'پرونده اقامت دائم خانوادگی',
    title: 'Dr. M. Rezaei & Family',
    titleFarsi: 'دکتر م. رضایی و خانواده',
    destination: 'Canada',
    destinationFarsi: 'کانادا',
    pathway: 'Express Entry Healthcare Stream',
    pathwayFarsi: 'مسیر اولویت‌دار درمانی',
    outcome: 'Permanent Residency Granted',
    outcomeFarsi: 'اخذ اقامت دائم بدون رد یا تاخیر',
    duration: '5 Months',
    durationFarsi: '۵ ماه کاری',
    strategy: 'Fast-track healthcare statutory submission.',
    strategyFarsi: 'استفاده از ظرفیت اولویت‌دار درمانی و ارزیابی مدارک سریع.',
    challenge: 'Tight timeline for credential recognition.',
    challengeFarsi: 'محدودیت زمانی ارزیابی مدارک نظام پزشکی و امتیاز سن.',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
  });

  const handleSaveEdit = (id: string, fields: Partial<CaseStudy>) => {
    const updated = (config.caseStudies || []).map((c) =>
      c.id === id ? { ...c, ...fields } : c
    );
    onUpdateCaseStudies(updated);
    setEditingId(null);
    onShowSuccess('پرونده با موفقیت ویرایش شد.');
  };

  const handleDelete = (id: string) => {
    if ((config.caseStudies || []).length <= 1) {
      alert('حداقل یک پرونده موفق باید در بخش کیس‌استادی موجود باشد.');
      return;
    }
    const updated = (config.caseStudies || []).filter((c) => c.id !== id);
    onUpdateCaseStudies(updated);
    onShowSuccess('پرونده از لیست حذف گردید.');
  };

  const handleAdd = () => {
    if (!newCase.titleFarsi) return;
    const newId = `cs-${Date.now()}`;
    const caseToAdd: CaseStudy = {
      id: newId,
      profile: newCase.profile || 'Executive Case',
      profileFarsi: newCase.profileFarsi || 'پرونده موفق مهاجرت',
      title: newCase.title || 'Client Confidential',
      titleFarsi: newCase.titleFarsi || 'متقاضی محترم راشا',
      destination: newCase.destination || 'Global',
      destinationFarsi: newCase.destinationFarsi || 'کشور مقصد',
      pathway: newCase.pathway || 'Permanent Residency',
      pathwayFarsi: newCase.pathwayFarsi || 'مسیر اقامت دائم',
      outcome: newCase.outcome || 'Approved',
      outcomeFarsi: newCase.outcomeFarsi || 'موافقت و صدور ویزا',
      duration: newCase.duration || '6 Months',
      durationFarsi: newCase.durationFarsi || '۶ ماه',
      strategy: newCase.strategy || '',
      strategyFarsi: newCase.strategyFarsi || '',
      challenge: newCase.challenge || '',
      challengeFarsi: newCase.challengeFarsi || '',
      image: newCase.image || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    };

    onUpdateCaseStudies([...(config.caseStudies || []), caseToAdd]);
    setShowAddModal(false);
    onShowSuccess(`پرونده «${caseToAdd.titleFarsi}» به وب‌سایت افزوده شد.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#080909] border border-white/10">
        <div>
          <h3 className="text-base font-bold text-[#F4F0E8] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#C9A96A]" />
            مدیریت پرونده‌های موفق و نتایج مراجعین (Case Studies Section)
          </h3>
          <p className="text-xs text-[#9B9B95] mt-1 font-light">
            تعداد پرونده‌های نمایش داده شده: {(config.caseStudies || []).length} مورد
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] hover:from-[#E8CA8C] hover:to-[#DFBA73] text-[#080909] font-bold text-xs rounded-xl shadow-lg shadow-[#C9A96A]/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          افزودن پرونده موفق جدید
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {(config.caseStudies || []).map((item) => {
          const isEditing = editingId === item.id;

          return (
            <div
              key={item.id}
              className="p-5 rounded-xl bg-[#080909] border border-white/10 flex flex-col justify-between hover:border-[#C9A96A]/40 transition-all"
            >
              {isEditing ? (
                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="text-[10px] text-[#9B9B95] block mb-1">متقاضی / عنوان پرونده (فارسی):</label>
                    <input
                      type="text"
                      defaultValue={item.titleFarsi || item.title}
                      id={`cs-title-${item.id}`}
                      className="w-full px-2.5 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#9B9B95] block mb-1">کشور مقصد (فارسی):</label>
                    <input
                      type="text"
                      defaultValue={item.destinationFarsi || item.destination}
                      id={`cs-dest-${item.id}`}
                      className="w-full px-2.5 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-[#9B9B95] block mb-1">نتیجه نهایی:</label>
                      <input
                        type="text"
                        defaultValue={item.outcomeFarsi || item.outcome}
                        id={`cs-out-${item.id}`}
                        className="w-full px-2.5 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#9B9B95] block mb-1">مدت زمان:</label>
                      <input
                        type="text"
                        defaultValue={item.durationFarsi || item.duration}
                        id={`cs-dur-${item.id}`}
                        className="w-full px-2.5 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#9B9B95] block mb-1">استراتژی و راهکار اجرایی:</label>
                    <textarea
                      defaultValue={item.strategyFarsi || item.strategy}
                      id={`cs-strat-${item.id}`}
                      rows={2}
                      className="w-full px-2.5 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        const titleFarsi = (document.getElementById(`cs-title-${item.id}`) as HTMLInputElement)?.value;
                        const destinationFarsi = (document.getElementById(`cs-dest-${item.id}`) as HTMLInputElement)?.value;
                        const outcomeFarsi = (document.getElementById(`cs-out-${item.id}`) as HTMLInputElement)?.value;
                        const durationFarsi = (document.getElementById(`cs-dur-${item.id}`) as HTMLInputElement)?.value;
                        const strategyFarsi = (document.getElementById(`cs-strat-${item.id}`) as HTMLTextAreaElement)?.value;
                        handleSaveEdit(item.id, { titleFarsi, destinationFarsi, outcomeFarsi, durationFarsi, strategyFarsi });
                      }}
                      className="flex-1 py-1.5 bg-[#C9A96A] text-[#080909] font-bold rounded flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      ذخیره
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
                      {item.durationFarsi || item.duration}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-medium">
                      ✓ {item.outcomeFarsi || item.outcome}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F4F0E8]">
                      {item.titleFarsi || item.title}
                    </h4>
                    <p className="text-xs text-[#C9A96A] mt-0.5 font-medium">
                      {item.destinationFarsi || item.destination}
                    </p>
                    <p className="text-xs text-[#9B9B95] mt-2 leading-relaxed">
                      {item.strategyFarsi || item.strategy}
                    </p>
                  </div>
                </div>
              )}

              {!isEditing && (
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-xs">
                  <button
                    onClick={() => setEditingId(item.id)}
                    className="text-[#DFBA73] hover:text-[#F4F0E8] flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={(config.caseStudies || []).length <= 1}
                    className="text-rose-400 hover:text-rose-300 flex items-center gap-1 disabled:opacity-30 cursor-pointer"
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
              <Plus className="w-4 h-4 text-[#C9A96A]" />
              افزودن پرونده موفق جدید به سایت
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-[#9B9B95] block mb-1">نام یا عنوان پرونده (فارسی):</label>
                <input
                  type="text"
                  value={newCase.titleFarsi}
                  onChange={(e) => setNewCase({ ...newCase, titleFarsi: e.target.value })}
                  placeholder="مثال: مهندس س. مرادی و خانواده"
                  className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9B9B95] block mb-1">کشور و برنامه ویزایی:</label>
                <input
                  type="text"
                  value={newCase.destinationFarsi}
                  onChange={(e) => setNewCase({ ...newCase, destinationFarsi: e.target.value })}
                  placeholder="مثال: آلمان (کارت شانس کاری Chancenkarte)"
                  className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-[#9B9B95] block mb-1">نتیجه نهایی:</label>
                  <input
                    type="text"
                    value={newCase.outcomeFarsi}
                    onChange={(e) => setNewCase({ ...newCase, outcomeFarsi: e.target.value })}
                    placeholder="مثال: صدور ویزای کار در ۴ ماه"
                    className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#9B9B95] block mb-1">مدت زمان:</label>
                  <input
                    type="text"
                    value={newCase.durationFarsi}
                    onChange={(e) => setNewCase({ ...newCase, durationFarsi: e.target.value })}
                    placeholder="مثال: ۴ ماه"
                    className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#9B9B95] block mb-1">استراتژی و نحوه پیشبرد پرونده:</label>
                <textarea
                  value={newCase.strategyFarsi}
                  onChange={(e) => setNewCase({ ...newCase, strategyFarsi: e.target.value })}
                  rows={2}
                  placeholder="نکات کلیدی که باعث موفقیت این پرونده شد..."
                  className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={handleAdd}
                className="flex-1 py-2.5 bg-[#C9A96A] hover:bg-[#DFBA73] text-[#080909] font-bold text-xs rounded-xl cursor-pointer"
              >
                افزودن پرونده به سایت
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
