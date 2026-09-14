import {
  SiteConfig,
  HeroFrameItem,
  LeadApplication,
  Destination,
  ServiceItem,
  WhyRashaPrinciple,
  ProcessStep,
  CaseStudy,
  JournalArticle,
} from '../types';
import {
  DESTINATIONS,
  SERVICES,
  WHY_RASHA_PRINCIPLES,
  PROCESS_STEPS,
  CASE_STUDIES,
  JOURNAL_ARTICLES,
} from './content';

export const DEFAULT_HERO_FRAMES: HeroFrameItem[] = [
  {
    id: 'frame-1',
    percent: 0,
    title: 'The Sovereign Vision',
    titleFarsi: 'چشم‌انداز آینده: رفاه، امنیت و آزادی جهانی',
    subtitle: 'Quiet luxury. Global mobility for you and your family.',
    subtitleFarsi: 'مشاوره اختصاصی حقوقی، اخذ اقامت دائم و ایجاد امنیت پایدار برای خانواده شما.',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=2400&q=85',
    tag: '01 / ARCHITECTURE',
    tagFarsi: '۰۱ / چشم‌انداز راهبردی',
  },
  {
    id: 'frame-2',
    percent: 20,
    title: 'Architectural Clarity',
    titleFarsi: 'دقت حقوقی و برنامه‌ریزی بی‌نقص',
    subtitle: 'Every milestone engineered with statutory legal precision.',
    subtitleFarsi: 'بررسی موشکافانه تک‌تک مدارک و اسناد با نظارت وکلای رسمی دادگستری بین‌الملل.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2400&q=85',
    tag: '02 / STRATEGY',
    tagFarsi: '۰۲ / استراتژی حقوقی',
  },
  {
    id: 'frame-3',
    percent: 40,
    title: 'Global Metropolises',
    titleFarsi: 'مسیرهای برتر به کانادا، انگلستان، استرالیا و آلمان',
    subtitle: 'Direct gateways to London, Toronto, Sydney, Zurich, Dubai.',
    subtitleFarsi: 'دروازه‌های رسمی اکسپرس اینتری، کارت شانس، ویزاهای تلنت و سرمایه‌گذاری.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2400&q=85',
    tag: '03 / DESTINATIONS',
    tagFarsi: '۰۳ / مقاصد جهان',
  },
  {
    id: 'frame-4',
    percent: 60,
    title: 'The Global Visionary',
    titleFarsi: 'شکوفایی مسیر شغلی، کارآفرینی و سرمایه',
    subtitle: 'Elevating careers, capital preservation, and family legacy.',
    subtitleFarsi: 'ارتقای تراز شغلی متخصصان، انتقال سرمایه امن و حفظ ارزش دارایی‌ها در اقتصادهای برتر.',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=2400&q=85',
    tag: '04 / EXPANSION',
    tagFarsi: '۰۴ / رشد و توسعه',
  },
  {
    id: 'frame-5',
    percent: 80,
    title: 'The Modern Skyline',
    titleFarsi: 'بالاترین کیفیت زندگی و استانداردهای جهانی',
    subtitle: 'Unrivaled quality of life, premier healthcare, and elite education.',
    subtitleFarsi: 'تحصیل فرزندان در برترین دانشگاه‌ها، رفاه عمومی و پاسپورت معتبر بین‌المللی.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=85',
    tag: '05 / SECURITY',
    tagFarsi: '۰۵ / آرامش و امنیت',
  },
  {
    id: 'frame-6',
    percent: 100,
    title: 'Your Future Unbounded',
    titleFarsi: 'اقامت دائم، ویزای نخبگان و تابعیت بدون مرز',
    subtitle: 'Permanent residency, global talent visas & sovereign citizenship.',
    subtitleFarsi: 'با راشا مهاجرت، آینده شما دیگر در هیچ مرزی متوقف نخواهد شد.',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=2400&q=85',
    tag: '06 / HORIZON',
    tagFarsi: '۰۶ / افق نامحدود',
  },
];

