import type { DocumentDetailDTO, OcrDocTypeDTO } from "@/entities/document/document.entry";

//* Sintetik namuna hujjatlar (haqiqiy shaxs yoki tashkilot yo'q) va ular uchun haqiqiy OCR / Word / Excel quvuri bergan natija.
//* Asl fayllar public/demo-files ichida.

export type SeedDocument = Pick<
  DocumentDetailDTO,
  | "originalName"
  | "format"
  | "contentType"
  | "sizeBytes"
  | "sha256"
  | "source"
  | "docType"
  | "language"
  | "confidence"
  | "needsReview"
  | "pageCount"
  | "pages"
  | "fields"
  | "stamps"
  | "warnings"
> & { key: string; url: string };

export const SEED_DOCUMENTS = [
  {
    key: "ishonchnoma",
    url: "/demo-files/ishonchnoma-namuna.pdf",
    originalName: "ishonchnoma-namuna.pdf",
    format: "PDF",
    contentType: "application/pdf",
    sizeBytes: 1663,
    sha256: "aa81a3a9a956fd825e8868f8b66d859eb3958735a3b8f5e6c765f0627164924d",
    source: "OCR",
    docType: "power_of_attorney",
    language: "uz-Latn",
    confidence: 1.0,
    needsReview: true,
    pageCount: 1,
    pages: [
      {
        number: 1,
        source: "text_layer",
        title: null,
        language: "uz-Latn",
        confidence: 1.0,
        blocks: [
          {
            type: "paragraph",
            text: "ISHONCHNOMA No 318",
            level: null,
            rows: null,
            headerRows: null,
            spans: null,
          },
          {
            type: "paragraph",
            text: "Toshkent shahri 2026 yil 3 sentyabr",
            level: null,
            rows: null,
            headerRows: null,
            spans: null,
          },
          {
            type: "paragraph",
            text: '"Namuna Savdo" MChJ (STIR 301234567) nomidan direktor Aliyev Bobur Karimovich',
            level: null,
            rows: null,
            headerRows: null,
            spans: null,
          },
          {
            type: "paragraph",
            text: "ushbu ishonchnoma bilan Saidova Nilufar Rustamovnaga quyidagi vakolatlarni beradi:",
            level: null,
            rows: null,
            headerRows: null,
            spans: null,
          },
          {
            type: "paragraph",
            text: "1. Bankda hisob raqam ochish va yopish;",
            level: null,
            rows: null,
            headerRows: null,
            spans: null,
          },
          {
            type: "paragraph",
            text: "2. Kredit shartnomasi bo'yicha hujjatlarni imzolash;",
            level: null,
            rows: null,
            headerRows: null,
            spans: null,
          },
          {
            type: "paragraph",
            text: "3. Bank bilan yozishmalarni olib borish.",
            level: null,
            rows: null,
            headerRows: null,
            spans: null,
          },
          {
            type: "paragraph",
            text: "Ishonchnoma 2027 yil 31 dekabrgacha amal qiladi.",
            level: null,
            rows: null,
            headerRows: null,
            spans: null,
          },
          {
            type: "paragraph",
            text: "Direktor ____________ B. K. Aliyev",
            level: null,
            rows: null,
            headerRows: null,
            spans: null,
          },
          {
            type: "paragraph",
            text: "Sinov hujjati: barcha nomlar va raqamlar to'qima.",
            level: null,
            rows: null,
            headerRows: null,
            spans: null,
          },
        ],
        text: "ISHONCHNOMA No 318\n\nToshkent shahri                  2026 yil 3 sentyabr\n\n\n\"Namuna Savdo\" MChJ (STIR 301234567) nomidan direktor Aliyev Bobur Karimovich\n\nushbu ishonchnoma bilan Saidova Nilufar Rustamovnaga quyidagi vakolatlarni beradi:\n\n1. Bankda hisob raqam ochish va yopish;\n\n2. Kredit shartnomasi bo'yicha hujjatlarni imzolash;\n\n3. Bank bilan yozishmalarni olib borish.\n\n\nIshonchnoma 2027 yil 31 dekabrgacha amal qiladi.\n\n\nDirektor ____________ B. K. Aliyev\n\nSinov hujjati: barcha nomlar va raqamlar to'qima.",
      },
    ],
    fields: [
      {
        name: "number",
        value: "318",
        quote: "ISHONCHNOMA No 318",
        page: 1,
        confidence: 1.0,
        needsConfirmation: false,
      },
      {
        name: "date",
        value: "2026-09-03",
        quote: "2026 yil 3 sentyabr",
        page: 1,
        confidence: 1.0,
        needsConfirmation: false,
      },
      {
        name: "principal",
        value: "Namuna Savdo MChJ",
        quote: "Namuna Savdo MChJ",
        page: null,
        confidence: 0.5,
        needsConfirmation: true,
      },
      {
        name: "attorney",
        value: "Saidova Nilufar Rustamovna",
        quote: "Saidova Nilufar Rustamovnaga",
        page: 1,
        confidence: 1.0,
        needsConfirmation: false,
      },
      {
        name: "powers",
        value: "Bankda hisob raqam ochish va yopish",
        quote: "Bankda hisob raqam ochish va yopish",
        page: 1,
        confidence: 1.0,
        needsConfirmation: false,
      },
      {
        name: "powers",
        value: "Kredit shartnomasi bo'yicha hujjatlarni imzolash",
        quote: "Kredit shartnomasi bo'yicha hujjatlarni imzolash",
        page: 1,
        confidence: 1.0,
        needsConfirmation: false,
      },
      {
        name: "powers",
        value: "Bank bilan yozishmalarni olib borish",
        quote: "Bank bilan yozishmalarni olib borish",
        page: 1,
        confidence: 1.0,
        needsConfirmation: false,
      },
      {
        name: "valid_until",
        value: "2027-12-31",
        quote: "2027 yil 31 dekabrgacha",
        page: 1,
        confidence: 1.0,
        needsConfirmation: false,
      },
    ],
    stamps: [],
    warnings: [],
  },
  {
    key: "shartnoma",
    url: "/demo-files/shartnoma-namuna.docx",
    originalName: "shartnoma-namuna.docx",
    format: "DOCX",
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    sizeBytes: 3817,
    sha256: "d290f680fd0ebb957faf99a0eef0af5852c75f7c9a3a8ea5f3dd1c4cc5278e8d",
    source: "WORD",
    docType: null,
    language: null,
    confidence: 1.0,
    needsReview: false,
    pageCount: 1,
    pages: [
      {
        number: 1,
        source: "word",
        title: null,
        language: null,
        confidence: 1.0,
        blocks: [
          {
            type: "paragraph",
            text: "KREDIT SHARTNOMASI No 145/2026 (NAMUNA)",
            level: null,
            rows: null,
            headerRows: null,
            spans: null,
          },
          {
            type: "paragraph",
            text: "Toshkent shahri, 2026 yil 15 avgust",
            level: null,
            rows: null,
            headerRows: null,
            spans: null,
          },
          {
            type: "paragraph",
            text: '"Agrobank" ATB (keyingi o\'rinlarda - Bank) va "Namuna Savdo" MChJ (keyingi o\'rinlarda - Qarz oluvchi) quyidagilar haqida shartnoma tuzdilar.',
            level: null,
            rows: null,
            headerRows: null,
            spans: null,
          },
          {
            type: "paragraph",
            text: "1. Shartnoma predmeti",
            level: null,
            rows: null,
            headerRows: null,
            spans: null,
          },
          {
            type: "paragraph",
            text: "Bank Qarz oluvchiga 500 000 000 so'm miqdorida kredit beradi, Qarz oluvchi uni 2028 yil 15 avgustgacha qaytarish majburiyatini oladi.",
            level: null,
            rows: null,
            headerRows: null,
            spans: null,
          },
          {
            type: "paragraph",
            text: "2. Foiz stavkasi",
            level: null,
            rows: null,
            headerRows: null,
            spans: null,
          },
          {
            type: "paragraph",
            text: "Kredit uchun yillik 24 foiz miqdorida foiz to'lanadi.",
            level: null,
            rows: null,
            headerRows: null,
            spans: null,
          },
          {
            type: "paragraph",
            text: "Sinov hujjati: barcha nomlar va raqamlar to'qima.",
            level: null,
            rows: null,
            headerRows: null,
            spans: null,
          },
        ],
        text: "KREDIT SHARTNOMASI No 145/2026 (NAMUNA)\n\nToshkent shahri, 2026 yil 15 avgust\n\n\"Agrobank\" ATB (keyingi o'rinlarda - Bank) va \"Namuna Savdo\" MChJ (keyingi o'rinlarda - Qarz oluvchi) quyidagilar haqida shartnoma tuzdilar.\n\n1. Shartnoma predmeti\n\nBank Qarz oluvchiga 500 000 000 so'm miqdorida kredit beradi, Qarz oluvchi uni 2028 yil 15 avgustgacha qaytarish majburiyatini oladi.\n\n2. Foiz stavkasi\n\nKredit uchun yillik 24 foiz miqdorida foiz to'lanadi.\n\nSinov hujjati: barcha nomlar va raqamlar to'qima.",
      },
    ],
    fields: [],
    stamps: [],
    warnings: [],
  },
  {
    key: "hisobot",
    url: "/demo-files/hisobot-namuna.xlsx",
    originalName: "hisobot-namuna.xlsx",
    format: "XLSX",
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    sizeBytes: 1624,
    sha256: "3c92dfac7d659fcc65d6fdb83eb4fdc9c5a883939d14e199c4db284f97e84410",
    source: "EXCEL",
    docType: null,
    language: null,
    confidence: 1.0,
    needsReview: false,
    pageCount: 1,
    pages: [
      {
        number: 1,
        source: "excel",
        title: "Sud ishlari",
        language: null,
        confidence: 1.0,
        blocks: [
          {
            type: "table",
            text: "Filial | Ishlar soni | Undirilgan (mln so'm)\nAndijon | 12 | 340\nSamarqand | 9 | 215\nJami | 21 | 555",
            level: null,
            rows: [
              ["Filial", "Ishlar soni", "Undirilgan (mln so'm)"],
              ["Andijon", "12", "340"],
              ["Samarqand", "9", "215"],
              ["Jami", "21", "555"],
            ],
            headerRows: null,
            spans: null,
          },
        ],
        text: "Filial | Ishlar soni | Undirilgan (mln so'm)\nAndijon | 12 | 340\nSamarqand | 9 | 215\nJami | 21 | 555",
      },
    ],
    fields: [],
    stamps: [],
    warnings: [],
  },
] as unknown as SeedDocument[];

