import React, { useState } from 'react';
import { Users, Search, MessageSquare, Phone, Trash2, Eye, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';
import { LeadApplication } from '../../types';
import { deleteLead, getLeads, updateLeadStatus } from '../../data/siteConfig';

interface AdminTabLeadsProps {
  onShowSuccess: (msg: string) => void;
}

export const AdminTabLeads: React.FC<AdminTabLeadsProps> = ({ onShowSuccess }) => {
  const [leads, setLeads] = useState<LeadApplication[]>(getLeads());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'reviewing' | 'closed'>('all');
  const [selectedLead, setSelectedLead] = useState<LeadApplication | null>(null);

  const handleStatusChange = (id: string, status: LeadApplication['status']) => {
    updateLeadStatus(id, status);
    setLeads(getLeads());
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status });
    }
    onShowSuccess('وضعیت پرونده متقاضی بروزرسانی شد.');
  };

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این پرونده از سامانه اطمینان دارید؟')) {
      deleteLead(id);
      setLeads(getLeads());
      if (selectedLead?.id === id) setSelectedLead(null);
      onShowSuccess('پرونده با موفقیت حذف گردید.');
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      lead.fullName.toLowerCase().includes(q) ||
      lead.phone.includes(q) ||
      lead.trackingCode.toLowerCase().includes(q) ||
      lead.targetDestination.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header with Search and Filter */}
      <div className="p-4 rounded-xl bg-[#080909] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#F4F0E8] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#C9A96A]" />
            صندوق ورودی متقاضیان و درخواست‌های مشاوره ({leads.length} پرونده)
          </h3>
          <p className="text-xs text-[#9B9B95] mt-1 font-light">
            شامل متقاضیان فرم ارزیابی هوشمند، تماس فوری و فرم مشاوره اختصاصی
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9B95]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی نام، تلفن یا کد..."
              className="pr-8 pl-3 py-1.5 bg-[#111313] border border-white/15 rounded-lg text-xs text-white focus:border-[#C9A96A] focus:outline-none w-48"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-[#111313] border border-white/15 rounded-lg text-xs text-white focus:border-[#C9A96A] focus:outline-none"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="new">جدید (بررسی‌نشده)</option>
            <option value="reviewing">در حال بررسی حقوقی</option>
            <option value="contacted">تماس گرفته شده</option>
            <option value="closed">بسته‌شده / تکمیل</option>
          </select>
        </div>
      </div>

      {/* Leads Table / Cards */}
      {filteredLeads.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#080909] border border-white/10 text-xs text-[#9B9B95]">
          پرونده‌ای با این مشخصات یافت نشد.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="p-4 rounded-xl bg-[#080909] border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                    lead.status === 'new'
                      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                      : lead.status === 'reviewing'
                      ? 'bg-amber-400'
                      : lead.status === 'contacted'
                      ? 'bg-sky-400'
                      : 'bg-zinc-600'
                  }`}
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-[#F4F0E8]">{lead.fullName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#DFBA73] border border-white/10">
                      {lead.trackingCode}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#C9A96A]/15 text-[#E8CA8C]">
                      {lead.targetDestination}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#9B9B95] flex-wrap">
                    <span className="flex items-center gap-1 font-mono text-[#D1D1C7]">
                      <Phone className="w-3 h-3 text-[#C9A96A]" />
                      {lead.phone}
                    </span>
                    <span>هدف: {lead.migrationGoal || 'عمومی'}</span>
                    <span className="text-[10px] text-[#7A7A72]">
                      {new Date(lead.createdAt).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                  className="px-2.5 py-1.5 bg-[#111313] border border-white/20 rounded-lg text-xs text-[#E8CA8C] focus:outline-none"
                >
                  <option value="new">جدید</option>
                  <option value="reviewing">در حال بررسی</option>
                  <option value="contacted">تماس گرفته شده</option>
                  <option value="closed">بسته شده</option>
                </select>

                {/* Direct WhatsApp Link */}
                <a
                  href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-400 transition-colors"
                  title="ارسال پیام مستقیم به واتس‌اپ متقاضی"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setSelectedLead(lead)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors cursor-pointer"
                  title="مشاهده پرونده کامل"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(lead.id)}
                  className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900 border border-rose-500/30 text-rose-400 transition-colors cursor-pointer"
                  title="حذف پرونده"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dossier Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#111313] border border-[#C9A96A]/60 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="text-base font-bold text-[#F4F0E8]">{selectedLead.fullName}</h4>
                <span className="text-xs font-mono text-[#DFBA73]">{selectedLead.trackingCode}</span>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="px-3 py-1 bg-white/10 text-white text-xs rounded-lg cursor-pointer"
              >
                بستن
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#080909] border border-white/10">
                <div>
                  <span className="text-[#9B9B95] block mb-0.5">شماره تماس:</span>
                  <span className="font-mono text-white text-sm">{selectedLead.phone}</span>
                </div>
                <div>
                  <span className="text-[#9B9B95] block mb-0.5">ایمیل:</span>
                  <span className="text-white">{selectedLead.email || 'ثبت نشده'}</span>
                </div>
                <div>
                  <span className="text-[#9B9B95] block mb-0.5">مقصد مورد نظر:</span>
                  <span className="text-[#DFBA73] font-bold">{selectedLead.targetDestination}</span>
                </div>
                <div>
                  <span className="text-[#9B9B95] block mb-0.5">کشور فعلی:</span>
                  <span className="text-white">{selectedLead.currentCountry}</span>
                </div>
              </div>

              {selectedLead.assessmentAnswers && (
                <div className="p-3 rounded-xl bg-[#080909] border border-white/10 space-y-1.5">
                  <span className="text-[#DFBA73] font-bold block mb-1">پاسخ‌های ارزیابی آنلاین:</span>
                  {Object.entries(selectedLead.assessmentAnswers).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-white/5 py-1 text-[11px]">
                      <span className="text-[#9B9B95]">{k}:</span>
                      <span className="text-white font-medium">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}

              {selectedLead.message && (
                <div className="p-3 rounded-xl bg-[#080909] border border-white/10">
                  <span className="text-[#9B9B95] block mb-1 font-bold">توضیحات یا پیام متقاضی:</span>
                  <p className="text-white leading-relaxed">{selectedLead.message}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                ارسال پیام در واتس‌اپ
              </a>
              <a
                href={`tel:${selectedLead.phone}`}
                className="px-4 py-2 bg-[#C9A96A] text-[#080909] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                تماس
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
