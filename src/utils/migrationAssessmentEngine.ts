export interface ScoringFactorResult {
  category: 'education' | 'experience' | 'language' | 'age' | 'capital';
  titleFa: string;
  titleEn: string;
  score: number;
  maxScore: number;
  noteFa: string;
  noteEn: string;
  isStrength: boolean;
}

export interface RecommendedPathway {
  id: string;
  titleFa: string;
  titleEn: string;
  countryFa: string;
  countryEn: string;
  flag: string;
  categoryFa: string;
  categoryEn: string;
  isPrimary: boolean;
  matchScore: number;
  descriptionFa: string;
  descriptionEn: string;
  estimatedTimelineFa: string;
  estimatedTimelineEn: string;
  requirementsSummaryFa: string[];
  requirementsSummaryEn: string[];
}

export interface MigrationAssessmentInput {
  age: string; // e.g., '18-25', '26-35', '36-45', '46+'
  currentCountry: string;
  education: string; // 'highschool', 'associate', 'bachelor', 'master', 'phd'
  fieldOfStudy: string;
  experienceYears: number | string; // '0', '1-2', '3-5', '6-8', '9+'
  jobCategory: string;
  englishLevel: string; // 'none_basic', 'intermediate_b1_b2', 'advanced_c1_c2_ielts7', 'native_ielts8'
  destinationLanguageLevel?: string; // 'none', 'a1_a2', 'b1_b2', 'c1_c2'
  maritalStatus: 'single' | 'married_with_children' | 'married_no_children';
  hasSpouse: boolean;
  capitalRange: string; // 'under_15k', '15k_50k', '50k_100k', '100k_250k', 'above_250k'
  primaryGoal: 'study' | 'work' | 'investment' | 'startup' | 'job_search' | 'permanent_residency' | 'undecided';
  preferredCountries?: string[]; // e.g., ['Canada', 'Germany', 'Australia']
}

export interface AssessmentAnalysisResult {
  totalScore: number;
  tier: {
    range: string;
    titleFa: string;
    titleEn: string;
    color: string;
    descriptionFa: string;
    descriptionEn: string;
  };
  breakdown: ScoringFactorResult[];
  primaryPathway: RecommendedPathway;
  alternativePathways: RecommendedPathway[];
  suitableCountries: {
    id: string;
    nameFa: string;
    nameEn: string;
    flag: string;
    reasonFa: string;
    reasonEn: string;
  }[];
  strengthsFa: string[];
  strengthsEn: string[];
  weaknessesFa: string[];
  weaknessesEn: string[];
  nextStepsFa: string[];
  nextStepsEn: string[];
  executiveDisclaimerFa: string;
  executiveDisclaimerEn: string;
}

/**
 * Modular Immigration Scoring Engine
 * Rules and weights can be fine-tuned or loaded from country specific profiles.
 */
