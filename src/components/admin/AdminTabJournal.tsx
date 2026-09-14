import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit2, Check, ExternalLink } from 'lucide-react';
import { JournalArticle, SiteConfig } from '../../types';

interface AdminTabJournalProps {
  config: SiteConfig;
  onUpdateArticles: (articles: JournalArticle[]) => void;
  onShowSuccess: (msg: string) => void;
}

export const AdminTabJournal: React.FC<AdminTabJournalProps> = ({
  config,
  onUpdateArticles,
  onShowSuccess,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newArticle, setNewArticle] = useState<Partial<JournalArticle>>({
    title: 'New Global Migration Analysis',
    titleFarsi: 'تحلیل راهبردی جدید اقامت و مهاجرت',
    category: 'Global Policy',
    categoryFarsi: 'سیاست بین‌الملل',
    readTime: '6 min read',
    readTimeFarsi: '۶ دقیقه مطالعه',
    excerpt: 'Key insights and strategic considerations for high-net-worth applicants.',
    excerptFarsi: 'بررسی جامع آخرین تغییرات قوانین مهاجرتی و راهکارهای مطمئن جهت مدیریت ریسک پرونده.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    date: 'مارس ۲۰۲۵',
  });

  const handleSaveEdit = (id: string, fields: Partial<JournalArticle>) => {
    const updated = (config.journalArticles || []).map((a) =>
      a.id === id ? { ...a, ...fields } : a
    );
    onUpdateArticles(updated);
    setEditingId(null);
    onShowSuccess('مقاله با موفقیت ویرایش شد.');
  };

  const handleDelete = (id: string) => {
    if ((config.journalArticles || []).length <= 1) {
      alert('حداقل یک مقاله باید در ژورنال سایت موجود باشد.');
      return;
    }
    const updated = (config.journalArticles || []).filter((a) => a.id !== id);
    onUpdateArticles(updated);
    onShowSuccess('مقاله از ژورنال حذف شد.');
  };

  const handleAdd = () => {
    if (!newArticle.titleFarsi) return;
    const newId = `art-${Date.now()}`;
    const articleToAdd: JournalArticle = {
      id: newId,
      title: newArticle.title || 'New Advisory Analysis',
      titleFarsi: newArticle.titleFarsi || 'تحلیل جدید ژورنال',
      slug: `article-${Date.now()}`,
      category: newArticle.category || 'Global Policy',
      categoryFarsi: newArticle.categoryFarsi || 'سیاست بین‌الملل',
      date: newArticle.date || 'مارس ۲۰۲۵',
      readTime: newArticle.readTime || '5 min read',
      readTimeFarsi: newArticle.readTimeFarsi || '۵ دقیقه',
      excerpt: newArticle.excerpt || '',
      excerptFarsi: newArticle.excerptFarsi || '',
      image: newArticle.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: 'RASHA Editorial Desk',
        role: 'Immigration Advisory',
        roleFarsi: 'دپارتمان تحلیلی و حقوقی راشا',
      },
      content: [newArticle.excerpt || 'Global statutory analysis.'],
      contentFarsi: [newArticle.excerptFarsi || 'تحلیل جامع حقوقی و راهبردی.'],
      keyTakeaways: ['Legal compliance', 'Strategic pathway'],
      keyTakeawaysFarsi: ['انطباق کامل با قوانین روز', 'انتخاب مسیر مطمئن'],
    };

    onUpdateArticles([articleToAdd, ...(config.journalArticles || [])]);
    setShowAddModal(false);
    onShowSuccess(`مقاله «${articleToAdd.titleFarsi}» به ژورنال اضافه شد.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#080909] border border-white/10">
        <div>
          <h3 className="text-base font-bold text-[#F4F0E8] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#C9A96A]" />
            مدیریت مقالات و تحلیل‌های ژورنال راشا (Journal Section)
          </h3>
          <p className="text-xs text-[#9B9B95] mt-1 font-light">
            تعداد مقالات فعال: {(config.journalArticles || []).length} مقاله | می‌توانید عناوین، دسته‌بندی و عکس مقالات را تغییر دهید.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] hover:from-[#E8CA8C] hover:to-[#DFBA73] text-[#080909] font-bold text-xs rounded-xl shadow-lg shadow-[#C9A96A]/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          افزودن مقاله جدید
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(config.journalArticles || []).map((article) => {
          const isEditing = editingId === article.id;

          return (
            <div
              key={article.id}
              className="rounded-xl bg-[#080909] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#C9A96A]/40 transition-all"
            >
              <div className="relative h-36 w-full overflow-hidden bg-black">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080909] via-transparent to-black/60" />
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-[#080909]/80 text-[10px] text-[#DFBA73] border border-[#C9A96A]/30">
                  {article.categoryFarsi || article.category}
                </span>
                <span className="absolute bottom-2 left-2 text-[10px] text-white/80 font-mono">
                  {article.readTimeFarsi || article.readTime}
                </span>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                {isEditing ? (
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="text-[10px] text-[#9B9B95] block mb-1">عنوان مقاله:</label>
                      <input
                        type="text"
                        defaultValue={article.titleFarsi || article.title}
                        id={`art-title-${article.id}`}
                        className="w-full px-2 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#9B9B95] block mb-1">دسته‌بندی (فارسی):</label>
                      <input
                        type="text"
                        defaultValue={article.categoryFarsi || article.category}
                        id={`art-cat-${article.id}`}
                        className="w-full px-2 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#9B9B95] block mb-1">خلاصه متن مقاله:</label>
                      <textarea
                        defaultValue={article.excerptFarsi || article.excerpt}
                        id={`art-exc-${article.id}`}
                        rows={2}
                        className="w-full px-2 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#9B9B95] block mb-1">آدرس عکس مقاله:</label>
                      <input
                        type="text"
                        defaultValue={article.image}
                        id={`art-img-${article.id}`}
                        className="w-full px-2 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          const titleFarsi = (document.getElementById(`art-title-${article.id}`) as HTMLInputElement)?.value;
                          const categoryFarsi = (document.getElementById(`art-cat-${article.id}`) as HTMLInputElement)?.value;
                          const excerptFarsi = (document.getElementById(`art-exc-${article.id}`) as HTMLTextAreaElement)?.value;
                          const image = (document.getElementById(`art-img-${article.id}`) as HTMLInputElement)?.value;
                          handleSaveEdit(article.id, { titleFarsi, categoryFarsi, excerptFarsi, image });
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
                    <h4 className="text-sm font-bold text-[#F4F0E8] line-clamp-2">
                      {article.titleFarsi || article.title}
                    </h4>
                    <p className="text-xs text-[#9B9B95] mt-1.5 line-clamp-2 leading-relaxed">
                      {article.excerptFarsi || article.excerpt}
                    </p>
                  </div>
                )}

                {!isEditing && (
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                    <button
                      onClick={() => setEditingId(article.id)}
                      className="text-[#DFBA73] hover:text-[#F4F0E8] flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      disabled={(config.journalArticles || []).length <= 1}
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#111313] border border-[#C9A96A]/60 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-[#F4F0E8] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#C9A96A]" />
              افزودن مقاله جدید به ژورنال
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-[#9B9B95] block mb-1">عنوان مقاله (فارسی):</label>
                <input
                  type="text"
                  value={newArticle.titleFarsi}
                  onChange={(e) => setNewArticle({ ...newArticle, titleFarsi: e.target.value })}
                  placeholder="مثال: فرصت‌های طلایی ویزای استارتاپ کانادا در ۲۰۲۵"
                  className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9B9B95] block mb-1">دسته‌بندی موضوعی:</label>
                <input
                  type="text"
                  value={newArticle.categoryFarsi}
                  onChange={(e) => setNewArticle({ ...newArticle, categoryFarsi: e.target.value })}
                  placeholder="مثال: سرمایه‌گذاری و استارتاپ"
                  className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9B9B95] block mb-1">خلاصه متن مقاله:</label>
                <textarea
                  value={newArticle.excerptFarsi}
                  onChange={(e) => setNewArticle({ ...newArticle, excerptFarsi: e.target.value })}
                  rows={3}
                  placeholder="توضیح دو الی سه خطی جذاب از محتوای مقاله..."
                  className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9B9B95] block mb-1">آدرس عکس باکیفیت:</label>
                <input
                  type="text"
                  value={newArticle.image}
                  onChange={(e) => setNewArticle({ ...newArticle, image: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080909] border border-white/15 rounded-lg text-white focus:border-[#C9A96A] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={handleAdd}
                className="flex-1 py-2.5 bg-[#C9A96A] hover:bg-[#DFBA73] text-[#080909] font-bold text-xs rounded-xl cursor-pointer"
              >
                انتشار مقاله در سایت
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
