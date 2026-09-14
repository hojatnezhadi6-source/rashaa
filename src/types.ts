export type Language = 'en' | 'fa' | 'ar' | 'es';

export interface PathwayItem {
  name: string;
  nameFarsi?: string;
  nameArabic?: string;
  description: string;
  descriptionFarsi?: string;
  descriptionArabic?: string;
  requirements: string[];
  requirementsFarsi?: string[];
  requirementsArabic?: string[];
}

export interface Destination {
  id: string;
  name: string;
  nameFarsi?: string;
  nameArabic?: string;
  tagline: string;
  taglineFarsi?: string;
  taglineArabic?: string;
  image: string;
  highlights: string[];
  highlightsFarsi?: string[];
  highlightsArabic?: string[];
  categories: string[];
  categoriesFarsi?: string[];
  categoriesArabic?: string[];
  processingTime: string;
  processingTimeFarsi?: string;
  processingTimeArabic?: string;
  costBracket: string;
  costBracketFarsi?: string;
  costBracketArabic?: string;
  primaryPathways: PathwayItem[];
  lifestyleRank: string;
  lifestyleRankFarsi?: string;
  lifestyleRankArabic?: string;
  capitalCity: string;
  capitalCityFarsi?: string;
  capitalCityArabic?: string;
  overview: string;
  overviewFarsi?: string;
  overviewArabic?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  titleFarsi?: string;
  titleArabic?: string;
  subtitle: string;
  subtitleFarsi?: string;
  subtitleArabic?: string;
  description: string;
  descriptionFarsi?: string;
  descriptionArabic?: string;
  iconName: string;
  image: string;
  targetAudience: string[];
  targetAudienceFarsi?: string[];
  targetAudienceArabic?: string[];
  keyBenefits: string[];
  keyBenefitsFarsi?: string[];
  keyBenefitsArabic?: string[];
  includedAdvisory: string[];
  includedAdvisoryFarsi?: string[];
  includedAdvisoryArabic?: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  titleFarsi?: string;
  titleArabic?: string;
  destination: string;
  destinationFarsi?: string;
  destinationArabic?: string;
  pathway: string;
  pathwayFarsi?: string;
  pathwayArabic?: string;
  profile: string;
  profileFarsi?: string;
  profileArabic?: string;
  challenge: string;
  challengeFarsi?: string;
  challengeArabic?: string;
  strategy: string;
  strategyFarsi?: string;
  strategyArabic?: string;
  outcome: string;
  outcomeFarsi?: string;
  outcomeArabic?: string;
  duration: string;
  durationFarsi?: string;
  durationArabic?: string;
  image: string;
}

export interface JournalArticle {
  id: string;
  title: string;
  titleFarsi?: string;
  titleArabic?: string;
  slug: string;
  category: string;
  categoryFarsi?: string;
  categoryArabic?: string;
  date: string;
  dateFarsi?: string;
  dateArabic?: string;
  readTime: string;
  readTimeFarsi?: string;
  readTimeArabic?: string;
  excerpt: string;
  excerptFarsi?: string;
  excerptArabic?: string;
  content: string[];
  contentFarsi?: string[];
  contentArabic?: string[];
  keyTakeaways: string[];
  keyTakeawaysFarsi?: string[];
  keyTakeawaysArabic?: string[];
  author: {
    name: string;
    role: string;
    roleFarsi?: string;
    roleArabic?: string;
  };
  authorFarsi?: {
    name: string;
    role: string;
  };
  image: string;
}

export interface WhyRashaPrinciple {
  number: string;
  title: string;
  titleFarsi?: string;
  titleArabic?: string;
  subtitle: string;
  subtitleFarsi?: string;
  subtitleArabic?: string;
  description: string;
  descriptionFarsi?: string;
  descriptionArabic?: string;
  image: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  titleFarsi?: string;
  titleArabic?: string;
  duration: string;
  durationFarsi?: string;
  durationArabic?: string;
  description: string;
  descriptionFarsi?: string;
  descriptionArabic?: string;
  details: string[];
  detailsFarsi?: string[];
  detailsArabic?: string[];
}

export interface CityHub {
  id: string;
  name: string;
  nameFarsi?: string;
  nameArabic?: string;
  country: string;
  countryFarsi?: string;
  countryArabic?: string;
  lat: number;
  lng: number;
  xPercent: number;
  yPercent: number;
  timezone: string;
  timezoneFarsi?: string;
  timezoneArabic?: string;
  specialization: string;
  specializationFarsi?: string;
  specializationArabic?: string;
  address: string;
  addressFarsi?: string;
  addressArabic?: string;
}

export interface WhyRashaPrinciple {
  number: string;
  title: string;
  titleFarsi?: string;
  titleArabic?: string;
  subtitle: string;
  subtitleFarsi?: string;
  subtitleArabic?: string;
  description: string;
  descriptionFarsi?: string;
  descriptionArabic?: string;
  image: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  titleFarsi?: string;
  titleArabic?: string;
  duration: string;
  durationFarsi?: string;
  durationArabic?: string;
  description: string;
  descriptionFarsi?: string;
  descriptionArabic?: string;
  details: string[];
  detailsFarsi?: string[];
  detailsArabic?: string[];
}

export interface PathwayEvaluationResult {
  profileSummary: string;
  primaryRecommendation: string;
  pathways: {
    id?: string;
    country: string;
    pathwayName: string;
    category: string;
    matchScore: number;
    timeline: string;
    keyRequirements: string[];
    strategicAdvantage: string;
    potentialHurdle?: string;
    routeStatus?: string;
  }[];
  strategicRoadmap: string[];
  consultantNote: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export interface HeroFrameItem {
  id: string;
  percent: number;
  title: string;
  titleFarsi: string;
  subtitle: string;
  subtitleFarsi: string;
  image: string;
  tag: string;
  tagFarsi: string;
}

export interface LeadApplication {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  currentCountry: string;
  age?: string;
  maritalStatus?: string;
  education?: string;
  jobTitle?: string;
  experienceYears?: string;
  languageLevel?: string;
  targetDestination: string;
  migrationGoal: string;
  budget?: string;
  message?: string;
  source: 'assessment_form' | 'consultation_form' | 'quick_call';
  status: 'new' | 'contacted' | 'reviewing' | 'closed';
  createdAt: string;
  trackingCode: string;
  estimatedScore?: number;
}

export type PersianFontOption = 'shabnam' | 'vazir' | 'sahel' | 'amiri';

export interface SiteConfig {
  heroHeadline1En: string;
  heroHeadline1Fa: string;
  heroHeadline2En: string;
  heroHeadline2Fa: string;
  heroSubheadlineEn: string;
  heroSubheadlineFa: string;
  badgeEn: string;
  badgeFa: string;
  phoneIran: string;
  phoneDubai: string;
  phoneLondon: string;
  whatsappNumber: string;
  consultationEmail: string;
  heroFrames: HeroFrameItem[];
  persianFontTheme?: PersianFontOption;
  destinations?: Destination[];
  services?: ServiceItem[];
  whyRashaPrinciples?: WhyRashaPrinciple[];
  processSteps?: ProcessStep[];
  caseStudies?: CaseStudy[];
  journalArticles?: JournalArticle[];
}

