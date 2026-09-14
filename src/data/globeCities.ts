export interface GlobeCity {
  id: string;
  nameEn: string;
  nameFa: string;
  countryId: string;
  lat: number;
  lng: number;
  isCapital: boolean;
  population: string;
  highlightFa: string;
  highlightEn: string;
}

export const GLOBE_CITIES: GlobeCity[] = [
  // Canada
  { id: 'ca-toronto', nameEn: 'Toronto', nameFa: 'تورنتو', countryId: 'canada', lat: 43.6532, lng: -79.3832, isCapital: false, population: '6.3M', highlightFa: 'قطب مالی و اقتصادی کانادا، بازار کار بی‌نظیر برای IT و مهندسی', highlightEn: 'Canada’s financial & tech powerhouse' },
  { id: 'ca-vancouver', nameEn: 'Vancouver', nameFa: 'ونکوور', countryId: 'canada', lat: 49.2827, lng: -123.1207, isCapital: false, population: '2.6M', highlightFa: 'زیباترین شهر ساحلی، معتدل‌ترین آب‌وهوای کانادا و بهشت استارتاپ‌ها', highlightEn: 'Premier coastal city with top tech hubs' },
  { id: 'ca-montreal', nameEn: 'Montreal', nameFa: 'مونترال', countryId: 'canada', lat: 45.5017, lng: -73.5673, isCapital: false, population: '4.2M', highlightFa: 'پایتخت فرهنگی، هزینه زندگی مناسب‌تر و هاب هوش مصنوعی جهان', highlightEn: 'Bilingual cultural hub & AI center' },
  { id: 'ca-ottawa', nameEn: 'Ottawa', nameFa: 'اتاوا', countryId: 'canada', lat: 45.4215, lng: -75.6972, isCapital: true, population: '1.4M', highlightFa: 'پایتخت فدرال کانادا، بالاترین نرخ درآمد و بیشترین امنیت خانوادگی', highlightEn: 'Federal capital with top family stability' },

  // Germany
  { id: 'de-berlin', nameEn: 'Berlin', nameFa: 'برلین', countryId: 'germany', lat: 52.52, lng: 13.405, isCapital: true, population: '3.8M', highlightFa: 'پایتخت استارتاپی اروپا، زبان انگلیسی رایج در شرکت‌های نوآور', highlightEn: 'Startup capital of Europe' },
  { id: 'de-frankfurt', nameEn: 'Frankfurt', nameFa: 'فرانکفورت', countryId: 'germany', lat: 50.1109, lng: 8.6821, isCapital: false, population: '2.3M', highlightFa: 'پایتخت مالی اروپا و مرکز بانک مرکزی اتحادیه اروپا (ECB)', highlightEn: 'European banking & financial headquarters' },
  { id: 'de-munich', nameEn: 'Munich', nameFa: 'مونیخ', countryId: 'germany', lat: 48.1351, lng: 11.582, isCapital: false, population: '1.6M', highlightFa: 'قطب فناوری و خودرو (ب‌ام‌و، زیمنس)، بالاترین سطح رفاه آلمان', highlightEn: 'Advanced engineering & high living index' },
  { id: 'de-hamburg', nameEn: 'Hamburg', nameFa: 'هامبورگ', countryId: 'germany', lat: 53.5511, lng: 9.9937, isCapital: false, population: '1.9M', highlightFa: 'بزرگ‌ترین بندر آلمان، تجارت بین‌الملل و صنعت هوافضا (ایرباس)', highlightEn: 'Maritime trade & aerospace giant' },

  // UK
  { id: 'uk-london', nameEn: 'London', nameFa: 'لندن', countryId: 'uk', lat: 51.5074, lng: -0.1278, isCapital: true, population: '9.0M', highlightFa: 'پایتخت اقتصادی جهان، فرصت‌های نامحدود شغلی و حقوق‌های بالا', highlightEn: 'Global financial & professional capital' },
  { id: 'uk-manchester', nameEn: 'Manchester', nameFa: 'منچستر', countryId: 'uk', lat: 53.4808, lng: -2.2426, isCapital: false, population: '2.8M', highlightFa: 'هاب فناوری شمال انگلستان با هزینه زندگی اقتصادی‌تر از لندن', highlightEn: 'Northern tech & media powerhouse' },
  { id: 'uk-edinburgh', nameEn: 'Edinburgh', nameFa: 'ادینبرو', countryId: 'uk', lat: 55.9533, lng: -3.1883, isCapital: false, population: '540K', highlightFa: 'پایتخت باشکوه اسکاتلند، رتبه اول آموزش عالی و کیفیت زندگی', highlightEn: 'Historic Scottish capital with top universities' },

  // Australia
  { id: 'au-sydney', nameEn: 'Sydney', nameFa: 'سیدنی', countryId: 'australia', lat: -33.8688, lng: 151.2093, isCapital: false, population: '5.3M', highlightFa: 'بزرگ‌ترین شهر اقیانوسیه، بازار کار بین‌المللی و سواحل باشکوه', highlightEn: 'Australia’s premier global city' },
  { id: 'au-melbourne', nameEn: 'Melbourne', nameFa: 'ملبورن', countryId: 'australia', lat: -37.8136, lng: 144.9631, isCapital: false, population: '5.1M', highlightFa: 'پایتخت فرهنگی و بارها منتخب به عنوان بهترین شهر دنیا برای زندگی', highlightEn: 'World’s most livable cultural hub' },
  { id: 'au-brisbane', nameEn: 'Brisbane', nameFa: 'بریزبن', countryId: 'australia', lat: -27.4698, lng: 153.0251, isCapital: false, population: '2.6M', highlightFa: 'میزبان المپیک ۲۰۳۲، سریع‌ترین رشد اقتصادی و آب‌وهوای گرمسیری', highlightEn: 'Olympic city 2032 with rapid expansion' },
  { id: 'au-canberra', nameEn: 'Canberra', nameFa: 'کانبرا', countryId: 'australia', lat: -35.2809, lng: 149.13, isCapital: true, population: '460K', highlightFa: 'پایتخت دیپلماتیک و دانشگاه ملی استرالیا (ANU)', highlightEn: 'Federal capital & diplomatic zone' },

  // UAE
  { id: 'ae-dubai', nameEn: 'Dubai', nameFa: 'دبی', countryId: 'uae', lat: 25.2048, lng: 55.2708, isCapital: false, population: '3.6M', highlightFa: 'پایتخت تجارت آزاد، مالیات صفر، امنیت کامل و سریع‌ترین رشد لوکس', highlightEn: 'Zero-tax global business paradise' },
  { id: 'ae-abudhabi', nameEn: 'Abu Dhabi', nameFa: 'ابوظبی', countryId: 'uae', lat: 24.4539, lng: 54.3773, isCapital: true, population: '1.8M', highlightFa: 'پایتخت ثروتمند فدرال امارات، سرمایه‌گذاری عظیم در هوش مصنوعی و انرژی', highlightEn: 'Sovereign capital of UAE' },

  // USA
  { id: 'us-newyork', nameEn: 'New York', nameFa: 'نیویورک', countryId: 'usa', lat: 40.7128, lng: -74.006, isCapital: false, population: '8.8M', highlightFa: 'مرکز مالی وال استریت و نبض رسانه و تجارت کره زمین', highlightEn: 'The business capital of the world' },
  { id: 'us-sanfrancisco', nameEn: 'San Francisco (Silicon Valley)', nameFa: 'سان فرانسیسکو / سیلیکون ولی', countryId: 'usa', lat: 37.7749, lng: -122.4194, isCapital: false, population: '4.7M', highlightFa: 'قلب فناوری جهان، مقر گوگل، اپل و سرمایه‌گذاران خطرپذیر', highlightEn: 'Epicenter of world innovation & AI' },
  { id: 'us-losangeles', nameEn: 'Los Angeles', nameFa: 'لس آنجلس', countryId: 'usa', lat: 34.0522, lng: -118.2437, isCapital: false, population: '3.9M', highlightFa: 'قطب رسانه و هالیوود، صنعت فضایی، زیست‌بوم کارآفرینی ایرانیان', highlightEn: 'Media, aerospace & trade hub' },
  { id: 'us-washington', nameEn: 'Washington, D.C.', nameFa: 'واشنگتن دی‌سی', countryId: 'usa', lat: 38.9072, lng: -77.0369, isCapital: true, population: '700K', highlightFa: 'مرکز تصمیم‌گیری‌های سیاسی، حقوقی و نهادهای بین‌المللی', highlightEn: 'Political & institutional center' },

  // Italy
  { id: 'it-rome', nameEn: 'Rome', nameFa: 'رم', countryId: 'italy', lat: 41.9028, lng: 12.4964, isCapital: true, population: '2.8M', highlightFa: 'پایتخت تاریخی با دانشگاه‌های کهن و بورسیه‌های استانی کامل استانی (DSU)', highlightEn: 'Eternal city with generous regional scholarships' },
  { id: 'it-milan', nameEn: 'Milan', nameFa: 'میلان', countryId: 'italy', lat: 45.4642, lng: 9.19, isCapital: false, population: '1.4M', highlightFa: 'پایتخت مد، اقتصاد و طراحی صنعتی اروپا و بورس ایتالیا', highlightEn: 'Italy’s commercial and fashion capital' },

  // Spain
  { id: 'es-madrid', nameEn: 'Madrid', nameFa: 'مادرید', countryId: 'spain', lat: 40.4168, lng: -3.7038, isCapital: true, population: '3.3M', highlightFa: 'پایتخت پویا، قانون مالیاتی بکهام برای مدیران و آب‌وهوای مطلوب', highlightEn: 'Beckham law tax advantages & vibrant lifestyle' },
  { id: 'es-barcelona', nameEn: 'Barcelona', nameFa: 'بارسلونا', countryId: 'spain', lat: 41.3851, lng: 2.1734, isCapital: false, population: '1.6M', highlightFa: 'بهشت نومدهای دیجیتال، هاب بین‌المللی فناوری در حوزه مدیترانه', highlightEn: 'Top European digital nomad paradise' },

  // Netherlands
  { id: 'nl-amsterdam', nameEn: 'Amsterdam', nameFa: 'آمستردام', countryId: 'netherlands', lat: 52.3676, lng: 4.9041, isCapital: true, population: '900K', highlightFa: 'بالاترین سطح مکالمه انگلیسی در اروپا و معافیت مالیاتی ۳۰٪ برای متخصصان', highlightEn: 'Top English fluency & 30% ruling tax benefit' },
  { id: 'nl-rotterdam', nameEn: 'Rotterdam', nameFa: 'روتردام', countryId: 'netherlands', lat: 51.9244, lng: 4.4777, isCapital: false, population: '650K', highlightFa: 'بزرگ‌ترین بندر کل اروپا و پیشرو در معماری مدرن و لجستیک', highlightEn: 'Largest maritime logistics gateway' },

  // Switzerland
  { id: 'ch-zurich', nameEn: 'Zurich', nameFa: 'زوریخ', countryId: 'switzerland', lat: 47.3769, lng: 8.5417, isCapital: false, population: '430K', highlightFa: 'بالاترین حقوق جهان، دانشگاه ETH زوریخ و امنیت مالی بی‌رقیب', highlightEn: 'Highest global salaries & world-class stability' },
  { id: 'ch-geneva', nameEn: 'Geneva', nameFa: 'ژنو', countryId: 'switzerland', lat: 46.2044, lng: 6.1432, isCapital: false, population: '200K', highlightFa: 'مقر اروپایی سازمان ملل و بانک‌های خصوصی معتبر بین‌المللی', highlightEn: 'UN European headquarters & private wealth' },

  // Portugal
  { id: 'pt-lisbon', nameEn: 'Lisbon', nameFa: 'لیسبون', countryId: 'portugal', lat: 38.7223, lng: -9.1393, isCapital: true, population: '550K', highlightFa: 'آفتابی‌ترین پایتخت اروپا، ویزای D7 تمکن مالی و پاسپورت در ۵ سال', highlightEn: 'Sunniest capital, D7 passive income visa' },
  { id: 'pt-porto', nameEn: 'Porto', nameFa: 'پورتو', countryId: 'portugal', lat: 41.1579, lng: -8.6291, isCapital: false, population: '240K', highlightFa: 'شهر ساحلی با هزینه‌های مقرون‌به‌صرفه و رشد سریع پروژه‌های استارتاپی', highlightEn: 'Thriving coastal tech ecosystem' },

  // Iran (Origin)
  { id: 'ir-tehran', nameEn: 'Tehran', nameFa: 'تهران', countryId: 'iran', lat: 35.6892, lng: 51.389, isCapital: true, population: '9.0M', highlightFa: 'مبدا پرونده‌های اعزام و دفتر مرکزی موسسه حقوقی راشا', highlightEn: 'Origin & Rasha Headquarters' },
  { id: 'ir-isfahan', nameEn: 'Isfahan', nameFa: 'اصفهان', countryId: 'iran', lat: 32.6546, lng: 51.668, isCapital: false, population: '2.0M', highlightFa: 'پایتخت فرهنگی و مهد نخبگان علمی و صنعتی', highlightEn: 'Historic & scientific center' },
  { id: 'ir-shiraz', nameEn: 'Shiraz', nameFa: 'شیراز', countryId: 'iran', lat: 29.5918, lng: 52.5837, isCapital: false, population: '1.6M', highlightFa: 'قطب پزشکی جنوب کشور و مهد ادبیات', highlightEn: 'Medical & academic hub' },
  { id: 'ir-mashhad', nameEn: 'Mashhad', nameFa: 'مشهد', countryId: 'iran', lat: 36.2972, lng: 59.6067, isCapital: false, population: '3.1M', highlightFa: 'دومین کلان‌شهر و کانون تجاری شرق کشور', highlightEn: 'Eastern commercial metropolis' },
];
