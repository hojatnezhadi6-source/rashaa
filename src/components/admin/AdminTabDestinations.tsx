import React, { useState } from 'react';
import { Globe, Plus, Trash2, Edit2, Check, Sparkles } from 'lucide-react';
import { Destination, SiteConfig } from '../../types';

interface AdminTabDestinationsProps {
  config: SiteConfig;
  onUpdateDestinations: (destinations: Destination[]) => void;
  onShowSuccess: (msg: string) => void;
}

export const AdminTabDestinations: React.FC<AdminTabDestinationsProps> = ({
  config,
  onUpdateDestinations,
  onShowSuccess,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDest, setNewDest] = useState<Partial<Destination>>({
    name: 'New Destination',
    nameFarsi: 'کشور مقصد جدید',
    tagline: 'World-Class Residence',
    taglineFarsi: 'فرصت بی‌نظیر اقامت و سرمایه‌گذاری',
    processingTime: '6 - 12 Months',
    processingTimeFarsi: '۶ الی ۱۲ ماه',
    costBracket: '$150,000+',
    costBracketFarsi: 'از ۱۵۰,۰۰۰ دلار',
    overview: 'High standard of living and global mobility access.',
    overviewFarsi: 'دسترسی آزاد به بازارهای جهانی و کیفیت استثنایی زندگی خانوادگی.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
    categories: ['residency', 'investment'],
    highlights: ['Financial security', 'Global mobility', 'High standard education'],
    highlightsFarsi: ['امنیت اقتصادی و حقوقی', 'سفر بدون ویزا', 'تحصیل تراز اول بین‌المللی'],
  });

  const handleSaveEdit = (id: string, updatedFields: Partial<Destination>) => {
    const updated = (config.destinations || []).map((d) => (d.id === id ? { ...d, ...updatedFields } : d));
    onUpdateDestinations(updated);
    setEditingId(null);
    onShowSuccess('اطلاعات کشور مقصد با موفقیت ذخیره شد.');
  };

  const handleDelete = (id: string) => {
    if ((config.destinations || []).length <= 1) {
      alert('حداقل یک مقصد باید در وب‌سایت فعال باشد.');
      return;
    }
    const updated = (config.destinations || []).filter((d) => d.id !== id);
    onUpdateDestinations(updated);
    onShowSuccess('مقصد مورد نظر از سایت حذف گردید.');
  };

  const handleAdd = () => {
    if (!newDest.name || !newDest.nameFarsi) return;
    const newId = `dest-${Date.now()}`;
    const destinationToAdd: Destination = {
      id: newId,
      name: newDest.name || 'New Destination',
      nameFarsi: newDest.nameFarsi || 'مقصد جدید',
      tagline: newDest.tagline || 'Strategic Migration Hub',
      taglineFarsi: newDest.taglineFarsi || 'اقامت راهبردی بین‌المللی',
      overview: newDest.overview || '',
      overviewFarsi: newDest.overviewFarsi || '',
      processingTime: newDest.processingTime || '6 Months',
      processingTimeFarsi: newDest.processingTimeFarsi || '۶ ماه',
      costBracket: newDest.costBracket || 'From $150,000',
      costBracketFarsi: newDest.costBracketFarsi || 'از ۱۵۰ هزار دلار',
      image: newDest.image || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
      categories: newDest.categories || ['residency'],
      highlights: newDest.highlights || ['Premium lifestyle', 'Fast-track'],
      highlightsFarsi: newDest.highlightsFarsi || ['سطح زندگی ممتاز', 'رسیدگی اولویت‌دار'],
      lifestyleRank: 'Tier 1',
      lifestyleRankFarsi: 'رتبه ممتاز بین‌المللی',
      capitalCity: 'Capital City',
      capitalCityFarsi: 'پایتخت',
      primaryPathways: [
        {
          name: 'Direct Residence Pathway',
          nameFarsi: 'مسیر اقامت مستقیم',
          description: 'Comprehensive route with family inclusion.',
          descriptionFarsi: 'پرونده جامع شامل سرپرست و اعضای تحت تکفل خانواده.',
          requirements: ['Proof of Funds', 'Clean Record'],
          requirementsFarsi: ['تمکن مالی معتبر', 'عدم سوء‌پیشینه'],
        },
      ],
    };

    onUpdateDestinations([...(config.destinations || []), destinationToAdd]);
    setShowAddModal(false);
    onShowSuccess(`کشور «${destinationToAdd.nameFarsi}» به بخش مقاصد مهاجرت اضافه شد.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#080909] border border-white/10">
        <div>
          <h3 className="text-base font-bold text-[#F4F0E8] flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#C9A96A]" />
            مدیریت مقاصد مهاجرت و کشورها (Destinations Section)
          </h3>
          <p className="text-xs text-[#9B9B95] mt-1 font-light">
            تعداد مقاصد فعال: {(config.destinations || []).length} کشور | می‌توانید عناوین، تصاویر، شعارها و زمان پردازش هر کشور را تغییر دهید.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] hover:from-[#E8CA8C] hover:to-[#DFBA73] text-[#080909] font-bold text-xs rounded-xl shadow-lg shadow-[#C9A96A]/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          افزودن کشور جدید
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(config.destinations || []).map((dest) => {
          const isEditing = editingId === dest.id;

          return (
            <div
              key={dest.id}
              className="rounded-xl bg-[#080909] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#C9A96A]/40 transition-all group"
            >
              <div className="relative h-40 w-full overflow-hidden bg-black">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080909] via-transparent to-black/60" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-[#E8CA8C] border border-[#C9A96A]/30">
                  {dest.processingTimeFarsi || dest.processingTime}
                </span>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                {isEditing ? (
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="text-[10px] text-[#9B9B95] block mb-1">نام فارسی کشور:</label>
                      <input
                        type="text"
                        defaultValue={dest.nameFarsi || dest.name}
                        id={`dest-name-fa-${dest.id}`}
                        className="w-full px-2 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#9B9B95] block mb-1">شعار و عنوان فرعی:</label>
                      <input
                        type="text"
                        defaultValue={dest.taglineFarsi || dest.tagline}
                        id={`dest-tag-fa-${dest.id}`}
                        className="w-full px-2 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#9B9B95] block mb-1">مدت زمان حدودی پردازش:</label>
                      <input
                        type="text"
                        defaultValue={dest.processingTimeFarsi || dest.processingTime}
                        id={`dest-time-fa-${dest.id}`}
                        className="w-full px-2 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#9B9B95] block mb-1">لینک تصویر کشور:</label>
                      <input
                        type="text"
                        defaultValue={dest.image}
                        id={`dest-img-${dest.id}`}
                        className="w-full px-2 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          const nameFarsi = (document.getElementById(`dest-name-fa-${dest.id}`) as HTMLInputElement)?.value;
                          const taglineFarsi = (document.getElementById(`dest-tag-fa-${dest.id}`) as HTMLInputElement)?.value;
                          const processingTimeFarsi = (document.getElementById(`dest-time-fa-${dest.id}`) as HTMLInputElement)?.value;
                          const image = (document.getElementById(`dest-img-${dest.id}`) as HTMLInputElement)?.value;
                          handleSaveEdit(dest.id, { nameFarsi, taglineFarsi, processingTimeFarsi, image });
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
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#F4F0E8]">
                        {dest.nameFarsi} ({dest.name})
                      </h4>
                    </div>
                    <p className="text-xs text-[#9B9B95] line-clamp-2 mt-1 leading-relaxed">
                      {dest.taglineFarsi || dest.tagline}
                    </p>
                    <div className="mt-2 text-[11px] text-[#DFBA73] font-mono">
                      {dest.costBracketFarsi || dest.costBracket}
                    </div>
                  </div>
                )}

                {!isEditing && (
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                    <button
                      onClick={() => setEditingId(dest.id)}
                      className="text-[#DFBA73] hover:text-[#F4F0E8] flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(dest.id)}
                      disabled={(config.destinations || []).length <= 1}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      حذف
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Destination Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#111313] border border-[#C9A96A]/60 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-[#F4F0E8] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A96A]" />
              افزودن کشور مقصد جدید به سایت
            </h4>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#9B9B95] block mb-1">نام انگلیسی کشور:</label>
                  <input
                    type="text"
                    value={newDest.name}
                    onChange={(e) => setNewDest({ ...newDest, name: e.target.value })}
                    placeholder="مثال: Australia"
                    className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#9B9B95] block mb-1">نام فارسی کشور:</label>
                  <input
                    type="text"
                    value={newDest.nameFarsi}
                    onChange={(e) => setNewDest({ ...newDest, nameFarsi: e.target.value })}
                    placeholder="مثال: استرالیا"
                    className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#9B9B95] block mb-1">شعار و تگ‌لاین (فارسی):</label>
                <input
                  type="text"
                  value={newDest.taglineFarsi}
                  onChange={(e) => setNewDest({ ...newDest, taglineFarsi: e.target.value })}
                  placeholder="مثال: قطب نوآوری و زندگی باکیفیت اقیانوسیه"
                  className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#9B9B95] block mb-1">مدت زمان حدودی پردازش:</label>
                  <input
                    type="text"
                    value={newDest.processingTimeFarsi}
                    onChange={(e) => setNewDest({ ...newDest, processingTimeFarsi: e.target.value })}
                    placeholder="مثال: ۶ الی ۱۲ ماه"
                    className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#9B9B95] block mb-1">کف سرمایه / هزینه ویزا:</label>
                  <input
                    type="text"
                    value={newDest.costBracketFarsi}
                    onChange={(e) => setNewDest({ ...newDest, costBracketFarsi: e.target.value })}
                    placeholder="مثال: از ۱۰۰ هزار دلار"
                    className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#9B9B95] block mb-1">آدرس عکس باکیفیت کشور:</label>
                <input
                  type="text"
                  value={newDest.image}
                  onChange={(e) => setNewDest({ ...newDest, image: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={handleAdd}
                className="flex-1 py-2.5 bg-[#C9A96A] hover:bg-[#DFBA73] text-[#080909] font-bold text-xs rounded-xl cursor-pointer"
              >
                تأیید و افزودن کشور به سایت
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
