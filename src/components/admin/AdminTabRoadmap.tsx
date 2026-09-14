import React, { useState } from 'react';
import { Compass, Check, Edit2, Shield, Sparkles } from 'lucide-react';
import { WhyRashaPrinciple, ProcessStep, SiteConfig } from '../../types';

interface AdminTabRoadmapProps {
  config: SiteConfig;
  onUpdatePrinciples: (principles: WhyRashaPrinciple[]) => void;
  onUpdateProcessSteps: (steps: ProcessStep[]) => void;
  onShowSuccess: (msg: string) => void;
}

export const AdminTabRoadmap: React.FC<AdminTabRoadmapProps> = ({
  config,
  onUpdatePrinciples,
  onUpdateProcessSteps,
  onShowSuccess,
}) => {
  const [subTab, setSubTab] = useState<'principles' | 'steps'>('principles');
  const [editingPrincipleNumber, setEditingPrincipleNumber] = useState<string | null>(null);
  const [editingStepNumber, setEditingStepNumber] = useState<string | null>(null);

  const handleSavePrinciple = (number: string, fields: Partial<WhyRashaPrinciple>) => {
    const updated = (config.whyRashaPrinciples || []).map((p) =>
      p.number === number ? { ...p, ...fields } : p
    );
    onUpdatePrinciples(updated);
    setEditingPrincipleNumber(null);
    onShowSuccess('اصل بنیادین راشا با موفقیت بروزرسانی شد.');
  };

  const handleSaveStep = (stepNumber: string, fields: Partial<ProcessStep>) => {
    const updated = (config.processSteps || []).map((s) =>
      s.step === stepNumber ? { ...s, ...fields } : s
    );
    onUpdateProcessSteps(updated);
    setEditingStepNumber(null);
    onShowSuccess('مرحله نقشه راه مهاجرت بروزرسانی گردید.');
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs selector */}
      <div className="flex gap-3 p-1.5 rounded-xl bg-[#080909] border border-white/10 w-fit">
        <button
          onClick={() => setSubTab('principles')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            subTab === 'principles'
              ? 'bg-[#C9A96A] text-[#080909]'
              : 'text-[#9B9B95] hover:text-white'
          }`}
        >
          ۴ اصل بنیادین راشا (Why Rasha Philosophy)
        </button>
        <button
          onClick={() => setSubTab('steps')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            subTab === 'steps'
              ? 'bg-[#C9A96A] text-[#080909]'
              : 'text-[#9B9B95] hover:text-white'
          }`}
        >
          ۶ مرحله نقشه راه اجرایی (6-Stage Roadmap)
        </button>
      </div>

      {subTab === 'principles' ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#080909] border border-white/10">
            <h3 className="text-sm font-bold text-[#F4F0E8] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#C9A96A]" />
              اصول ۴ گانه فلسفه راشا مهاجرت
            </h3>
            <p className="text-xs text-[#9B9B95] mt-1">
              متن‌ها، شعارها و تصاویر ۴ اصل اساسی بخش "فراتر از مهاجرت" را می‌توانید در این قسمت ویرایش کنید.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {(config.whyRashaPrinciples || []).map((p) => {
              const isEditing = editingPrincipleNumber === p.number;

              return (
                <div
                  key={p.number}
                  className="p-5 rounded-xl bg-[#080909] border border-white/10 flex flex-col justify-between hover:border-[#C9A96A]/40 transition-all"
                >
                  {isEditing ? (
                    <div className="space-y-2.5 text-xs">
                      <div className="font-mono text-[#DFBA73] font-bold">اصل شماره {p.number}</div>
                      <div>
                        <label className="text-[10px] text-[#9B9B95] block mb-1">عنوان فارسی اصل:</label>
                        <input
                          type="text"
                          defaultValue={p.titleFarsi || p.title}
                          id={`p-title-${p.number}`}
                          className="w-full px-2.5 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-[#9B9B95] block mb-1">عنوان فرعی (شعار):</label>
                        <input
                          type="text"
                          defaultValue={p.subtitleFarsi || p.subtitle}
                          id={`p-sub-${p.number}`}
                          className="w-full px-2.5 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-[#9B9B95] block mb-1">متن توضیحات:</label>
                        <textarea
                          defaultValue={p.descriptionFarsi || p.description}
                          id={`p-desc-${p.number}`}
                          rows={3}
                          className="w-full px-2.5 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none resize-none leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-[#9B9B95] block mb-1">آدرس عکس اصل:</label>
                        <input
                          type="text"
                          defaultValue={p.image}
                          id={`p-img-${p.number}`}
                          className="w-full px-2.5 py-1.5 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => {
                            const titleFarsi = (document.getElementById(`p-title-${p.number}`) as HTMLInputElement)?.value;
                            const subtitleFarsi = (document.getElementById(`p-sub-${p.number}`) as HTMLInputElement)?.value;
                            const descriptionFarsi = (document.getElementById(`p-desc-${p.number}`) as HTMLTextAreaElement)?.value;
                            const image = (document.getElementById(`p-img-${p.number}`) as HTMLInputElement)?.value;
                            handleSavePrinciple(p.number, { titleFarsi, subtitleFarsi, descriptionFarsi, image });
                          }}
                          className="flex-1 py-1.5 bg-[#C9A96A] text-[#080909] font-bold rounded flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          ذخیره اصل
                        </button>
                        <button
                          onClick={() => setEditingPrincipleNumber(null)}
                          className="px-3 py-1.5 bg-white/10 text-white rounded cursor-pointer"
                        >
                          انصراف
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-[#E8CA8C] px-2 py-0.5 rounded bg-[#C9A96A]/10 border border-[#C9A96A]/30">
                          {p.number}
                        </span>
                        <span className="text-[11px] text-[#9B9B95]">{p.subtitleFarsi || p.subtitle}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#F4F0E8]">{p.titleFarsi || p.title}</h4>
                      <p className="text-xs text-[#9B9B95] mt-2 leading-relaxed">
                        {p.descriptionFarsi || p.description}
                      </p>
                    </div>
                  )}

                  {!isEditing && (
                    <div className="pt-3 mt-3 border-t border-white/10">
                      <button
                        onClick={() => setEditingPrincipleNumber(p.number)}
                        className="flex items-center gap-1 text-xs text-[#DFBA73] hover:text-[#F4F0E8] transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        ویرایش این اصل
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#080909] border border-white/10">
            <h3 className="text-sm font-bold text-[#F4F0E8] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C9A96A]" />
              مراحل ۶ گانه نقشه راه مهاجرت (Process Steps)
            </h3>
            <p className="text-xs text-[#9B9B95] mt-1">
              مراحل زمانی، مدت حدودی و اقدامات هر مرحله را می‌توانید تنظیم و شخصی‌سازی کنید.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(config.processSteps || []).map((step) => {
              const isEditing = editingStepNumber === step.step;

              return (
                <div
                  key={step.step}
                  className="p-4 rounded-xl bg-[#080909] border border-white/10 flex flex-col justify-between hover:border-[#C9A96A]/40 transition-all"
                >
                  {isEditing ? (
                    <div className="space-y-2 text-xs">
                      <div className="font-mono text-[#DFBA73] font-bold">گام {step.step}</div>
                      <div>
                        <label className="text-[10px] text-[#9B9B95] block mb-1">عنوان مرحله:</label>
                        <input
                          type="text"
                          defaultValue={step.titleFarsi || step.title}
                          id={`step-title-${step.step}`}
                          className="w-full px-2 py-1 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#9B9B95] block mb-1">مدت زمان:</label>
                        <input
                          type="text"
                          defaultValue={step.durationFarsi || step.duration}
                          id={`step-dur-${step.step}`}
                          className="w-full px-2 py-1 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#9B9B95] block mb-1">شرح مرحله:</label>
                        <textarea
                          defaultValue={step.descriptionFarsi || step.description}
                          id={`step-desc-${step.step}`}
                          rows={2}
                          className="w-full px-2 py-1 bg-[#111313] border border-white/20 rounded text-xs text-white focus:border-[#C9A96A] focus:outline-none resize-none"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => {
                            const titleFarsi = (document.getElementById(`step-title-${step.step}`) as HTMLInputElement)?.value;
                            const durationFarsi = (document.getElementById(`step-dur-${step.step}`) as HTMLInputElement)?.value;
                            const descriptionFarsi = (document.getElementById(`step-desc-${step.step}`) as HTMLTextAreaElement)?.value;
                            handleSaveStep(step.step, { titleFarsi, durationFarsi, descriptionFarsi });
                          }}
                          className="flex-1 py-1 bg-[#C9A96A] text-[#080909] font-bold rounded flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          ذخیره
                        </button>
                        <button
                          onClick={() => setEditingStepNumber(null)}
                          className="px-2.5 py-1 bg-white/10 text-white rounded cursor-pointer"
                        >
                          انصراف
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="w-6 h-6 rounded-full bg-[#C9A96A]/20 text-[#DFBA73] font-mono text-xs flex items-center justify-center font-bold">
                          {step.step}
                        </span>
                        <span className="text-[10px] text-[#9B9B95] font-mono">{step.durationFarsi || step.duration}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#F4F0E8]">{step.titleFarsi || step.title}</h4>
                      <p className="text-xs text-[#9B9B95] mt-1.5 line-clamp-3 leading-relaxed">
                        {step.descriptionFarsi || step.description}
                      </p>
                    </div>
                  )}

                  {!isEditing && (
                    <div className="pt-2 mt-3 border-t border-white/10">
                      <button
                        onClick={() => setEditingStepNumber(step.step)}
                        className="text-xs text-[#DFBA73] hover:text-[#F4F0E8] flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        ویرایش
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