export function calculateImmigrationEvaluation(input: MigrationAssessmentInput): AssessmentAnalysisResult {
  // 1. Education (max 20)
  let educationScore = 12;
  let eduNoteFa = 'مدرک تحصیلی پایه برای ارزیابی پرونده مهاجرتی.';
  let eduNoteEn = 'Baseline education qualification for immigration file assessment.';

  const eduLower = (input.education || '').toLowerCase();
  if (eduLower.includes('phd') || eduLower.includes('دکتری') || eduLower.includes('دکترا')) {
    educationScore = 20;
    eduNoteFa = 'مدرک دکتری بالاترین امتیاز تحصیلی را در سیستم‌های مبتنی بر امتیاز داراست.';
    eduNoteEn = 'PhD degree awards maximum points across point-based immigration grids.';
  } else if (eduLower.includes('master') || eduLower.includes('ارشد')) {
    educationScore = 18;
    eduNoteFa = 'مدرک کارشناسی ارشد امتیاز بالایی در اکسپرس اینتری و ویزاهای مهارتی ایجاد می‌کند.';
    eduNoteEn = 'Master’s degree grants high leverage in Express Entry and skilled schemes.';
  } else if (eduLower.includes('bachelor') || eduLower.includes('کارشناسی')) {
    educationScore = 15;
    eduNoteFa = 'مدرک لیسانس حداقل شرط استاندارد اکثر برنامه‌های نیروی کار متخصص است.';
    eduNoteEn = 'Bachelor degree satisfies baseline prerequisite for most skilled worker tracks.';
  } else if (eduLower.includes('associate') || eduLower.includes('کاردانی') || eduLower.includes('دیپلم')) {
    educationScore = 10;
    eduNoteFa = 'ارتقای مدرک یا ترکیب با سابقه کاری می‌تواند امتیاز رقابتی شما را بهبود دهد.';
    eduNoteEn = 'Upgrading degree or pairing with trade certifications improves competitiveness.';
  }

  // 2. Experience (max 20)
  let expScore = 10;
  let expNoteFa = 'سابقه کاری در حال شکل‌گیری است.';
  let expNoteEn = 'Work experience is progressing.';

  const expStr = String(input.experienceYears || '').toLowerCase();
  if (expStr.includes('9') || expStr.includes('8+') || expStr.includes('۱۰') || Number(input.experienceYears) >= 8) {
    expScore = 20;
    expNoteFa = 'سابقه کار تخصصی طولانی‌مدت، یکی از مهم‌ترین نقاط قوت رزومه شما محسوب می‌شود.';
    expNoteEn = 'Substantial specialized experience is a standout strength in your portfolio.';
  } else if (expStr.includes('6-8') || expStr.includes('5+') || Number(input.experienceYears) >= 5) {
    expScore = 18;
    expNoteFa = 'بیش از ۵ سال سابقه کار تخصصی، حداکثر امتیاز تجربه را در اغلب کشورها به همراه دارد.';
    expNoteEn = 'Over 5 years of verified experience yields near-maximum points in most countries.';
  } else if (expStr.includes('3-5') || Number(input.experienceYears) >= 3) {
    expScore = 15;
    expNoteFa = 'سابقه ۳ تا ۵ سال، شرط اولیه ورود به رقابت برنامه‌های Skilled Worker است.';
    expNoteEn = '3 to 5 years meets core criteria for skilled labor migration programs.';
  } else if (expStr.includes('1-2') || Number(input.experienceYears) >= 1) {
    expScore = 11;
    expNoteFa = 'سابقه کاری شما ۱ تا ۲ سال است؛ افزایش سابقه امتیاز شما را به طور محسوس جهش می‌دهد.';
    expNoteEn = '1-2 years experience is eligible; additional years will boost eligibility significantly.';
  } else {
    expScore = 6;
    expNoteFa = 'سابقه کار محدود می‌تواند تمرکز پرونده را به سمت مهاجرت تحصیلی یا دوره‌های کارآموزی سوق دهد.';
    expNoteEn = 'Limited work history directs priority toward study pathways or specialized training.';
  }

  // 3. Language (max 20)
  let langScore = 10;
  let langNoteFa = 'سطح زبان متوسط؛ با تمرکز روی آزمون می‌توانید جهش امتیازی بگیرید.';
  let langNoteEn = 'Moderate language proficiency; testing higher will multiply options.';

  const lang = (input.englishLevel || '').toLowerCase();
  const destLang = (input.destinationLanguageLevel || '').toLowerCase();

  if (lang.includes('native') || lang.includes('8') || lang.includes('c2')) {
    langScore = 20;
    langNoteFa = 'تسلط عالی به زبان انگلیسی (آیلتس ۸+ / CLB 9+) بالاترین برگ برنده شما در پرونده است.';
    langNoteEn = 'Exceptional English (IELTS 8+ / CLB 9+) provides the highest competitive boost.';
  } else if (lang.includes('advanced') || lang.includes('7') || lang.includes('c1')) {
    langScore = 18;
    langNoteFa = 'نمره زبان شما (معادل آیلتس ۷ به بالا) برای اکسپرس اینتری و ویزاهای مهارتی بسیار رقابتی است.';
    langNoteEn = 'Strong language proficiency (IELTS 7+ equivalent) qualifies for premier skilled streams.';
  } else if (lang.includes('intermediate') || lang.includes('b2') || lang.includes('6')) {
    langScore = 14;
    langNoteFa = 'سطح زبان شما مناسب است؛ ارتقای یک نمره در آزمون تافل یا آیلتس شانس شما را ۲ برابر می‌کند.';
    langNoteEn = 'Solid baseline; a 1-band improvement in IELTS or TOEFL doubles your CRS competitive leverage.';
  } else {
    langScore = 8;
    langNoteFa = 'تقویت سطح زبان انگلیسی یا زبان کشور مقصد (مانند آلمانی) اولویت نخست برای موفقیت است.';
    langNoteEn = 'Enhancing English or target host language (e.g. German) is priority milestone #1.';
  }

  // Bonus if second language exists (e.g., German B1/B2/C1)
  if (destLang.includes('b1') || destLang.includes('b2') || destLang.includes('c1') || destLang.includes('c2')) {
    langScore = Math.min(20, langScore + 2);
    langNoteFa += ' داشتن مدرک زبان کشور مقصد (نظیر آلمانی یا فرانسوی) امتیاز مضاعف ایجاد کرده است.';
  }

  // 4. Age (max 20)
  let ageScore = 14;
  let ageNoteFa = 'شرایط سنی شما در بازه ارزیابی استاندارد قرار دارد.';
  let ageNoteEn = 'Age is within standard statutory evaluation window.';

  const ageVal = (input.age || '').toLowerCase();
  if (ageVal.includes('18-25') || ageVal.includes('20-25')) {
    ageScore = 18;
    ageNoteFa = 'سن جوان، بهترین زمان برای اقدام تحصیلی و دریافت امتیاز کامل سنی در سیستم‌های امتیازبندی است.';
    ageNoteEn = 'Youth demographic is prime for study permits and long-term residency tracks.';
  } else if (ageVal.includes('26-35') || ageVal.includes('25-32') || ageVal.includes('30-35')) {
    ageScore = 20;
    ageNoteFa = 'بازه سنی طلایی (۲۶ تا ۳۵ سال) حداکثر امتیاز را در سیستم‌های مهاجرتی کانادا و استرالیا دریافت می‌کند.';
    ageNoteEn = 'Golden age bracket (26-35) secures maximum possible points in Canadian & Australian grids.';
  } else if (ageVal.includes('36-45') || ageVal.includes('35-42')) {
    ageScore = 14;
    ageNoteFa = 'در بازه ۳۶ تا ۴۵ سال، جبران امتیاز سن با سابقه کار قوی، مهارت زبانی بالا یا پیشنهاد کاری صورت می‌پذیرد.';
    ageNoteEn = 'In 36-45 age group, points are balanced through senior experience and high language scores.';
  } else if (ageVal.includes('46+') || ageVal.includes('50')) {
    ageScore = 10;
    ageNoteFa = 'برای سنین بالای ۴۵ سال، برنامه‌های سرمایه‌گذاری، تمکن مالی و استارتاپ‌ها اولویت اصلی هستند.';
    ageNoteEn = 'For age 45+, capital investor, independent financial means, and startup streams take precedence.';
  }

  // 5. Capital & Financial Proof (max 20)
  let capScore = 12;
  let capNoteFa = 'بودجه اولیه متوسط برای پشتیبانی از هزینه‌های اقامت.';
  let capNoteEn = 'Moderate initial reserve to substantiate settlement.';

  const cap = (input.capitalRange || '').toLowerCase();
  if (cap.includes('above_250k') || cap.includes('250k+') || cap.includes('500k')) {
    capScore = 20;
    capNoteFa = 'پشتوانه مالی قدرتمند، دروازه برنامه‌های سرمایه‌گذاری طلایی، خرید ملک و استارتاپ‌ها را باز می‌کند.';
    capNoteEn = 'Exceptional liquidity unlocks premier Golden Visa, real estate, and angel investor programs.';
  } else if (cap.includes('100k_250k') || cap.includes('100k-250k')) {
    capScore = 18;
    capNoteFa = 'تمکن مالی بالا مناسب برای انواع ثبت شرکت در اروپا، خودحمایتی و استارتاپ‌های نوآورانه.';
    capNoteEn = 'High net worth suitable for European business incorporation and startup mobility.';
  } else if (cap.includes('50k_100k') || cap.includes('50k-100k')) {
    capScore = 15;
    capNoteFa = 'سرمایه بسیار مناسب برای پوشش هزینه‌های ۲ سال اول زندگی، هزینه‌های وکیل و تمکن بانکی سفارت.';
    capNoteEn = 'Very comfortable reserve covering initial settlement, official fees, and bank proof-of-funds.';
  } else if (cap.includes('15k_50k') || cap.includes('15k-50k')) {
    capScore = 12;
    capNoteFa = 'پوشش‌دهنده تمکن مالی مورد نیاز برای ویزای جستجوی کار آلمان (کارت شانس) یا اکسپرس اینتری.';
    capNoteEn = 'Meets statutory proof-of-funds for German Chancenkarte or Canada Express Entry settlement funds.';
  } else {
    capScore = 8;
    capNoteFa = 'تمرکز بر مسیرهای کاری با کارفرما یا بورسیه‌های تحصیلی که نیاز به سرمایه اولیه کمتری دارند پیشنهاد می‌شود.';
    capNoteEn = 'Focus recommended on employer-sponsored jobs or funded academic scholarships.';
  }

  const totalScore = Math.min(100, Math.max(0, educationScore + expScore + langScore + ageScore + capScore));

  // Determine Tier
  let tier: AssessmentAnalysisResult['tier'];
  if (totalScore >= 80) {
    tier = {
      range: '80 تا 100',
      titleFa: 'پروفایل بسیار مناسب',
      titleEn: 'Highly Competitive Profile',
      color: '#10B981', // emerald
      descriptionFa: 'بر اساس اطلاعات واردشده، رزومه شما در ارزیابی اولیه در بالاترین چارک رقابتی قرار دارد و شانس بررسی موفق پرونده در چندین مسیر معتبر بالاست.',
      descriptionEn: 'Based on submitted metrics, your profile ranks in the upper tier for direct immigration pathways.',
    };
  } else if (totalScore >= 60) {
    tier = {
      range: '60 تا 79',
      titleFa: 'پروفایل مناسب',
      titleEn: 'Favorable Profile',
      color: '#DFBA73', // gold
      descriptionFa: 'پروفایل شما در ارزیابی اولیه شرایط خوبی دارد. با تقویت هدفمند زبان یا انتخاب مسیر ایالتی/استانی، احتمال موفقیت به شکل چشمگیری افزایش می‌یابد.',
      descriptionEn: 'Your profile demonstrates solid qualifications with high potential upon targeted optimization.',
    };
  } else if (totalScore >= 40) {
    tier = {
      range: '40 تا 59',
      titleFa: 'شرایط اولیه قابل بررسی',
      titleEn: 'Viable with Strategic Roadmap',
      color: '#F59E0B', // amber
      descriptionFa: 'شرایط اولیه شما قابل بررسی است، اما برای ورود به برنامه‌های رقابتی نیاز به تقویت مواردی چون سابقه کار، مدرک زبان یا اخذ پذیرش تحصیلی دارید.',
      descriptionEn: 'Viable baseline; bridging specific criteria like language tests or study programs will unlock residency.',
    };
  } else {
    tier = {
      range: '0 تا 39',
      titleFa: 'نیاز به تقویت پروفایل',
      titleEn: 'Profile Optimization Required',
      color: '#EF4444', // red/coral
      descriptionFa: 'برای دستیابی به نتیجه پایدار، پیشنهاد می‌شود ابتدا روی یادگیری زبان و کسب سابقه کار متمرکز شوید یا از مسیر دوره‌های مهارتی و زبان اقدام کنید.',
      descriptionEn: 'Foundational profile enhancement recommended before filing formal visa applications.',
    };
  }

  // Factor breakdown
  const breakdown: ScoringFactorResult[] = [
    {
      category: 'education',
      titleFa: 'تحصیلات و مدارک دانشگاهی',
      titleEn: 'Education & Credentials',
      score: educationScore,
      maxScore: 20,
      noteFa: eduNoteFa,
      noteEn: eduNoteEn,
      isStrength: educationScore >= 16,
    },
    {
      category: 'experience',
      titleFa: 'سابقه کار مرتبط و تخصصی',
      titleEn: 'Work Experience',
      score: expScore,
      maxScore: 20,
      noteFa: expNoteFa,
      noteEn: expNoteEn,
      isStrength: expScore >= 16,
    },
    {
      category: 'language',
      titleFa: 'سطح تسلط به زبان',
      titleEn: 'Language Proficiency',
      score: langScore,
      maxScore: 20,
      noteFa: langNoteFa,
      noteEn: langNoteEn,
      isStrength: langScore >= 16,
    },
    {
      category: 'age',
      titleFa: 'انطباق سنی با سیستم‌های امتیازی',
      titleEn: 'Age Demographic Fit',
      score: ageScore,
      maxScore: 20,
      noteFa: ageNoteFa,
      noteEn: ageNoteEn,
      isStrength: ageScore >= 16,
    },
    {
      category: 'capital',
      titleFa: 'پشتوانه مالی و تمکن اسکان',
      titleEn: 'Financial Liquidity & Proof',
      score: capScore,
      maxScore: 20,
      noteFa: capNoteFa,
      noteEn: capNoteEn,
      isStrength: capScore >= 15,
    },
  ];

  // Dynamic Pathways determination based on profile
  const goal = input.primaryGoal || 'work';
  let primaryPathway: RecommendedPathway;
  const alternativePathways: RecommendedPathway[] = [];

  if (goal === 'investment' || capScore >= 18) {
    primaryPathway = {
      id: 'path-golden-invest',
      titleFa: 'ویزای طلایی و اقامت سرمایه‌گذاری اروپا و امارات',
      titleEn: 'Golden Visa & Investment Residency (UAE & EU)',
      countryFa: 'امارات / اسپانیا / پرتغال',
      countryEn: 'UAE / Spain / Portugal',
      flag: '🇦🇪',
      categoryFa: 'سرمایه‌گذاری و تمکن مالی',
      categoryEn: 'Investor & High Net Worth',
      isPrimary: true,
      matchScore: 94,
      descriptionFa: 'بر اساس توانمندی مالی مناسب واردشده، مسیر اخذ اقامت طلایی ۱۰ ساله دبی یا برنامه‌های ملکی اسپانیا و پرتغال سریع‌ترین و بی‌دردسرترین راه برای شما و خانواده‌تان است.',
      descriptionEn: 'Given your capital bracket, UAE 10-year Golden Visa or EU real estate pathways provide fastest route with zero point dependency.',
      estimatedTimelineFa: '۲ الی ۴ ماه',
      estimatedTimelineEn: '2 – 4 months',
      requirementsSummaryFa: [
        'اثبات تمکن مالی و انتقال دارایی از مبدا قانونی',
        'گواهی عدم سوءپیشینه بین‌المللی',
        'بدون نیاز به مدرک زبان یا محدودیت سنی',
      ],
      requirementsSummaryEn: [
        'Proof of lawful funds & capital deployment',
        'Clean police clearance certificate',
        'No strict language exams or age limits',
      ],
    };
    alternativePathways.push(
      {
        id: 'path-startup-canada',
        titleFa: 'استارتاپ ویزای فدرال کانادا (SUV)',
        titleEn: 'Canada Federal Start-up Visa (SUV)',
        countryFa: 'کانادا',
        countryEn: 'Canada',
        flag: '🇨🇦',
        categoryFa: 'کارآفرینی و نوآوری',
        categoryEn: 'Entrepreneurial & Innovation',
        isPrimary: false,
        matchScore: 86,
        descriptionFa: 'اخذ اقامت دائم مستقیم برای شما، همسر و فرزندان از طریق تیم استارتاپی با حمایت انکوباتورهای رسمی کانادا.',
        descriptionEn: 'Direct permanent residency for founders and families through designated Canadian incubator partnerships.',
        estimatedTimelineFa: '۱۲ الی ۱۸ ماه',
        estimatedTimelineEn: '12 – 18 months',
        requirementsSummaryFa: ['حمایت انکوباتور معتبر', 'آیلتس جنرال ۵.۰', 'طرح تجاری نوآورانه'],
        requirementsSummaryEn: ['Designated incubator support', 'IELTS General 5.0', 'Innovative business plan'],
      },
      {
        id: 'path-self-employed-spain',
        titleFa: 'اقامت تمکن مالی اسپانیا / ایتالیا (Non-Lucrative)',
        titleEn: 'Non-Lucrative Residence (Spain / Italy)',
        countryFa: 'اسپانیا',
        countryEn: 'Spain',
        flag: '🇪🇸',
        categoryFa: 'تمکن مالی بدون اجازه کار',
        categoryEn: 'Independent Wealth',
        isPrimary: false,
        matchScore: 82,
        descriptionFa: 'امکان زندگی در اروپا بر پایه اثبات درآمد ماهانه غیرفعال در کشور مبدا، بدون الزام به سرمایه‌گذاری سنگین.',
        descriptionEn: 'Live in the European Schengen area based on passive source income without direct capital expenditure.',
        estimatedTimelineFa: '۳ الی ۶ ماه',
        estimatedTimelineEn: '3 – 6 months',
        requirementsSummaryFa: ['سپرده بانکی و درآمد ماهانه مستمر', 'بیمه درمانی بین‌المللی', 'سند اقامتگاه'],
        requirementsSummaryEn: ['Bank balance and passive income', 'International health coverage', 'Accommodation contract'],
      }
    );
  } else if (goal === 'study' || (ageScore >= 18 && expScore <= 12)) {
    primaryPathway = {
      id: 'path-study-abroad',
      titleFa: 'ویزای تحصیلی و تبدیل به اقامت پس از فارغ‌التحصیلی (PGWP)',
      titleEn: 'Higher Education with Post-Graduation Work Rights',
      countryFa: 'کانادا / آلمان / انگلستان',
      countryEn: 'Canada / Germany / UK',
      flag: '🇨🇦',
      categoryFa: 'مهاجرت تحصیلی و اقامت کاری',
      categoryEn: 'Academic to Permanent Residency',
      isPrimary: true,
      matchScore: 92,
      descriptionFa: 'بر اساس شرایط سنی و تحصیلی شما، اخذ پذیرش در مقاطع تکمیلی همراه با حق کار دانشجویی و مجوز کار پس از تحصیل، مطمئن‌ترین دروازه ورود شماست.',
      descriptionEn: 'Pursuing higher academic credentials with post-study work authorization offers an optimal, low-friction pathway.',
      estimatedTimelineFa: '۴ الی ۸ ماه',
      estimatedTimelineEn: '4 – 8 months',
      requirementsSummaryFa: [
        'پذیرش از دانشگاه‌های معتبر (DLI)',
        'نمره آیلتس آکادمیک ۶.۵ یا مدرک زبان مقصد',
        'اثبات تمکن مالی سال اول تحصیل',
      ],
      requirementsSummaryEn: [
        'Letter of acceptance from certified DLI',
        'Academic language proficiency test',
        'First-year tuition and living cost proof',
      ],
    };
    alternativePathways.push(
      {
        id: 'path-aus-study',
        titleFa: 'ویزای تحصیلی استرالیا (Subclass 500)',
        titleEn: 'Australia Higher Education Visa',
        countryFa: 'استرالیا',
        countryEn: 'Australia',
        flag: '🇦🇺',
        categoryFa: 'تحصیل و کار',
        categoryEn: 'Education & Graduate Pathway',
        isPrimary: false,
        matchScore: 84,
        descriptionFa: 'بهره‌مندی از ویزای کار فارغ‌التحصیلی موقت (Subclass 485) برای تبدیل به اقامت دائم در رشته‌های دارای کمبود نیرو.',
        descriptionEn: 'Leverage Temporary Graduate Visa (Subclass 485) to transition into PR via designated regional skilled streams.',
        estimatedTimelineFa: '۵ الی ۹ ماه',
        estimatedTimelineEn: '5 – 9 months',
        requirementsSummaryFa: ['پذیرش دانشگاهی معتبر', 'آزمون PTE یا آیلتس', 'اظهارنامه تمکن مالی'],
        requirementsSummaryEn: ['Accredited uni offer', 'PTE / IELTS score', 'Financial declaration'],
      },
      {
        id: 'path-germany-free-study',
        titleFa: 'تحصیل رایگان دانشگاه‌های دولتی آلمان',
        titleEn: 'Germany Public University Enrollment',
        countryFa: 'آلمان',
        countryEn: 'Germany',
        flag: '🇩🇪',
        categoryFa: 'تحصیل تقریبا رایگان',
        categoryEn: 'Tuition-Free Academics',
        isPrimary: false,
        matchScore: 80,
        descriptionFa: 'شهریه نزدیک به صفر در دانشگاه‌های معتبر آلمان به زبان انگلیسی یا آلمانی و اقامت کاری ۱۸ ماهه پس از تحصیل.',
        descriptionEn: 'Zero-tuition universities across Germany with 18-month post-study residence permits for engineering and sciences.',
        estimatedTimelineFa: '۶ الی ۱۰ ماه',
        estimatedTimelineEn: '6 – 10 months',
        requirementsSummaryFa: ['حساب بلوکه‌شده بانکی', 'مدرک زبان انگلیسی یا آلمانی', 'تاییدیه زاب (ZAB)'],
        requirementsSummaryEn: ['Blocked bank deposit', 'Language certificate', 'ZAB credential evaluation'],
      }
    );
  } else {
    // Skilled / Work Pathways
    primaryPathway = {
      id: 'path-germany-chancenkarte',
      titleFa: 'کارت شانس آلمان (Chancenkarte) و بلوکارت اروپا',
      titleEn: 'Germany Opportunity Card (Chancenkarte) & EU Blue Card',
      countryFa: 'آلمان',
      countryEn: 'Germany',
      flag: '🇩🇪',
      categoryFa: 'مهاجرت کاری مستقیم',
      categoryEn: 'Direct Skilled Employment',
      isPrimary: true,
      matchScore: totalScore >= 75 ? 91 : 84,
      descriptionFa: 'بر اساس سن، تحصیلات دانشگاهی و سابقه کار شما، دریافت کارت شانس آلمان به شما اجازه می‌دهد تا ۱ سال قانونی در قلب صنعتی اروپا حضور داشته و به شغل تخصصی برسید.',
      descriptionEn: 'Your blend of degree, experience, and demographic profile makes the German Opportunity Card an accessible entry point.',
      estimatedTimelineFa: '۳ الی ۶ ماه',
      estimatedTimelineEn: '3 – 6 months',
      requirementsSummaryFa: [
        'مدرک دانشگاهی معتبر و ارزیابی شده در آنابین',
        'مدرک زبان آلمانی A1 یا انگلیسی B2',
        'تمکن مالی حساب بلوکه‌شده برای ۱۲ ماه',
      ],
      requirementsSummaryEn: [
        'Recognized degree evaluated on Anabin',
        'German A1 or English B2 certificate',
        'Standardized blocked account deposit',
      ],
    };

    alternativePathways.push(
      {
        id: 'path-canada-ee',
        titleFa: 'اکسپرس اینتری فدرال و برنامه‌های استانی کانادا (PNP)',
        titleEn: 'Canada Express Entry & Provincial Nominee (PNP)',
        countryFa: 'کانادا',
        countryEn: 'Canada',
        flag: '🇨🇦',
        categoryFa: 'اقامت دائم مستقیم (PR)',
        categoryEn: 'Direct Permanent Residence',
        isPrimary: false,
        matchScore: totalScore >= 80 ? 89 : 76,
        descriptionFa: 'ارزیابی پرونده در سیستم امتیازبندی جامع (CRS). در صورت نیاز، ترکیب با نامزدی‌های استانی انتاریو، بریتیش کلمبیا یا آلبرتا ۶۰۰ امتیاز افزوده به پرونده اضافه می‌کند.',
        descriptionEn: 'CRS score competitiveness for Federal Skilled Worker or targeted category-based selections including French, Healthcare, and STEM.',
        estimatedTimelineFa: '۸ الی ۱۴ ماه',
        estimatedTimelineEn: '8 – 14 months',
        requirementsSummaryFa: ['آیلتس جنرال ۷ به بالا (CLB 9)', 'ارزیابی مدارک WES', 'اثبات سابقه کار ناک (NOC)'],
        requirementsSummaryEn: ['IELTS General 7+ (CLB 9)', 'WES educational evaluation', 'Verified NOC experience'],
      },
      {
        id: 'path-australia-189-190',
        titleFa: 'ویزای مهارتی استرالیا (Subclass 189 / 190 / 491)',
        titleEn: 'Australia General Skilled Migration (189 / 190)',
        countryFa: 'استرالیا',
        countryEn: 'Australia',
        flag: '🇦🇺',
        categoryFa: 'اقامت دائم مهارتی',
        categoryEn: 'Points-Tested Skilled PR',
        isPrimary: false,
        matchScore: totalScore >= 75 ? 83 : 72,
        descriptionFa: 'مهاجرت بر پایه اسکیل اسسمنت در سازمان‌های استرالیا نظیر ACS یا Engineers Australia و دریافت دعوتنامه رسمی.',
        descriptionEn: 'Points-tested PR migration pathway requiring formal skill assessment by authorized bodies like ACS or VETASSESS.',
        estimatedTimelineFa: '۱۰ الی ۱۶ ماه',
        estimatedTimelineEn: '10 – 16 months',
        requirementsSummaryFa: ['اسکیل اسسمنت مثبت شغلی', 'نمره PTE یا آیلتس عالی', 'حداقل ۶۵ امتیاز پایه'],
        requirementsSummaryEn: ['Positive Skills Assessment', 'Superior PTE / IELTS test', 'Minimum 65 baseline points'],
      },
      {
        id: 'path-uk-skilled',
        titleFa: 'ویزای نیروی کار ماهر انگلستان (Skilled Worker Visa)',
        titleEn: 'UK Skilled Worker Visa (Sponsorship Route)',
        countryFa: 'انگلستان',
        countryEn: 'United Kingdom',
        flag: '🇬🇧',
        categoryFa: 'اقامت کاری با کارفرما',
        categoryEn: 'Sponsored Skilled Route',
        isPrimary: false,
        matchScore: 78,
        descriptionFa: 'دریافت جاب آفر از کارفرمای مورد تایید وزارت کشور بریتانیا با حقوق بالاتر از آستانه قانونی.',
        descriptionEn: 'Secure approved Certificate of Sponsorship (CoS) from a licensed UK Home Office employer with statutory wage compliance.',
        estimatedTimelineFa: '۳ الی ۵ ماه',
        estimatedTimelineEn: '3 – 5 months',
        requirementsSummaryFa: ['جاب آفر با CoS معتبر', 'آیلتس لایف اسکیلز یا آکادمیک', 'اثبات عدم سوءپیشینه'],
        requirementsSummaryEn: ['Job offer with CoS', 'Approved English test', 'Criminal record certificate'],
      }
    );
  }

  // Determine strengths & weaknesses
  const strengthsFa: string[] = [];
  const strengthsEn: string[] = [];
  const weaknessesFa: string[] = [];
  const weaknessesEn: string[] = [];

  if (educationScore >= 16) {
    strengthsFa.push('مدرک تحصیلی کارشناسی ارشد یا دکتری که ضریب رقابتی بالایی فراهم می‌آورد.');
    strengthsEn.push('Advanced degree granting high competitive edge in point matrices.');
  } else {
    weaknessesFa.push('مدرک تحصیلی در سطح کاردانی یا کارشناسی است که ارتقای آن یا ترکیب با مدارک فنی توصیه می‌شود.');
    weaknessesEn.push('Education credential is baseline; supplemental trade certificates recommended.');
  }

  if (expScore >= 16) {
    strengthsFa.push('سابقه کار کافی و تخصصی که اثبات مهارت و صلاحیت شغلی را تسهیل می‌کند.');
    strengthsEn.push('Proven work tenure facilitating skills assessment and employer trust.');
  } else {
    weaknessesFa.push('سابقه کار کمتر از ۳ سال است که ممکن است در برخی روش‌های اسکیل ورکر نیازمند جبران با پیشنهاد کار باشد.');
    weaknessesEn.push('Tenure under 3 years may require employer sponsorship or study pathway.');
  }

  if (langScore >= 16) {
    strengthsFa.push('سطح زبان مناسب که یکی از مهم‌ترین برگ‌های برنده پرونده‌های مهاجرتی است.');
    strengthsEn.push('Commendable language aptitude fulfilling stringent statutory hurdles.');
  } else {
    weaknessesFa.push('نیاز به ارتقای نمره زبان به حداقل آیلتس ۶.۵ تا ۷.۵ جهت ورود به برنامه‌های رقابتی.');
    weaknessesEn.push('Targeted language training needed to reach competitive score thresholds.');
  }

  if (capScore >= 15) {
    strengthsFa.push('پشتوانه مالی و نقدینگی مطلوب برای پوشش ریسک‌های اولیه و انتخاب روش‌های متنوع.');
    strengthsEn.push('Robust financial buffer accommodating diverse investment or residency avenues.');
  } else {
    weaknessesFa.push('محدودیت بودجه اولیه که تمرکز پرونده را به سمت مسیرهای با کارفرما یا کم‌هزینه سوق می‌دهد.');
    weaknessesEn.push('Modest liquidity limits investor options; employer sponsorship advised.');
  }

  const suitableCountries = [
    {
      id: 'de',
      nameFa: 'آلمان',
      nameEn: 'Germany',
      flag: '🇩🇪',
      reasonFa: 'پذیرش بالای نیروی کار متخصص، کارت شانس و بازار کار صنعتی پویا.',
      reasonEn: 'High demand for specialized talent, Opportunity Card, robust industrial ecosystem.',
    },
    {
      id: 'ca',
      nameFa: 'کانادا',
      nameEn: 'Canada',
      flag: '🇨🇦',
      reasonFa: 'سیستم‌های شفاف اقامت دائم خانوادگی، استارتاپ ویزا و اکسپرس اینتری.',
      reasonEn: 'Transparent PR framework, strong tech & startup ecosystem, family stability.',
    },
    {
      id: 'ae',
      nameFa: 'امارات متحده عربی (دبی)',
      nameEn: 'UAE (Dubai)',
      flag: '🇦🇪',
      reasonFa: 'فرایند سریع بدون نیاز به زبان، مالیات صفر و امنیت بی‌نظیر برای خانواده.',
      reasonEn: 'Zero income tax, accelerated visa turnaround, unrivaled safety & mobility.',
    },
    {
      id: 'au',
      nameFa: 'استرالیا',
      nameEn: 'Australia',
      flag: '🇦🇺',
      reasonFa: 'استاندارد فوق‌العاده زندگی، حقوق و دستمزد بالا و کیفیت آموزشی ممتاز.',
      reasonEn: 'World-class lifestyle quality, strong purchasing power, esteemed universities.',
    },
  ];

  const nextStepsFa = [
    'تطبیق دقیق سوابق کاری و عناوین بیمه‌ای با کدهای استاندارد شغلی بین‌المللی (NOC یا ANZSCO)',
    'تدوین برنامه زمانی جهت شرکت در آزمون رسمی زبان (آیلتس، تافل یا زبان آلمانی)',
    'ارزیابی و معادل‌سازی مدارک تحصیلی در مراجع رسمی مقصد (مانند WES کانادا یا ZAB آلمان)',
    'برگزاری جلسه مشاوره تخصصی جهت انتخاب قطعی میان برنامه‌های استانی، سرمایه‌گذاری یا مهارتی',
  ];

  const nextStepsEn = [
    'Align work credentials and duties with formal classification codes (NOC / ANZSCO).',
    'Structure timeline for standard certified language examination (IELTS, PTE, Goethe).',
    'Initiate official educational credential assessments (WES, ZAB, Anabin).',
    'Schedule dedicated advisory consultation to finalize jurisdiction and tactical filing.',
  ];

  const executiveDisclaimerFa =
    'توجه مهم حقوقی: این برآورد صرفاً یک «ارزیابی اولیه الگوریتمی» بر اساس داده‌های خوداظهاری شماست و به منزله تضمین صدور ویزا یا پذیرش در مراجع دولتی نیست. کلیه ضوابط مهاجرتی بر اساس بررسی رسمی اسناد و قوانین جاری روز توسط وکیل مهاجرت نهایی می‌گردد.';

  const executiveDisclaimerEn =
    'Legal Disclaimer: This evaluation constitutes an initial algorithmic appraisal based on self-reported inputs. It does not warrant official visa issuance or government approval. Final qualification is contingent upon formal statutory assessment by licensed immigration counsel.';

  return {
    totalScore,
    tier,
    breakdown,
    primaryPathway,
    alternativePathways,
    suitableCountries,
    strengthsFa,
    strengthsEn,
    weaknessesFa,
    weaknessesEn,
    nextStepsFa,
    nextStepsEn,
    executiveDisclaimerFa,
    executiveDisclaimerEn,
  };
}
