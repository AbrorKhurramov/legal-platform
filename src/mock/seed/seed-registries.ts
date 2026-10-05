import { ImpactLevel, LegislationSource, LegislationStatus } from "@/entities/legislation/legislation.entry";
import { RiskCategory } from "@/entities/risk/risk.entry";

interface LegislationSeed {
  title: string;
  docNumber: string;
  source: LegislationSource;
  publishedDaysAgo: number;
  effectiveInDays: number;
  impactLevel: ImpactLevel;
  status: LegislationStatus;
  summary: string;
  affectedDocuments: Array<{ name: string; department: string }>;
  tasks: string[];
}

export const LEGISLATION_SEED: LegislationSeed[] = [
  {
    title: "“Banklar va bank faoliyati to'g'risida”gi Qonunga o'zgartirish va qo'shimchalar kiritish haqida",
    docNumber: "O'RQ-1021",
    source: LegislationSource.LAW,
    publishedDaysAgo: 6,
    effectiveInDays: 84,
    impactLevel: ImpactLevel.HIGH,
    status: LegislationStatus.ANALYSIS,
    summary:
      "Bank kuzatuv kengashi a'zolariga qo'yiladigan malaka talablari kuchaytirildi, bog'liq shaxslar bilan bitimlarni tasdiqlash tartibi o'zgartirildi.",
    affectedDocuments: [
      { name: "Bank ustavi", department: "Korporativ boshqaruv bo'limi" },
      { name: "Kuzatuv kengashi to'g'risidagi nizom", department: "Korporativ boshqaruv bo'limi" },
      { name: "Bog'liq shaxslar bilan bitimlar tartibi", department: "Kredit departamenti" },
    ],
    tasks: [
      "Ustavga o'zgartirishlar loyihasini tayyorlash",
      "Kuzatuv kengashi nizomini yangilash",
      "Bog'liq shaxslar ro'yxatini qayta ko'rib chiqish",
    ],
  },
  {
    title: "“Shaxsga doir ma'lumotlar to'g'risida”gi Qonunga qo'shimchalar",
    docNumber: "O'RQ-1009",
    source: LegislationSource.LAW,
    publishedDaysAgo: 28,
    effectiveInDays: 12,
    impactLevel: ImpactLevel.HIGH,
    status: LegislationStatus.TASKS_ASSIGNED,
    summary:
      "Shaxsga doir ma'lumotlarni transchegaraviy uzatish va uchinchi shaxslarga (pudratchilarga) topshirish uchun sub'ektning alohida roziligi talab etiladi.",
    affectedDocuments: [
      { name: "Shaxsga doir ma'lumotlarni qayta ishlash nizomi", department: "Axborot xavfsizligi departamenti" },
      { name: "Mijoz roziligi shakli", department: "Chakana biznes departamenti" },
      { name: "Autsorsing shartnomalari namunaviy shakli", department: "Yuridik departament" },
    ],
    tasks: ["Rozilik shaklini yangilash", "Pudratchilar bilan shartnomalarga maxfiylik bandini qo'shish", "Xodimlar uchun yo'riqnoma tayyorlash"],
  },
  {
    title: "Kredit tashkilotlarida ichki nazoratga qo'yiladigan talablar to'g'risidagi nizom",
    docNumber: "MB-3542",
    source: LegislationSource.CENTRAL_BANK,
    publishedDaysAgo: 45,
    effectiveInDays: -5,
    impactLevel: ImpactLevel.MEDIUM,
    status: LegislationStatus.IMPLEMENTED,
    summary: "Ichki nazorat xizmatining mustaqilligi va hisobot berish davriyligiga oid talablar yangilandi.",
    affectedDocuments: [
      { name: "Ichki nazorat qoidalari", department: "Ichki nazorat departamenti" },
      { name: "Ichki audit xizmati nizomi", department: "Ichki audit xizmati" },
    ],
    tasks: ["Ichki nazorat qoidalari yangi tahririni tasdiqlash", "Hisobot shaklini o'zgartirish"],
  },
  {
    title: "Iste'mol kreditlarini berish tartibi to'g'risidagi nizomga o'zgartirishlar",
    docNumber: "MB-3561",
    source: LegislationSource.CENTRAL_BANK,
    publishedDaysAgo: 3,
    effectiveInDays: 30,
    impactLevel: ImpactLevel.HIGH,
    status: LegislationStatus.NEW,
    summary:
      "Qarz yuki ko'rsatkichi (DTI) chegarasi 50 foizdan oshmasligi, kredit bo'yicha to'liq qiymat mijozga shartnoma imzolangunga qadar ma'lum qilinishi belgilandi.",
    affectedDocuments: [
      { name: "Chakana kreditlash siyosati", department: "Chakana biznes departamenti" },
      { name: "Iste'mol krediti shartnomasi namunasi", department: "Yuridik departament" },
    ],
    tasks: [],
  },
  {
    title: "Elektron raqamli imzo to'g'risidagi Qonunning yangi tahriri",
    docNumber: "O'RQ-998",
    source: LegislationSource.LAW,
    publishedDaysAgo: 70,
    effectiveInDays: 20,
    impactLevel: ImpactLevel.MEDIUM,
    status: LegislationStatus.TASKS_ASSIGNED,
    summary: "Bulutli ERI va mobil ERI tushunchalari joriy etildi, elektron hujjatning qog'oz nusxasi maqomi aniqlashtirildi.",
    affectedDocuments: [
      { name: "Elektron hujjat aylanishi tartibi", department: "Ish yuritish bo'limi" },
      { name: "Masofaviy bank xizmatlari qoidalari", department: "Raqamli biznes departamenti" },
    ],
    tasks: ["EHAT tartibiga mobil ERI bo'yicha o'zgartirish", "Masofaviy xizmat shartnomasini yangilash"],
  },
  {
    title: "Garov reestrini yuritish tartibi to'g'risidagi nizomni tasdiqlash haqida",
    docNumber: "VMQ-512",
    source: LegislationSource.CABINET_RESOLUTION,
    publishedDaysAgo: 15,
    effectiveInDays: 45,
    impactLevel: ImpactLevel.MEDIUM,
    status: LegislationStatus.ANALYSIS,
    summary:
      "Ko'char mulk garovini reestrda ro'yxatdan o'tkazish elektron shaklda amalga oshiriladi, garovga oluvchining ustuvorligi reestrga kiritilgan vaqt bilan belgilanadi.",
    affectedDocuments: [
      { name: "Garov bilan ishlash yo'riqnomasi", department: "Garov bilan ishlash bo'limi" },
      { name: "Garov shartnomasi namunasi", department: "Yuridik departament" },
    ],
    tasks: ["Garov yo'riqnomasini yangilash", "Filiallar uchun seminar o'tkazish"],
  },
  {
    title: "Bank kartalari bilan bog'liq firibgarlikka qarshi qo'shimcha chora-tadbirlar to'g'risida",
    docNumber: "PQ-387",
    source: LegislationSource.PRESIDENT_RESOLUTION,
    publishedDaysAgo: 34,
    effectiveInDays: 2,
    impactLevel: ImpactLevel.HIGH,
    status: LegislationStatus.TASKS_ASSIGNED,
    summary:
      "Shubhali tranzaksiyalarni vaqtincha to'xtatish va mijozni xabardor qilish majburiyati belgilandi, bankning javobgarlik doirasi kengaytirildi.",
    affectedDocuments: [
      { name: "Bank kartalari bo'yicha xizmat ko'rsatish qoidalari", department: "Kartalar departamenti" },
      { name: "Mijozlar murojaatlarini ko'rib chiqish tartibi", department: "Mijozlarga xizmat ko'rsatish" },
    ],
    tasks: ["Karta shartnomasiga javobgarlik bandini qo'shish", "Murojaatlar tartibini yangilash", "Call-markaz skriptlarini yangilash"],
  },
  {
    title: "Tadbirkorlik sub'ektlarini qo'llab-quvvatlash bo'yicha kafillik fondi faoliyatini takomillashtirish",
    docNumber: "PF-142",
    source: LegislationSource.PRESIDENT_DECREE,
    publishedDaysAgo: 52,
    effectiveInDays: -12,
    impactLevel: ImpactLevel.LOW,
    status: LegislationStatus.IMPLEMENTED,
    summary: "Kafillik fondi kafilligi ostidagi kreditlar bo'yicha hujjatlar ro'yxati qisqartirildi.",
    affectedDocuments: [{ name: "Kichik biznesni kreditlash tartibi", department: "Korporativ biznes departamenti" }],
    tasks: ["Kreditlash tartibiga o'zgartirish kiritish"],
  },
  {
    title: "Pul mablag'larini legallashtirishga qarshi kurashish ichki qoidalariga qo'yiladigan talablar",
    docNumber: "MB-3570",
    source: LegislationSource.CENTRAL_BANK,
    publishedDaysAgo: 1,
    effectiveInDays: 60,
    impactLevel: ImpactLevel.HIGH,
    status: LegislationStatus.NEW,
    summary: "Benefitsiar mulkdorni aniqlash tartibi va yuqori xatarli mijozlarni kuchaytirilgan tekshirish mezonlari o'zgartirildi.",
    affectedDocuments: [
      { name: "AML/CFT ichki qoidalari", department: "Komplayens nazorati departamenti" },
      { name: "KYC tartibi", department: "Komplayens nazorati departamenti" },
    ],
    tasks: [],
  },
  {
    title: "Mehnat kodeksiga masofaviy ish bo'yicha o'zgartirishlar",
    docNumber: "O'RQ-1015",
    source: LegislationSource.LAW,
    publishedDaysAgo: 20,
    effectiveInDays: 25,
    impactLevel: ImpactLevel.LOW,
    status: LegislationStatus.ANALYSIS,
    summary: "Masofaviy ishga o'tkazish uchun xodimning yozma roziligi va texnik vositalar bilan ta'minlash tartibi belgilandi.",
    affectedDocuments: [
      { name: "Ichki mehnat tartibi qoidalari", department: "Xodimlar bilan ishlash departamenti" },
      { name: "Mehnat shartnomasi namunasi", department: "Yuridik departament" },
    ],
    tasks: ["Mehnat shartnomasiga qo'shimcha kelishuv shaklini tayyorlash"],
  },
];

