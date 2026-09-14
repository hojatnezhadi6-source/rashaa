import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { HeroFrameItem, SiteConfig } from '../../types';
import { CURATED_POSTER_PRESETS } from '../../data/siteConfig';

interface AdminTabBannersProps {
  config: SiteConfig;
  onUpdateFrames: (frames: HeroFrameItem[]) => void;
  onShowSuccess: (msg: string) => void;
}

export const AdminTabBanners: React.FC<AdminTabBannersProps> = ({
  config,
  onUpdateFrames,
  onShowSuccess,
}) => {
  const [editingFrameId, setEditingFrameId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFrame, setNewFrame] = useState<Partial<HeroFrameItem>>({
    title: 'New Sovereign Vision',
    titleFarsi: 'عنوان پوستر جدید',
    subtitle: 'Global mobility advisory',
    subtitleFarsi: 'توضیحات پوستر بنر جدید راشا مهاجرت',
    image: CURATED_POSTER_PRESETS[0].url,
    tag: '07 / NEW POSTER',
    tagFarsi: '۰۷ / پوستر جدید',
  });

  const handleSaveFrameEdit = (id: string, updatedFields: Partial<HeroFrameItem>) => {
    const updated = config.heroFrames.map((f) => (f.id === id ? { ...f, ...updatedFields } : f));
    onUpdateFrames(updated);
    setEditingFrameId(null);
    onShowSuccess('اطلاعات پوستر با موفقیت بروزرسانی شد.');
  };

  const handleDeleteFrame = (id: string) => {
    if (config.heroFrames.length <= 1) {
      alert('حداقل یک بنر باید در صفحه اول وجود داشته باشد.');
      return;
    }
    const updated = config.heroFrames.filter((f) => f.id !== id);
    onUpdateFrames(updated);
    onShowSuccess('پوستر از اسلایدر حذف شد.');
  };

  const handleAddFrame = () => {
    if (!newFrame.title || !newFrame.image) return;
    const newId = `frame-${Date.now()}`;
    const frameToAdd: HeroFrameItem = {
      id: newId,
      percent: config.heroFrames.length * 15,
      title: newFrame.title || 'Global Gateway',
      titleFarsi: newFrame.titleFarsi || 'دروازه جهانی جدید',
      subtitle: newFrame.subtitle || 'Executive Immigration Advisory',
      subtitleFarsi: newFrame.subtitleFarsi || 'مشاوره اختصاصی اقامت و مهاجرت',
      image: newFrame.image || CURATED_POSTER_PRESETS[0].url,
      tag: newFrame.tag || `0${config.heroFrames.length + 1} / GATEWAY`,
      tagFarsi: newFrame.tagFarsi || `۰${config.heroFrames.length + 1} / افق جدید`,
    };

    onUpdateFrames([...config.heroFrames, frameToAdd]);
    setShowAddModal(false);
    onShowSuccess('پوستر جدید به اسلایدر صفحه اصلی افزوده شد.');
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#080909] border border-white/10">
        <div>
          <h3 className="text-base font-bold text-[#F4F0E8] flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#C9A96A]" />
            مدیریت بنرها و پوسترهای صفحه اول (Hero Carousel)
          </h3>
          <p className="text-xs text-[#9B9B95] mt-1 font-light">
            تعداد پوسترهای فعال: {config.heroFrames.length} عدد | اسلایدر بصورت خودکار و سینماتیک بین تصاویر سوئیچ می‌شود.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] hover:from-[#E8CA8C] hover:to-[#DFBA73] text-[#080909] font-bold text-xs rounded-xl shadow-lg shadow-[#C9A96A]/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          افزودن پوستر جدید
        </button>
      </div>

      {/* Frames Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {config.heroFrames.map((frame, index) => {
          const isEditing = editingFrameId === frame.id;

          return (
            <div
              key={frame.id}
              className="rounded-xl bg-[#080909] border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-[#C9A96A]/40 transition-all"
            >
              {/* Image Preview & Tag */}
              <div className="relative h-40 w-full overflow-hidden bg-black">
                <img
                  src={frame.image}
                  alt={frame.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080909] via-transparent to-black/60" />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-[#080909]/80 backdrop-blur-md text-[10px] font-mono text-[#DFBA73] border border-[#C9A96A]/30">
                  {frame.tagFarsi || frame.tag}
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-[#9B9B95]">
                  اسلاید شماره {index + 1}
                </span>
              </div>

              {/* Content Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                {isEditing ? (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[10px] text-[#9B9B95] block mb-1">عنوان فارسی:</label>
                      <input
                        type="text"
                        defaultValue={frame.titleFarsi || frame.title}
                        id={`edit-title-fa-${frame.id}`}
                        className="w-full px-2.5 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#9B9B95] block mb-1">توضیح فارسی:</label>
                      <textarea
                        defaultValue={frame.subtitleFarsi || frame.subtitle}
                        id={`edit-sub-fa-${frame.id}`}
                        rows={2}
                        className="w-full px-2.5 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#9B9B95] block mb-1">لینک تصویر مستقیم:</label>
                      <input
                        type="text"
                        defaultValue={frame.image}
                        id={`edit-img-${frame.id}`}
                        className="w-full px-2.5 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-[#F4F0E8] focus:border-[#C9A96A] focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          const titleFarsi = (document.getElementById(`edit-title-fa-${frame.id}`) as HTMLInputElement)?.value;
                          const subtitleFarsi = (document.getElementById(`edit-sub-fa-${frame.id}`) as HTMLTextAreaElement)?.value;
                          const image = (document.getElementById(`edit-img-${frame.id}`) as HTMLInputElement)?.value;
                          handleSaveFrameEdit(frame.id, { titleFarsi, subtitleFarsi, image });
                        }}
                        className="flex-1 py-1.5 bg-[#C9A96A] text-[#080909] font-bold rounded flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        ذخیره
                      </button>
                      <button
                        onClick={() => setEditingFrameId(null)}
                        className="px-3 py-1.5 bg-white/10 text-white rounded cursor-pointer"
                      >
                        انصراف
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-sm font-bold text-[#F4F0E8] line-clamp-1">
                      {frame.titleFarsi || frame.title}
                    </h4>
                    <p className="text-xs text-[#9B9B95] line-clamp-2 mt-1 leading-relaxed">
                      {frame.subtitleFarsi || frame.subtitle}
                    </p>
                  </div>
                )}

                {/* Card Actions */}
                {!isEditing && (
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                    <button
                      onClick={() => setEditingFrameId(frame.id)}
                      className="flex items-center gap-1.5 text-[#DFBA73] hover:text-[#F4F0E8] transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDeleteFrame(frame.id)}
                      disabled={config.heroFrames.length <= 1}
                      className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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

      {/* Preset Posters Quick Selection Drawer */}
      <div className="p-4 rounded-xl bg-[#080909] border border-white/10 space-y-3">
        <span className="text-xs font-bold text-[#DFBA73] block">
          تصاویر پرسرعت و منتخب شهرهای جهان (جهت استفاده در بنرها):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
          {CURATED_POSTER_PRESETS.map((preset) => (
            <div
              key={preset.url}
              onClick={() => {
                navigator.clipboard.writeText(preset.url);
                onShowSuccess(`لینک تصویر «${preset.nameFarsi}» کپی شد! می‌توانید در کادر تصویر جای‌گذاری کنید.`);
              }}
              className="p-2 rounded-lg bg-[#111313] border border-white/10 hover:border-[#C9A96A] transition-all cursor-pointer group"
              title="کلیک برای کپی کردن آدرس تصویر"
            >
              <div className="h-14 rounded overflow-hidden mb-1.5">
                <img src={preset.url} alt={preset.nameFarsi} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[11px] text-[#D1D1C7] block truncate font-medium text-center">
                {preset.nameFarsi}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Frame Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#111313] border border-[#C9A96A]/60 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-[#F4F0E8] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A96A]" />
              افزودن پوستر بنر جدید به صفحه اصلی
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-[#9B9B95] block mb-1">عنوان فارسی پوستر:</label>
                <input
                  type="text"
                  value={newFrame.titleFarsi}
                  onChange={(e) => setNewFrame({ ...newFrame, titleFarsi: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9B9B95] block mb-1">توضیحات کوتاه بنر:</label>
                <textarea
                  value={newFrame.subtitleFarsi}
                  onChange={(e) => setNewFrame({ ...newFrame, subtitleFarsi: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9B9B95] block mb-1">تگ / شناسه پوستر (مثلاً ۰۷ / ونکوور کانادا):</label>
                <input
                  type="text"
                  value={newFrame.tagFarsi}
                  onChange={(e) => setNewFrame({ ...newFrame, tagFarsi: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9B9B95] block mb-1">آدرس عکس باکیفیت (URL):</label>
                <input
                  type="text"
                  value={newFrame.image}
                  onChange={(e) => setNewFrame({ ...newFrame, image: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={handleAddFrame}
                className="flex-1 py-2.5 bg-[#C9A96A] hover:bg-[#DFBA73] text-[#080909] font-bold text-xs rounded-xl cursor-pointer"
              >
                تأیید و افزودن به سایت
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
