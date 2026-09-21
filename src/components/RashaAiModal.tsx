import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, ShieldAlert, Bot, User, ArrowUpRight, MessageSquare, Loader2 } from 'lucide-react';
import { Language, ChatMessage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface RashaAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onOpenConsultation: (details?: { destination?: string; message?: string }) => void;
}

export const RashaAiModal: React.FC<RashaAiModalProps> = ({
  isOpen,
  onClose,
  language,
  onOpenConsultation,
}) => {
  const t = TRANSLATIONS[language];

  const initialSuggestions = language === 'fa' ? [
    'کدام کشور برای شرایط و مدرک تحصیلی من بهترین شانس را دارد؟',
    'آیا با تخصص کاری یا برنامه‌نویسی می‌توانم اقامت دائم کانادا یا آلمان بگیرم؟',
    'شرایط ویزای تحصیلی و تبدیل آن به اقامت کاری چگونه است؟',
    'کدام کشورها ویزای طلایی (Golden Visa) یا اقامت تمکن مالی دارند؟',
    'چگونه همسر و فرزندانم را همراه خود به عنوان همراه ببرم؟',
    'مدارک لازم و امتیاز اکسپرس اینتری یا کارت شانس چیست؟',
    'چگونه وقت مشاوره حضوری یا آنلاین با وکلای راشا رزرو کنم؟',
  ] : [
    'Which country is best for my profile?',
    'Can I immigrate through skilled work or tech?',
    'What are my study and post-study PR options?',
    'Which countries offer Golden Visa or residency by investment?',
    'How can I bring my spouse and family?',
    'What documents and CRS points do I need for Canada?',
    'How do I book a private consultation?',
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: t.rashaAiGreeting,
      timestamp: 'Just now',
      suggestions: initialSuggestions,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Update initial greeting if language changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'init-1') {
        return [
          {
            id: 'init-1',
            role: 'assistant',
            content: t.rashaAiGreeting,
            timestamp: 'Just now',
            suggestions: initialSuggestions,
          },
        ];
      }
      return prev;
    });
  }, [language, t.rashaAiGreeting]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: 'Just now',
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.message || "I apologize, but I encountered an issue. Let's explore your destination goals or arrange a private consultant strategy call.",
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `fallback-${Date.now()}`,
        role: 'assistant',
        content: "I am temporarily operating in offline briefing mode. For full profile analysis and official assessment, please connect directly with our senior consulting desk.",
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="rasha-ai-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#080909]/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg h-[84vh] sm:h-[72vh] md:h-[550px] flex flex-col bg-[#111313] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Luxury Header */}
        <div className="p-3.5 sm:p-4 border-b border-white/[0.08] bg-[#080909]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#181a1a] border border-[#C9A96A]/40 flex items-center justify-center text-[#C9A96A]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-[#111313]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-serif-display font-medium text-[#F4F0E8]">
                  {t.rashaAiTitle}
                </h3>
                <span className="text-[9px] uppercase tracking-wider text-[#C9A96A] bg-[#C9A96A]/10 px-1.5 py-0.5 rounded border border-[#C9A96A]/20">
                  AI
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#9B9B95] font-sans-luxury">
                {t.rashaAiSub}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                onClose();
                onOpenConsultation();
              }}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[10px] font-sans-luxury uppercase tracking-wider text-[#C9A96A] hover:text-[#F4F0E8] border border-[#C9A96A]/30 hover:border-[#C9A96A] rounded-full transition-colors"
            >
              <span>مشاور</span>
              <ArrowUpRight className="w-2.5 h-2.5" />
            </button>

            <button
              id="close-ai-modal"
              onClick={onClose}
              className="p-1.5 text-[#9B9B95] hover:text-[#F4F0E8] rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer"
              aria-label="Close AI modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 no-scrollbar bg-gradient-to-b from-[#111313] to-[#0d0e0e]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-start gap-2 max-w-[90%] sm:max-w-[85%]">
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-[#181a1a] border border-[#C9A96A]/30 flex items-center justify-center text-[#C9A96A] flex-shrink-0 mt-0.5">
                    <Bot className="w-3 h-3" />
                  </div>
                )}

                <div
                  className={`p-2.5 sm:p-3 rounded-xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#C9A96A] text-[#080909] font-medium rounded-br-xs'
                      : 'bg-[#181a1a] text-[#F4F0E8] border border-white/[0.08] rounded-bl-xs font-sans-luxury'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>

              {/* Suggested Questions Chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-2 px-1 sm:px-6 flex flex-wrap gap-1 max-w-xl">
                  {msg.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(sug)}
                      className="text-right rtl:text-right text-[10px] px-2.5 py-1 rounded-full bg-[#080909] text-[#9B9B95] hover:text-[#F4F0E8] border border-white/[0.08] hover:border-[#C9A96A]/50 transition-colors cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 px-1 sm:px-6 text-[11px] text-[#9B9B95]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C9A96A]" />
              <span>درحال بررسی پایگاه دانش مهاجرتی...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Legal Disclaimer Ribbon */}
        <div className="px-3.5 py-1.5 bg-[#080909] border-t border-white/[0.04] flex items-center gap-1.5 text-[9px] text-[#9B9B95]/70">
          <ShieldAlert className="w-3 h-3 text-[#C9A96A] flex-shrink-0" />
          <span className="truncate">{t.rashaAiDisclaimer}</span>
        </div>

        {/* Input Bar */}
        <div className="p-2.5 sm:p-3 bg-[#080909] border-t border-white/[0.08]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.chatPlaceholder}
              className="flex-1 px-3.5 py-2 bg-[#111313] border border-white/10 rounded-xl text-xs text-[#F4F0E8] placeholder-[#9B9B95]/50 focus:outline-none focus:border-[#C9A96A] transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-3.5 py-2 bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] hover:from-[#E8CA8C] hover:to-[#C9A96A] disabled:opacity-30 text-[#080909] font-bold rounded-xl transition-all shadow flex items-center justify-center cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