export const CURATED_POSTER_PRESETS = [
  {
    name: 'Toronto Skyline & Finance',
    nameFarsi: 'تورنتو — کانادا',
    url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=2000&q=85',
  },
  {
    name: 'London Westminster & Thames',
    nameFarsi: 'لندن — بریتانیا',
    url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2000&q=85',
  },
  {
    name: 'Sydney Opera & Harbour',
    nameFarsi: 'سیدنی — استرالیا',
    url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=2000&q=85',
  },
  {
    name: 'Dubai Marina & Skyscrapers',
    nameFarsi: 'دبی — امارات',
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=85',
  },
  {
    name: 'Berlin Modern Architecture',
    nameFarsi: 'برلین — آلمان',
    url: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=2000&q=85',
  },
  {
    name: 'Zurich Financial Center & Alps',
    nameFarsi: 'زوریخ — سوئیس',
    url: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=2000&q=85',
  },
  {
    name: 'Vancouver Coast & Mountains',
    nameFarsi: 'ونکوور — کانادا',
    url: 'https://images.unsplash.com/photo-1559511260-66a65e09b245?auto=format&fit=crop&w=2000&q=85',
  },
  {
    name: 'Madrid Gran Via & Culture',
    nameFarsi: 'مادرید — اسپانیا',
    url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=2000&q=85',
  },
  {
    name: 'Corporate Executive Boardroom',
    nameFarsi: 'مرکز وکلای بین‌المللی',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85',
  },
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  heroHeadline1En: 'Your Future',
  heroHeadline1Fa: 'آینده شما',
  heroHeadline2En: 'Has No Borders.',
  heroHeadline2Fa: 'فراتر از مرزهاست.',
  heroSubheadlineEn: 'Strategic immigration solutions and sovereign citizenship advisory for high-achieving professionals, entrepreneurs, and global families.',
  heroSubheadlineFa: 'مشاوره اختصاصی حقوقی برای اخذ اقامت دائم، ویزای کاری، تحصیلی و سرمایه‌گذاری در برترین کشورهای جهان با همراهی وکلای رسمی بین‌المللی.',
  badgeEn: 'RASHA MOHAJERAT — GLOBAL IMMIGRATION CONSULTANCY',
  badgeFa: 'راشا مهاجرت — همراه رسمی شما در مهاجرت و اقامت بین‌المللی',
  phoneIran: '+98 21 8899 0011',
  phoneDubai: '+971 4 398 7720',
  phoneLondon: '+44 20 7946 0912',
  whatsappNumber: '+971501234567',
  consultationEmail: 'advisory@rashamohajerat.com',
  heroFrames: DEFAULT_HERO_FRAMES,
  persianFontTheme: 'shabnam',
  destinations: DESTINATIONS,
  services: SERVICES,
  whyRashaPrinciples: WHY_RASHA_PRINCIPLES,
  processSteps: PROCESS_STEPS,
  caseStudies: CASE_STUDIES,
  journalArticles: JOURNAL_ARTICLES,
};

const SITE_CONFIG_STORAGE_KEY = 'rasha_site_config_v2';
const LEADS_STORAGE_KEY = 'rasha_leads_v2';

export function getSiteConfig(): SiteConfig {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONFIG;
  try {
    const stored = localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
    if (!stored) return DEFAULT_SITE_CONFIG;
    const parsed = JSON.parse(stored);
    return {
      ...DEFAULT_SITE_CONFIG,
      ...parsed,
      heroFrames: parsed.heroFrames?.length ? parsed.heroFrames : DEFAULT_HERO_FRAMES,
      destinations: parsed.destinations?.length ? parsed.destinations : DESTINATIONS,
      services: parsed.services?.length ? parsed.services : SERVICES,
      whyRashaPrinciples: parsed.whyRashaPrinciples?.length ? parsed.whyRashaPrinciples : WHY_RASHA_PRINCIPLES,
      processSteps: parsed.processSteps?.length ? parsed.processSteps : PROCESS_STEPS,
      caseStudies: parsed.caseStudies?.length ? parsed.caseStudies : CASE_STUDIES,
      journalArticles: parsed.journalArticles?.length ? parsed.journalArticles : JOURNAL_ARTICLES,
    };
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}

export function resetSiteConfigToDefaults(): SiteConfig {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SITE_CONFIG_STORAGE_KEY);
  }
  return DEFAULT_SITE_CONFIG;
}

