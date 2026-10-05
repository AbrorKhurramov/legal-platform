import { KnowledgeCategory } from "@/entities/knowledge/knowledge.entry";

interface KnowledgeSeed {
  question: string;
  answer: string;
  category: KnowledgeCategory;
  tags: string[];
}

export const KNOWLEDGE_SEED: KnowledgeSeed[] = [
  {
    question: "Kredit bo'yicha qarzdor vafot etgan bo'lsa, qarz qanday undiriladi?",
    answer:
      "Qarz merosxo'rlarga meros qilib olingan mol-mulk qiymati doirasida o'tadi. Filial notarial idoraga meros ishi ochilganligini aniqlash uchun so'rov yuboradi va notariusga kreditor sifatida talab bildiradi. Meros qabul qilingandan so'ng merosxo'rlarga talabnoma yuboriladi, to'lanmagan taqdirda sudga da'vo kiritiladi. Meros ochilgan kundan boshlab olti oy davomida merosxo'rlarga nisbatan majburiy undiruv qaratilmaydi.",
    category: KnowledgeCategory.CREDIT,
    tags: ["meros", "undiruv", "notarius"],
  },
  {
    question: "Garov mulkini suddan tashqari undirish mumkinmi?",
    answer:
      "Ha, agar garov shartnomasida suddan tashqari undirish sharti nazarda tutilgan va shartnoma notarial tasdiqlangan bo'lsa. Bunda garovga qo'yuvchiga kamida 30 kun oldin yozma xabarnoma yuboriladi. Uy-joy (yagona turar joy) bo'yicha suddan tashqari undirish qo'llanilmaydi — faqat sud tartibida.",
    category: KnowledgeCategory.COLLATERAL,
    tags: ["garov", "suddan tashqari", "ipoteka"],
  },
  {
    question: "Ishonchnoma asosida uchinchi shaxsga hisob raqam ochish mumkinmi?",
    answer:
      "Mumkin, agar ishonchnoma notarial tasdiqlangan va unda hisob raqam ochish vakolati aniq ko'rsatilgan bo'lsa. Vakilning shaxsini tasdiqlovchi hujjat va ishonchnoma asl nusxasi tekshiriladi, KYC tartibi ishonch bildiruvchiga nisbatan ham qo'llaniladi.",
    category: KnowledgeCategory.PROCEDURE,
    tags: ["ishonchnoma", "hisob raqam", "KYC"],
  },
  {
    question: "Prokuratura so'roviga mijoz hisob raqami bo'yicha ma'lumot berish mumkinmi?",
    answer:
      "Bank siri to'g'risidagi qonunga ko'ra ma'lumot faqat qo'zg'atilgan jinoyat ishi yuzasidan, prokuror sanksiyasi mavjud bo'lgan hollarda beriladi. So'rovda ish raqami va huquqiy asos ko'rsatilmagan bo'lsa, javob yuridik departament bilan kelishilgan holda rad etiladi.",
    category: KnowledgeCategory.BANK_SECRECY,
    tags: ["bank siri", "prokuratura", "so'rov"],
  },
  {
    question: "Mijoz ma'lumotlarini undiruv agentligiga topshirish uchun nima kerak?",
    answer:
      "Mijozning shaxsga doir ma'lumotlarini uchinchi shaxsga uzatishga yozma (yoki elektron) roziligi olinishi shart. Agentlik bilan tuzilgan shartnomada maxfiylik, ma'lumotlarni saqlash muddati va yo'q qilish tartibi belgilanadi. Rozilik bo'lmasa, faqat qarz miqdori va aloqa ma'lumotlari minimal hajmda uzatiladi.",
    category: KnowledgeCategory.PERSONAL_DATA,
    tags: ["shaxsga doir ma'lumot", "undiruv", "rozilik"],
  },
  {
    question: "Xodimni intizomiy javobgarlikka tortish muddati qancha?",
    answer:
      "Intizomiy jazo nojo'ya xatti-harakat aniqlangan kundan boshlab bir oydan kechiktirmay, sodir etilgan kundan esa olti oydan kechiktirmay qo'llaniladi. Jazo qo'llashdan oldin xodimdan yozma tushuntirish talab qilinadi.",
    category: KnowledgeCategory.LABOR,
    tags: ["mehnat", "intizomiy jazo", "muddat"],
  },
  {
    question: "Kafillik shartnomasi yakka tartibdagi tadbirkor bilan qanday rasmiylashtiriladi?",
    answer:
      "YaTT jismoniy shaxs sifatida kafil bo'ladi va butun mol-mulki bilan javob beradi. Shartnomada kafillik summasi, muddati va solidar javobgarlik aniq ko'rsatiladi. Turmush o'rtog'ining roziligi umumiy mulk hisobidan javobgarlik uchun tavsiya etiladi.",
    category: KnowledgeCategory.CONTRACTS,
    tags: ["kafillik", "YaTT", "shartnoma"],
  },
  {
    question: "Kuzatuv kengashi qarori qaysi hollarda talab etiladi?",
    answer:
      "Bank aktivlari balans qiymatining 15 foizidan 50 foizigacha bo'lgan yirik bitimlar, bog'liq shaxslar bilan bitimlar, Boshqaruv a'zolarini tayinlash va ichki audit xizmati hisobotlarini tasdiqlash Kuzatuv kengashi vakolatiga kiradi. 50 foizdan ortiq bitimlar aksiyadorlar umumiy yig'ilishida hal qilinadi.",
    category: KnowledgeCategory.CORPORATE,
    tags: ["kuzatuv kengashi", "yirik bitim", "vakolat"],
  },
  {
    question: "Talabnoma yuborilgandan keyin qancha kutib sudga murojaat qilinadi?",
    answer:
      "Xo'jalik nizolarida talabnomaga javob berish muddati 30 kun (shartnomada boshqa muddat nazarda tutilmagan bo'lsa). Javob olinmasa yoki rad etilsa, sudga da'vo arizasi kiritiladi. Talabnoma yuborilganligini tasdiqlovchi pochta kvitansiyasi da'voga ilova qilinadi.",
    category: KnowledgeCategory.PROCEDURE,
    tags: ["talabnoma", "sud", "muddat"],
  },
  {
    question: "Kredit shartnomasiga bir tomonlama foiz o'zgartirish sharti kiritish mumkinmi?",
    answer:
      "Jismoniy shaxslar bilan tuzilgan shartnomalarda foiz stavkasini bir tomonlama oshirish iste'molchilar huquqlarini himoya qilish qonunchiligiga zid. Suzuvchi stavka faqat aniq formula (masalan, MB asosiy stavkasi + marja) orqali belgilanishi mumkin.",
    category: KnowledgeCategory.CREDIT,
    tags: ["foiz stavkasi", "iste'molchi", "kredit shartnomasi"],
  },
  {
    question: "Garov predmeti sug'urtasi muddati o'tsa, bank qanday harakat qiladi?",
    answer:
      "Garovga qo'yuvchiga sug'urtani 10 kun ichida yangilash to'g'risida xabarnoma yuboriladi. Yangilanmasa, kredit shartnomasi shartlariga ko'ra bank kreditni muddatidan oldin qaytarishni talab qilishga yoki sug'urtani o'zi rasmiylashtirib, xarajatni qarzdordan undirishga haqli.",
    category: KnowledgeCategory.COLLATERAL,
    tags: ["sug'urta", "garov", "xabarnoma"],
  },
  {
    question: "Vafot etgan mijoz omonati merosxo'rlarga qanday to'lanadi?",
    answer:
      "Merosxo'r notarius tomonidan berilgan meros huquqi to'g'risidagi guvohnoma asosida omonatni oladi. Omonatchi vasiyatnoma (bank vasiyati) qoldirgan bo'lsa, u ko'rsatgan shaxsga to'lanadi. Dafn marosimi xarajatlari uchun guvohnomasiz belgilangan miqdorda to'lov amalga oshirilishi mumkin.",
    category: KnowledgeCategory.PROCEDURE,
    tags: ["omonat", "meros", "to'lov"],
  },
];