interface RiskSeed {
  title: string;
  category: RiskCategory;
  description: string;
  mitigation: string;
}

export const RISK_SEED: RiskSeed[] = [
  {
    title: "Garov hujjatlari to'liq rasmiylashtirilmagan",
    category: RiskCategory.CONTRACT,
    description: "Bir qator kredit bo'yicha garov shartnomalari notarial tasdiqlanmagan yoki garov reestrida ro'yxatdan o'tmagan.",
    mitigation: "Filiallarda garov hujjatlarini inventarizatsiya qilish, kamchiliklarni 30 kun ichida bartaraf etish.",
  },
  {
    title: "Kontragent javobgarligi shartnomada cheklanmagan",
    category: RiskCategory.CONTRACT,
    description: "IT xizmatlari shartnomalarida kontragent javobgarligi va ma'lumotlar sizib chiqishi uchun jarima nazarda tutilmagan.",
    mitigation: "Namunaviy shartnomaga javobgarlik va maxfiylik bandlarini kiritish.",
  },
  {
    title: "Protsessual muddatlarni o'tkazib yuborish xavfi",
    category: RiskCategory.LITIGATION,
    description: "Filiallardan sud hujjatlari kechikib kelishi sababli apellyatsiya muddatlari o'tkazib yuborilishi mumkin.",
    mitigation: "Sud hujjatlarini elektron tarzda 1 ish kuni ichida yuborish tartibini joriy etish, muddatlar avtomatik eslatmasi.",
  },
  {
    title: "Shaxsga doir ma'lumotlar pudratchiga rozisiz uzatilishi",
    category: RiskCategory.DATA_PROTECTION,
    description: "Undiruv agentligi bilan shartnoma bo'yicha mijozlar ma'lumotlari sub'ekt roziligisiz uzatilmoqda.",
    mitigation: "Mijoz roziligi shaklini yangilash, pudratchi bilan maxfiylik to'g'risida kelishuv imzolash.",
  },
  {
    title: "Ichki hujjatlar yangi MB talablariga mos emas",
    category: RiskCategory.REGULATORY,
    description: "Iste'mol kreditlari bo'yicha yangi talablar kuchga kirgunga qadar ichki hujjatlar yangilanmasligi mumkin.",
    mitigation: "Mas'ul bo'linmalarga muddatli topshiriqlar berish va ijrosini nazorat qilish.",
  },
  {
    title: "Kuzatuv kengashi qarorlari o'z vaqtida ijro etilmayapti",
    category: RiskCategory.CORPORATE,
    description: "Kuzatuv kengashining 6 ta topshirig'i bo'yicha ijro muddati o'tgan.",
    mitigation: "Topshiriqlar reestrini yuritish, har oy Boshqaruvga ijro holati bo'yicha axborot berish.",
  },
  {
    title: "Filial binosi ijara shartnomasi muddati tugamoqda",
    category: RiskCategory.OPERATIONAL,
    description: "Ikki filial binosi bo'yicha ijara shartnomasi 45 kun ichida tugaydi, uzaytirish bo'yicha kelishuv yo'q.",
    mitigation: "Ijaraga beruvchi bilan muzokaralar, muqobil bino variantlarini ko'rib chiqish.",
  },
  {
    title: "Muddati o'tgan ishonchnomalar asosida hujjat imzolanishi",
    category: RiskCategory.CORPORATE,
    description: "Filial rahbarlarining ayrim ishonchnomalari muddati o'tgan, lekin ular asosida shartnomalar imzolanmoqda.",
    mitigation: "Ishonchnomalar reestrini yuritish va muddat tugashidan 15 kun oldin ogohlantirish.",
  },
  {
    title: "Jismoniy shaxslar da'volari soni ortishi",
    category: RiskCategory.LITIGATION,
    description: "Karta firibgarligi bo'yicha fuqarolar da'volari ortib bormoqda, bank zimmasiga javobgarlik yuklanishi xavfi.",
    mitigation: "Firibgarlikka qarshi choralarni kuchaytirish, sud amaliyotini tahlil qilish.",
  },
  {
    title: "Bank siri to'g'risidagi talablar buzilishi",
    category: RiskCategory.DATA_PROTECTION,
    description: "Vakolatli bo'lmagan organlar so'rovlariga javob berishda bank siri oshkor etilishi xavfi.",
    mitigation: "So'rovlarga javob berish tartibini yuridik departament bilan majburiy kelishish.",
  },
  {
    title: "Namunaviy shartnomalar eskirgan",
    category: RiskCategory.CONTRACT,
    description: "Filiallar 2 yil oldingi namunaviy shartnoma shakllaridan foydalanmoqda.",
    mitigation: "Namunaviy hujjatlar bazasini yangilash va eski shakllarni tizimdan chiqarish.",
  },
  {
    title: "Soliq organi bilan nizo",
    category: RiskCategory.REGULATORY,
    description: "Soliq tekshiruvi natijasida qo'shimcha soliq hisoblanishi bo'yicha nizo mavjud.",
    mitigation: "Sudgacha e'tiroz bildirish va zarur hujjatlarni to'plash.",
  },
];