export function saveSiteConfig(config: SiteConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save site config', err);
  }
}

export const INITIAL_SAMPLE_LEADS: LeadApplication[] = [
  {
    id: 'lead-1',
    fullName: 'دکتر آرش پیروزمنش',
    phone: '+98 912 345 6789',
    email: 'arash.pirouz@example.com',
    currentCountry: 'ایران (تهران)',
    age: '34',
    maritalStatus: 'متاهل (۱ فرزند)',
    education: 'دکتری تخصصی هوش مصنوعی',
    jobTitle: 'مدیر ارشد هوش مصنوعی و داده',
    experienceYears: '۸ سال سابقه کار تخصصی',
    languageLevel: 'آیلتس آکادمیک 8.0',
    targetDestination: 'Canada',
    migrationGoal: 'Work & Skilled Migration (Express Entry / PNP)',
    budget: '$50k – $100k USD',
    message: 'علاقه‌مند به دریافت دعوتنامه اکسپرس اینتری یا ویزای نخبگان کانادا/انگلیس با اولویت اقامت دائم خانوادگی.',
    source: 'assessment_form',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    trackingCode: 'RASHA-2025-9418',
    estimatedScore: 94,
  },
  {
    id: 'lead-2',
    fullName: 'سارا رادمهر',
    phone: '+971 50 882 1199',
    email: 'sara.radmehr@example.com',
    currentCountry: 'امارات (دبی)',
    age: '29',
    maritalStatus: 'مجرد',
    education: 'کارشناسی ارشد معماری و شهرسازی',
    jobTitle: 'طراح ارشد پروژه‌های تجاری',
    experienceYears: '۵ سال سابقه کار',
    languageLevel: 'مدرک آلمانی B2 + انگلیسی آیلتس 7.0',
    targetDestination: 'Germany',
    migrationGoal: 'Chancenkarte (کارت شانس آلمان) / بلوکارت',
    budget: '$25k – $50k USD',
    message: 'بررسی مدارک جهت اقدام برای کارت شانس آلمان و جستجوی کار در مونیخ یا برلین.',
    source: 'consultation_form',
    status: 'reviewing',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    trackingCode: 'RASHA-2025-8321',
    estimatedScore: 89,
  },
  {
    id: 'lead-3',
    fullName: 'مهندس کامران انصاری',
    phone: '+98 912 111 2233',
    email: 'k.ansari.holdings@example.com',
    currentCountry: 'ایران (اصفهان)',
    age: '46',
    maritalStatus: 'متاهل (۲ فرزند)',
    education: 'کارشناسی ارشد مدیریت کسب‌وکار (MBA)',
    jobTitle: 'مالک شرکت بازرگانی و تجهیزات پزشکی',
    experienceYears: '۱۸ سال سابقه مدیریت',
    languageLevel: 'مکالمه عمومی / بیزینس',
    targetDestination: 'Portugal',
    migrationGoal: 'Golden Visa / سرمایه‌گذاری صندوق‌های اروپایی',
    budget: '$500k+ USD',
    message: 'درخواست جلسه حضوری با وکلای پرتغال و امارات جهت ویزای طلایی ۵۰۰ هزار یورویی بدون شرط اقامت.',
    source: 'quick_call',
    status: 'contacted',
    createdAt: new Date(Date.now() - 3600000 * 42).toISOString(),
    trackingCode: 'RASHA-2025-7204',
    estimatedScore: 98,
  },
];

export function getLeads(): LeadApplication[] {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_LEADS;
  try {
    const stored = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_LEADS));
      return INITIAL_SAMPLE_LEADS;
    }
    return JSON.parse(stored);
  } catch {
    return INITIAL_SAMPLE_LEADS;
  }
}

export function saveLead(lead: LeadApplication): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLeads();
    const updated = [lead, ...existing];
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save lead', err);
  }
}

export function updateLeadStatus(id: string, status: LeadApplication['status']): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLeads();
    const updated = existing.map((l) => (l.id === id ? { ...l, status } : l));
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update lead status', err);
  }
}

export function deleteLead(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLeads();
    const updated = existing.filter((l) => l.id !== id);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete lead', err);
  }
}