export const SEED_DOC_TYPES: OcrDocTypeDTO[] = [
  {
    code: "contract",
    labelUz: "Shartnoma",
    labelRu: "Договор",
    fields: [
      {
        name: "number",
        labelUz: "Shartnoma raqami",
        labelRu: "Номер договора",
      },
      {
        name: "date",
        labelUz: "Shartnoma sanasi",
        labelRu: "Дата договора",
      },
      {
        name: "place",
        labelUz: "Tuzilgan joyi",
        labelRu: "Место заключения",
      },
      {
        name: "parties",
        labelUz: "Tomonlar",
        labelRu: "Стороны",
      },
      {
        name: "tins",
        labelUz: "STIR (INN)",
        labelRu: "ИНН",
      },
      {
        name: "subject",
        labelUz: "Shartnoma predmeti",
        labelRu: "Предмет договора",
      },
      {
        name: "amount",
        labelUz: "Summa",
        labelRu: "Сумма",
      },
      {
        name: "currency",
        labelUz: "Valyuta",
        labelRu: "Валюта",
      },
      {
        name: "term",
        labelUz: "Amal qilish muddati",
        labelRu: "Срок действия",
      },
      {
        name: "signatories",
        labelUz: "Imzolovchilar",
        labelRu: "Подписанты",
      },
    ],
  },
  {
    code: "court_decision",
    labelUz: "Sud hujjati",
    labelRu: "Судебный документ",
    fields: [
      {
        name: "court",
        labelUz: "Sud",
        labelRu: "Суд",
      },
      {
        name: "case_number",
        labelUz: "Ish raqami",
        labelRu: "Номер дела",
      },
      {
        name: "date",
        labelUz: "Sana",
        labelRu: "Дата",
      },
      {
        name: "judge",
        labelUz: "Sudya",
        labelRu: "Судья",
      },
      {
        name: "claimant",
        labelUz: "Da'vogar",
        labelRu: "Истец",
      },
      {
        name: "defendant",
        labelUz: "Javobgar",
        labelRu: "Ответчик",
      },
      {
        name: "claim_amount",
        labelUz: "Da'vo summasi",
        labelRu: "Сумма иска",
      },
      {
        name: "currency",
        labelUz: "Valyuta",
        labelRu: "Валюта",
      },
      {
        name: "outcome",
        labelUz: "Qaror mazmuni",
        labelRu: "Резолютивная часть",
      },
    ],
  },
  {
    code: "power_of_attorney",
    labelUz: "Ishonchnoma",
    labelRu: "Доверенность",
    fields: [
      {
        name: "number",
        labelUz: "Ishonchnoma raqami",
        labelRu: "Номер доверенности",
      },
      {
        name: "date",
        labelUz: "Berilgan sana",
        labelRu: "Дата выдачи",
      },
      {
        name: "principal",
        labelUz: "Ishonch bildiruvchi",
        labelRu: "Доверитель",
      },
      {
        name: "attorney",
        labelUz: "Ishonchli vakil",
        labelRu: "Представитель",
      },
      {
        name: "powers",
        labelUz: "Vakolatlar",
        labelRu: "Полномочия",
      },
      {
        name: "valid_until",
        labelUz: "Amal qilish muddati",
        labelRu: "Действует до",
      },
      {
        name: "notary",
        labelUz: "Notarius",
        labelRu: "Нотариус",
      },
    ],
  },
  {
    code: "letter",
    labelUz: "Xat",
    labelRu: "Письмо",
    fields: [
      {
        name: "number",
        labelUz: "Chiquvchi raqam",
        labelRu: "Исходящий номер",
      },
      {
        name: "date",
        labelUz: "Sana",
        labelRu: "Дата",
      },
      {
        name: "sender",
        labelUz: "Jo'natuvchi",
        labelRu: "Отправитель",
      },
      {
        name: "recipient",
        labelUz: "Qabul qiluvchi",
        labelRu: "Получатель",
      },
      {
        name: "subject",
        labelUz: "Mavzu",
        labelRu: "Тема",
      },
      {
        name: "signatory",
        labelUz: "Imzolovchi",
        labelRu: "Подписант",
      },
    ],
  },
  {
    code: "other",
    labelUz: "Boshqa",
    labelRu: "Прочее",
    fields: [
      {
        name: "title",
        labelUz: "Sarlavha",
        labelRu: "Заголовок",
      },
      {
        name: "number",
        labelUz: "Raqam",
        labelRu: "Номер",
      },
      {
        name: "date",
        labelUz: "Sana",
        labelRu: "Дата",
      },
      {
        name: "organizations",
        labelUz: "Tashkilotlar",
        labelRu: "Организации",
      },
    ],
  },
];
