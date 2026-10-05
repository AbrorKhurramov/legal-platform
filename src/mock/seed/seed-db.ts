import { AuditAction, AuditEntityType } from "@/entities/audit/audit.entry";
import { CourtCaseCategory, CourtCaseResult, CourtCaseStage } from "@/entities/court-case/court-case.entry";
import { LegislationStatus } from "@/entities/legislation/legislation.entry";
import {
  ApprovalDecision,
  MatterComplexity,
  MatterHistoryType,
  MatterPriority,
  MatterStatus,
  MatterType,
  OpinionResult,
} from "@/entities/matter/matter.entry";
import { RiskStatus } from "@/entities/risk/risk.entry";
import { UserRole } from "@/entities/user/user.entry";

import type { AuditRecord, CourtCaseRecord, LegislationRecord, MatterRecord, MockDatabase, RiskRecord, UserRecord } from "../mock-db.types";
import { calcRiskLevel } from "../mock-rules";
import { type Random, addDays, createRandom, daysFromNow, notInFuture } from "./random";
import { CITIZENS, COUNTERPARTIES, COURTS, DEPUTY_ID, DIRECTOR_ID, IPS, SEED_BRANCHES, SEED_USERS } from "./seed-dictionary";
import { KNOWLEDGE_SEED } from "./seed-knowledge";
import { LEGISLATION_SEED, RISK_SEED } from "./seed-registries";

export const MOCK_DB_VERSION = 5;

const MATTER_COUNT = 236;
const COURT_COUNT = 42;
const AUDIT_COUNT = 160;
const YEAR = new Date().getFullYear();

const CONTRACT_SUBJECTS = [
  "kompyuter texnikasi yetkazib berish",
  "ofis binosini ijaraga olish",
  "ipoteka (garov) shartnomasi",
  "kredit liniyasi ochish",
  "qo'riqlash xizmatlari ko'rsatish",
  "dasturiy ta'minot litsenziyasi",
  "xizmat avtomobillari lizingi",
  "bank kartalarini ishlab chiqarish",
  "kassa uzellarini ta'mirlash",
  "call-markaz xizmatlari",
];

const INTERNAL_DOCS = [
  "Kredit siyosati to'g'risidagi nizomga o'zgartirishlar",
  "Ichki nazorat qoidalarining yangi tahriri",
  "Mijozlarni identifikatsiya qilish (KYC) tartibi",
  "Bank sirini saqlash bo'yicha yo'riqnoma",
  "Shaxsga doir ma'lumotlarni qayta ishlash nizomi",
  "Xodimlarni rag'batlantirish tartibi",
  "Garov mulkini baholash yo'riqnomasi",
  "Masofaviy bank xizmatlari ko'rsatish qoidalari",
];

const BANK_DECISIONS = [
  "filiallar tarmog'ini optimallashtirish",
  "muammoli kreditlarni hisobdan chiqarish",
  "yangi omonat mahsulotini joriy etish",
  "tarif siyosatini o'zgartirish",
  "xizmat avtomobillarini auksionda sotish",
];

const CONSULTATIONS = [
  "garov mulkini suddan tashqari undirish imkoniyati",
  "merosxo'rlardan kredit qarzini undirish tartibi",
  "ishonchnoma asosida hisob raqam ochish",
  "yakka tartibdagi tadbirkor bilan kafillik shartnomasi",
  "xodimni intizomiy javobgarlikka tortish tartibi",
  "vafot etgan mijoz omonatini merosxo'rlarga to'lash",
  "sug'urta polisi muddati o'tgan garov bo'yicha harakatlar",
];

const CLAIMS = ["qarzdorlik bo'yicha talabnoma", "kafilga ogohlantirish xati", "kredit qarzini undirish bo'yicha da'vo arizasi"];

const CORPORATE = [
  "Aksiyadorlar umumiy yig'ilishi bayonnomasi loyihasi",
  "Kuzatuv kengashi qarori loyihasi",
  "Sho'ba korxona ustaviga o'zgartirishlar",
  "Boshqaruv majlisi topshiriqlari reestrini yangilash",
];

const APPEALS = [
  "kredit foizini qayta ko'rib chiqish",
  "garovni ozod qilish",
  "karta hisobidan yechilgan mablag'ni qaytarish",
  "kredit tarixini to'g'rilash",
];

const OTHER = ["Prokuratura so'roviga javob tayyorlash", "Soliq organi so'roviga javob", "Markaziy bank ko'rsatmasi bo'yicha tushuntirish"];

const buildMatterContent = (random: Random, type: MatterType, branchName: string) => {
  const counterparty = random.pick(COUNTERPARTIES);
  switch (type) {
    case MatterType.CONTRACT_REVIEW: {
      const subject = random.pick(CONTRACT_SUBJECTS);
      return {
        title: `${counterparty} bilan ${subject} shartnomasi loyihasi`,
        description: `${counterparty} bilan tuziladigan ${subject} shartnomasi loyihasini huquqiy ekspertizadan o'tkazish so'raladi. Shartnoma bo'yicha to'lov shartlari, tomonlarning javobgarligi, nizolarni hal etish tartibi va bank manfaatlarini himoya qiluvchi bandlarni tekshirish talab etiladi.`,
        counterparty,
        contractAmount: random.int(12, 950) * 10_000_000,
      };
    }
    case MatterType.INTERNAL_DOC_REVIEW:
      return {
        title: random.pick(INTERNAL_DOCS),
        description:
          "Ichki hujjat loyihasini amaldagi qonunchilik, Markaziy bank talablari va bankning boshqa ichki hujjatlariga muvofiqligi yuzasidan ko'rib chiqish, huquqiy xulosa berish va vizalash so'raladi.",
        counterparty: null,
        contractAmount: null,
      };
    case MatterType.BANK_DECISION_REVIEW:
      return {
        title: `Boshqaruv qarori loyihasi: ${random.pick(BANK_DECISIONS)}`,
        description:
          "Bank Boshqaruvi qarori loyihasi organlar vakolati va ustav talablariga muvofiqligi nuqtai nazaridan ko'rib chiqilishi, zarur hollarda tahririy takliflar berilishi kerak.",
        counterparty: null,
        contractAmount: null,
      };
    case MatterType.LEGAL_CONSULTATION:
      return {
        title: `${branchName}: ${random.pick(CONSULTATIONS)}`,
        description:
          "Filial amaliyotida yuzaga kelgan holat bo'yicha huquqiy maslahat so'raladi. Mijoz hujjatlari ilova qilingan, amaldagi qonunchilik asosida harakatlar tartibini tushuntirib berishingizni so'raymiz.",
        counterparty: null,
        contractAmount: null,
      };
    case MatterType.CLAIM_PREPARATION:
      return {
        title: `${counterparty}ga ${random.pick(CLAIMS)}`,
        description:
          "Kredit shartnomasi bo'yicha muddati o'tgan qarzdorlik yuzaga kelgan. Sudgacha bo'lgan choralarni ko'rish va zarur bo'lsa da'vo hujjatlarini tayyorlash so'raladi.",
        counterparty,
        contractAmount: random.int(5, 300) * 10_000_000,
      };
    case MatterType.CORPORATE_SUPPORT:
      return {
        title: random.pick(CORPORATE),
        description:
          "Korporativ boshqaruv organi majlisi uchun hujjat loyihasini tayyorlash va organlar vakolati doirasiga muvofiqligini tekshirish.",
        counterparty: null,
        contractAmount: null,
      };
    case MatterType.CITIZEN_APPEAL:
      return {
        title: `Fuqaro ${random.pick(CITIZENS)} murojaati: ${random.pick(APPEALS)}`,
        description:
          "Jismoniy shaxs murojaati bo'yicha bankning huquqiy pozitsiyasini aniqlash va murojaatga javob loyihasini tayyorlash kerak. Javob muddati qonunchilikda belgilangan.",
        counterparty: null,
        contractAmount: null,
      };
    default:
      return {
        title: random.pick(OTHER),
        description: "Vakolatli organ so'roviga bank nomidan javob loyihasini tayyorlash va tegishli hujjatlarni ilova qilish.",
        counterparty: null,
        contractAmount: null,
      };
  }
};

const OPINION_TEXTS: Record<OpinionResult, string> = {
  [OpinionResult.POSITIVE]:
    "Taqdim etilgan loyiha amaldagi qonunchilik hujjatlari va bankning ichki talablariga muvofiq. Bank manfaatlarini himoya qiluvchi bandlar yetarli darajada nazarda tutilgan. Loyihani imzolash (tasdiqlash) uchun huquqiy to'siqlar mavjud emas.",
  [OpinionResult.WITH_REMARKS]:
    "Loyiha asosan qonunchilik talablariga mos, biroq quyidagi e'tirozlar bartaraf etilishi lozim:\n1. Kontragent javobgarligi bandida neustoyka miqdori aniq belgilanmagan.\n2. Nizolarni hal etish bandida sudlovlilik ko'rsatilmagan.\n3. Shartnoma muddatini bir tomonlama uzaytirish sharti bank uchun xatarli.\nE'tirozlar inobatga olingan taqdirda loyihani imzolash mumkin.",
  [OpinionResult.NEGATIVE]:
    "Loyiha qonunchilik talablariga zid bandlarni o'z ichiga oladi (bank siri to'g'risidagi qonun talablari buzilishi xavfi, uchinchi shaxslarga ma'lumot uzatish sharti). Loyihani joriy tahrirda imzolash tavsiya etilmaydi.",
};

const COMPLEXITY_BY_TYPE: Partial<Record<MatterType, MatterComplexity[]>> = {
  [MatterType.LEGAL_CONSULTATION]: [MatterComplexity.SIMPLE, MatterComplexity.SIMPLE, MatterComplexity.MEDIUM],
  [MatterType.CITIZEN_APPEAL]: [MatterComplexity.SIMPLE, MatterComplexity.MEDIUM],
  [MatterType.CONTRACT_REVIEW]: [MatterComplexity.MEDIUM, MatterComplexity.COMPLEX, MatterComplexity.SIMPLE],
  [MatterType.BANK_DECISION_REVIEW]: [MatterComplexity.COMPLEX, MatterComplexity.MEDIUM],
};

const TYPE_WEIGHTS: ReadonlyArray<readonly [MatterType, number]> = [
  [MatterType.CONTRACT_REVIEW, 34],
  [MatterType.INTERNAL_DOC_REVIEW, 14],
  [MatterType.BANK_DECISION_REVIEW, 8],
  [MatterType.LEGAL_CONSULTATION, 20],
  [MatterType.CLAIM_PREPARATION, 8],
  [MatterType.CORPORATE_SUPPORT, 6],
  [MatterType.CITIZEN_APPEAL, 7],
  [MatterType.OTHER, 3],
];

const STATUS_WEIGHTS: ReadonlyArray<readonly [MatterStatus, number]> = [
  [MatterStatus.NEW, 4],
  [MatterStatus.ASSIGNED, 5],
  [MatterStatus.IN_REVIEW, 10],
  [MatterStatus.INCOMPLETE_DOCS, 4],
  [MatterStatus.ON_APPROVAL, 5],
  [MatterStatus.COMPLETED, 68],
  [MatterStatus.REJECTED, 4],
];

const SLA_DAYS: Record<MatterPriority, number> = {
  [MatterPriority.LOW]: 10,
  [MatterPriority.MEDIUM]: 7,
  [MatterPriority.HIGH]: 5,
  [MatterPriority.CRITICAL]: 2,
};

const pad = (value: number, size = 4) => String(value).padStart(size, "0");

const buildMatter = (random: Random, index: number, users: UserRecord[]): MatterRecord => {
  const initiators = users.filter((user) => user.role === UserRole.BRANCH || user.role === UserRole.HEAD_OFFICE);
  const lawyers = users.filter((user) => user.role === UserRole.LAWYER);
  const initiator = random.pick(initiators);
  const branch = SEED_BRANCHES.find((item) => item.id === initiator.branchId) ?? SEED_BRANCHES[0];
  const type = random.weighted(TYPE_WEIGHTS);
  const status = random.weighted(STATUS_WEIGHTS);
  const priority = random.weighted([
    [MatterPriority.LOW, 18],
    [MatterPriority.MEDIUM, 50],
    [MatterPriority.HIGH, 25],
    [MatterPriority.CRITICAL, 7],
  ] as const);
  const complexity = random.pick(COMPLEXITY_BY_TYPE[type] ?? [MatterComplexity.MEDIUM, MatterComplexity.SIMPLE]);
  const isClosed = status === MatterStatus.COMPLETED || status === MatterStatus.REJECTED;
  const ageDays = isClosed
    ? random.int(6, 178)
    : random.weighted([
        [random.int(0, 9), 70],
        [random.int(10, 30), 30],
      ] as const);
  const createdAt = daysFromNow(-ageDays, random.int(9, 17));
  const dueDate = addDays(createdAt, SLA_DAYS[priority] + (complexity === MatterComplexity.COMPLEX ? 5 : 0));
  const content = buildMatterContent(random, type, branch.name);
  const lawyer = status === MatterStatus.NEW ? null : random.pick(lawyers);
  const id = `m-${pad(index + 1)}`;

  const history: MatterRecord["history"] = [
    { id: `${id}-h1`, type: MatterHistoryType.CREATED, userId: initiator.id, createdAt, comment: null, fromStatus: null, toStatus: MatterStatus.NEW },
  ];
  if (lawyer) {
    history.push({
      id: `${id}-h2`,
      type: MatterHistoryType.ASSIGNED,
      userId: DIRECTOR_ID,
      createdAt: addDays(createdAt, 0.2),
      comment: `Mas'ul yurist: ${lawyer.fullName}`,
      fromStatus: MatterStatus.NEW,
      toStatus: MatterStatus.ASSIGNED,
    });
  }

  const documents: MatterRecord["documents"] = [
    {
      id: `${id}-d1`,
      version: 1,
      fileName: `${content.title.slice(0, 40).replace(/[“”"]/g, "")}.docx`,
      size: random.int(40, 2400) * 1024,
      uploadedById: initiator.id,
      uploadedAt: createdAt,
      comment: null,
    },
  ];

  let pausedAt: string | null = null;
  let pausedDays = 0;
  if (status === MatterStatus.INCOMPLETE_DOCS) {
    pausedAt = daysFromNow(-random.int(0, 3));
    history.push({
      id: `${id}-h3`,
      type: MatterHistoryType.STATUS_CHANGED,
      userId: lawyer!.id,
      createdAt: pausedAt,
      comment: "Kontragentning ta'sis hujjatlari va vakolatni tasdiqlovchi ishonchnoma taqdim etilmagan.",
      fromStatus: MatterStatus.IN_REVIEW,
      toStatus: MatterStatus.INCOMPLETE_DOCS,
    });
  }

  if ([MatterStatus.IN_REVIEW, MatterStatus.ON_APPROVAL, MatterStatus.COMPLETED].includes(status) && random.chance(0.45)) {
    pausedDays = random.int(1, 4);
    documents.push({
      id: `${id}-d2`,
      version: 2,
      fileName: documents[0].fileName.replace(".docx", " (tahrir 2).docx"),
      size: random.int(40, 2400) * 1024,
      uploadedById: initiator.id,
      uploadedAt: addDays(createdAt, 1.5),
      comment: "Yurist e'tirozlari asosida qayta ishlangan tahrir",
    });
    history.push({
      id: `${id}-h4`,
      type: MatterHistoryType.DOCUMENT_UPLOADED,
      userId: initiator.id,
      createdAt: addDays(createdAt, 1.5),
      comment: "Hujjatning 2-versiyasi yuklandi",
      fromStatus: MatterStatus.INCOMPLETE_DOCS,
      toStatus: MatterStatus.IN_REVIEW,
    });
  }

  let opinion: MatterRecord["opinion"] = null;
  let approvals: MatterRecord["approvals"] = [];
  let completedAt: string | null = null;
  let finalResult: string | null = null;

  if (status === MatterStatus.ON_APPROVAL || status === MatterStatus.COMPLETED) {
    const result = random.weighted([
      [OpinionResult.POSITIVE, 55],
      [OpinionResult.WITH_REMARKS, 35],
      [OpinionResult.NEGATIVE, 10],
    ] as const);
    const opinionAt = addDays(createdAt, random.int(1, SLA_DAYS[priority] + 3));
    opinion = {
      id: `${id}-op`,
      number: "",
      result,
      text: OPINION_TEXTS[result],
      lawyerId: lawyer!.id,
      createdAt: opinionAt,
      isAiDraft: random.chance(0.2),
    };
    history.push({
      id: `${id}-h5`,
      type: MatterHistoryType.OPINION_SUBMITTED,
      userId: lawyer!.id,
      createdAt: opinionAt,
      comment: null,
      fromStatus: MatterStatus.IN_REVIEW,
      toStatus: MatterStatus.ON_APPROVAL,
    });
    const chain = complexity === MatterComplexity.SIMPLE ? [DEPUTY_ID] : [DEPUTY_ID, DIRECTOR_ID];
    approvals = chain.map((approverId, chainIndex) => ({
      id: `${id}-a${chainIndex}`,
      approverId,
      decision: ApprovalDecision.PENDING,
      comment: null,
      decidedAt: null,
    }));

    if (status === MatterStatus.COMPLETED) {
      completedAt = addDays(opinionAt, random.int(0, 2) + 0.3);
      approvals = approvals.map((approval) => ({ ...approval, decision: ApprovalDecision.APPROVED, decidedAt: completedAt }));
      finalResult =
        result === OpinionResult.NEGATIVE
          ? "Loyiha imzolanmadi, tashabbuskorga qaytarildi."
          : "Huquqiy xulosa tasdiqlandi, hujjat imzolashga yuborildi.";
      history.push({
        id: `${id}-h6`,
        type: MatterHistoryType.APPROVED,
        userId: chain[chain.length - 1],
        createdAt: completedAt,
        comment: null,
        fromStatus: MatterStatus.ON_APPROVAL,
        toStatus: MatterStatus.COMPLETED,
      });
    } else if (random.chance(0.5) && chain.length > 1) {
      approvals[0] = { ...approvals[0], decision: ApprovalDecision.APPROVED, decidedAt: addDays(opinionAt, 0.5) };
    }
  }

  if (status === MatterStatus.REJECTED) {
    completedAt = addDays(createdAt, random.int(1, 4));
    finalResult = "Murojaat yuridik departament vakolatiga kirmaydi, tegishli bo'linmaga yo'naltirildi.";
    history.push({
      id: `${id}-h7`,
      type: MatterHistoryType.REJECTED,
      userId: lawyer?.id ?? DIRECTOR_ID,
      createdAt: completedAt,
      comment: finalResult,
      fromStatus: MatterStatus.IN_REVIEW,
      toStatus: MatterStatus.REJECTED,
    });
  }

  if (status === MatterStatus.IN_REVIEW || status === MatterStatus.ON_APPROVAL) {
    history.splice(2, 0, {
      id: `${id}-h8`,
      type: MatterHistoryType.STATUS_CHANGED,
      userId: lawyer!.id,
      createdAt: addDays(createdAt, 0.4),
      comment: null,
      fromStatus: MatterStatus.ASSIGNED,
      toStatus: MatterStatus.IN_REVIEW,
    });
  }

  history.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  history.forEach((item, historyIndex) => (item.createdAt = notInFuture(item.createdAt, (history.length - historyIndex) * 7)));
  documents.forEach((document) => (document.uploadedAt = notInFuture(document.uploadedAt, 30)));
  approvals.forEach((approval) => approval.decidedAt && (approval.decidedAt = notInFuture(approval.decidedAt, 8)));
  if (opinion) opinion.createdAt = notInFuture(opinion.createdAt, 20);
  if (completedAt) completedAt = notInFuture(completedAt, 8);

  return {
    id,
    number: `YD-${YEAR}-${pad(index + 1)}`,
    title: content.title,
    type,
    status,
    priority,
    complexity,
    confidential: type === MatterType.BANK_DECISION_REVIEW ? random.chance(0.5) : random.chance(0.07),
    description: content.description,
    initiatorId: initiator.id,
    branchId: branch.id,
    lawyerId: lawyer?.id ?? null,
    createdAt,
    dueDate: addDays(dueDate, pausedDays),
    completedAt,
    pausedAt,
    pausedDays,
    counterparty: content.counterparty,
    contractAmount: content.contractAmount,
    finalResult,
    documents,
    approvals,
    opinion,
    history,
  };
};

const COURT_SUBJECTS: Record<CourtCaseCategory, string[]> = {
  [CourtCaseCategory.BANK_CLAIM]: [
    "Kredit shartnomasi bo'yicha asosiy qarz va foizlarni undirish",
    "Garov mulkiga undiruv qaratish",
    "Kafillardan solidar tartibda qarzni undirish",
  ],
  [CourtCaseCategory.CLAIM_AGAINST_BANK]: [
    "Kredit shartnomasini haqiqiy emas deb topish",
    "Yetkazilgan ma'naviy zararni undirish",
    "Garov shartnomasini bekor qilish",
    "Mehnat shartnomasini bekor qilish buyrug'ini nizolash",
  ],
  [CourtCaseCategory.ENFORCEMENT]: [
    "Ijro varaqasi bo'yicha qarzdor mol-mulkini realizatsiya qilish",
    "Majburiy ijro byurosi harakatlari ustidan shikoyat",
  ],
};

const buildCourtCase = (random: Random, index: number, users: UserRecord[]): CourtCaseRecord => {
  const lawyers = users.filter((user) => user.role === UserRole.LAWYER);
  const category = random.weighted([
    [CourtCaseCategory.BANK_CLAIM, 60],
    [CourtCaseCategory.CLAIM_AGAINST_BANK, 25],
    [CourtCaseCategory.ENFORCEMENT, 15],
  ] as const);
  const stage = random.weighted([
    [CourtCaseStage.PRE_TRIAL, 12],
    [CourtCaseStage.FIRST_INSTANCE, 30],
    [CourtCaseStage.APPEAL, 12],
    [CourtCaseStage.CASSATION, 5],
    [CourtCaseStage.ENFORCEMENT, 14],
    [CourtCaseStage.CLOSED, 45],
  ] as const);
  const isClosed = stage === CourtCaseStage.CLOSED;
  const result = isClosed
    ? random.weighted([
        [CourtCaseResult.WON, 58],
        [CourtCaseResult.PARTIAL, 18],
        [CourtCaseResult.LOST, 12],
        [CourtCaseResult.SETTLED, 12],
      ] as const)
    : stage === CourtCaseStage.ENFORCEMENT
      ? CourtCaseResult.WON
      : CourtCaseResult.PENDING;
  const claimAmount = random.int(3, 420) * 5_000_000;
  const recoveredAmount =
    result === CourtCaseResult.WON
      ? Math.round((claimAmount * (isClosed ? random.int(70, 100) : random.int(10, 60))) / 100)
      : result === CourtCaseResult.PARTIAL || result === CourtCaseResult.SETTLED
        ? Math.round((claimAmount * random.int(30, 70)) / 100)
        : 0;
  const branch = random.pick(SEED_BRANCHES.slice(1));
  const counterparty = random.chance(0.7) ? random.pick(COUNTERPARTIES) : `fuqaro ${random.pick(CITIZENS)}`;
  const filedAt = daysFromNow(-random.int(20, 360));
  const nextHearingDate = isClosed || stage === CourtCaseStage.ENFORCEMENT ? null : daysFromNow(random.int(-2, 40), random.int(9, 16));
  const bankName = "“Agrobank” ATB";
  const id = `c-${pad(index + 1)}`;

  return {
    id,
    caseNumber: `4-${random.int(1001, 1399)}-${String(YEAR).slice(2)}${pad(random.int(1, 12), 2)}/${random.int(100, 9999)}`,
    category,
    stage,
    result,
    plaintiff: category === CourtCaseCategory.CLAIM_AGAINST_BANK ? counterparty : bankName,
    defendant: category === CourtCaseCategory.CLAIM_AGAINST_BANK ? bankName : counterparty,
    court: random.pick(COURTS),
    subject: random.pick(COURT_SUBJECTS[category]),
    claimAmount,
    recoveredAmount,
    lawyerId: random.pick(lawyers).id,
    branchId: branch.id,
    nextHearingDate,
    filedAt,
    deadlines: [
      { id: `${id}-dl1`, title: "Talabnoma yuborish", date: addDays(filedAt, -25), isDone: true },
      { id: `${id}-dl2`, title: "Da'vo arizasini sudga kiritish", date: filedAt, isDone: true },
      {
        id: `${id}-dl3`,
        title: "Sud majlisiga dalillar taqdim etish",
        date: nextHearingDate ? addDays(nextHearingDate, -3) : addDays(filedAt, 30),
        isDone: isClosed || random.chance(0.4),
      },
      { id: `${id}-dl4`, title: "Apellyatsiya shikoyati berish muddati", date: addDays(filedAt, 75), isDone: isClosed },
    ],
    events: [
      {
        id: `${id}-e1`,
        date: filedAt,
        title: "Da'vo arizasi qabul qilindi",
        description: `${random.pick(COURTS)} tomonidan ish yuritishga qabul qilindi.`,
      },
      ...(stage !== CourtCaseStage.PRE_TRIAL
        ? [
            {
              id: `${id}-e2`,
              date: addDays(filedAt, 21),
              title: "Dastlabki sud majlisi",
              description: "Tomonlar tushuntirishlari tinglandi, qo'shimcha dalillar talab qilindi.",
            },
          ]
        : []),
      ...(isClosed
        ? [{ id: `${id}-e3`, date: addDays(filedAt, 60), title: "Hal qiluv qarori chiqarildi", description: "Sud qarori qonuniy kuchga kirdi." }]
        : []),
    ],
    documents: [
      { id: `${id}-doc1`, name: "Da'vo arizasi.pdf", uploadedAt: filedAt },
      { id: `${id}-doc2`, name: "Kredit shartnomasi nusxasi.pdf", uploadedAt: filedAt },
      ...(isClosed ? [{ id: `${id}-doc3`, name: "Sud hal qiluv qarori.pdf", uploadedAt: addDays(filedAt, 60) }] : []),
    ],
  };
};

const buildLegislation = (users: UserRecord[]): LegislationRecord[] => {
  const lawyers = users.filter((user) => user.role === UserRole.LAWYER);
  return LEGISLATION_SEED.map((item, index) => {
    const id = `l-${pad(index + 1, 3)}`;
    const tasks = item.tasks.map((title, taskIndex) => ({
      id: `${id}-t${taskIndex}`,
      title,
      assigneeId: lawyers[(index + taskIndex) % lawyers.length].id,
      dueDate: daysFromNow(item.effectiveInDays - 5 + taskIndex * 2),
      isDone: item.status === LegislationStatus.IMPLEMENTED || (item.status === LegislationStatus.TASKS_ASSIGNED && taskIndex === 0),
    }));
    return {
      id,
      title: item.title,
      docNumber: item.docNumber,
      source: item.source,
      publishedAt: daysFromNow(item.publishedDaysAgo * -1),
      effectiveAt: daysFromNow(item.effectiveInDays),
      impactLevel: item.impactLevel,
      status: item.status,
      responsibleId: lawyers[index % lawyers.length].id,
      summary: item.summary,
      affectedDocuments: item.affectedDocuments.map((document, docIndex) => ({ id: `${id}-ad${docIndex}`, ...document })),
      tasks: item.status === LegislationStatus.NEW ? [] : tasks,
    };
  });
};

const buildRisks = (random: Random, users: UserRecord[], matters: MatterRecord[]): RiskRecord[] => {
  const owners = users.filter((user) => user.role === UserRole.LAWYER || user.role === UserRole.HEAD);
  return RISK_SEED.map((item, index) => {
    const probability = random.int(1, 5);
    const impact = random.int(2, 5);
    const status = random.weighted([
      [RiskStatus.IDENTIFIED, 30],
      [RiskStatus.MITIGATING, 35],
      [RiskStatus.CONTROLLED, 20],
      [RiskStatus.CLOSED, 15],
    ] as const);
    const owner = random.pick(owners);
    const id = `r-${pad(index + 1, 3)}`;
    const createdAt = daysFromNow(-random.int(10, 90));
    return {
      id,
      code: `XR-${pad(index + 1, 3)}`,
      title: item.title,
      category: item.category,
      level: calcRiskLevel(probability, impact),
      probability,
      impact,
      status,
      ownerId: owner.id,
      branchId: random.pick(SEED_BRANCHES).id,
      dueDate: daysFromNow(random.int(-10, 60)),
      relatedMatterNumber: random.chance(0.5) ? random.pick(matters).number : null,
      description: item.description,
      mitigation: item.mitigation,
      notes: [
        { id: `${id}-n1`, createdAt, authorId: owner.id, text: "Xatar aniqlandi va reestrga kiritildi." },
        ...(status !== RiskStatus.IDENTIFIED
          ? [
              {
                id: `${id}-n2`,
                createdAt: addDays(createdAt, 7),
                authorId: owner.id,
                text: "Bartaraf etish choralari bo'yicha mas'ul bo'linmalarga topshiriq berildi.",
              },
            ]
          : []),
      ],
    };
  });
};

const AUDIT_TEMPLATES: ReadonlyArray<readonly [AuditAction, AuditEntityType, string]> = [
  [AuditAction.LOGIN, AuditEntityType.AUTH, "Tizimga kirdi"],
  [AuditAction.VIEW, AuditEntityType.MATTER, "Murojaat kartasini ko'rdi"],
  [AuditAction.VIEW, AuditEntityType.MATTER, "Murojaat hujjatini ochdi"],
  [AuditAction.CREATE, AuditEntityType.MATTER, "Yangi murojaat yaratdi"],
  [AuditAction.ASSIGN, AuditEntityType.MATTER, "Mas'ul yurist biriktirdi"],
  [AuditAction.UPLOAD, AuditEntityType.MATTER, "Hujjat versiyasini yukladi"],
  [AuditAction.APPROVE, AuditEntityType.MATTER, "Huquqiy xulosani vizaladi"],
  [AuditAction.RETURN, AuditEntityType.MATTER, "Xulosani qayta ishlashga qaytardi"],
  [AuditAction.UPDATE, AuditEntityType.COURT_CASE, "Sud ishi bosqichini yangiladi"],
  [AuditAction.UPDATE, AuditEntityType.RISK, "Xatar holatini o'zgartirdi"],
  [AuditAction.VIEW, AuditEntityType.LEGISLATION, "Qonunchilik o'zgarishini ko'rdi"],
  [AuditAction.LOGOUT, AuditEntityType.AUTH, "Tizimdan chiqdi"],
];

const buildAudit = (random: Random, users: UserRecord[], matters: MatterRecord[]): AuditRecord[] =>
  Array.from({ length: AUDIT_COUNT }, (_, index) => {
    const [action, entityType, details] = random.pick(AUDIT_TEMPLATES);
    return {
      id: `au-${pad(index + 1, 5)}`,
      createdAt: daysFromNow(-random.int(0, 30), random.int(8, 19)),
      userId: random.pick(users).id,
      action,
      entityType,
      entityRef: entityType === AuditEntityType.MATTER ? random.pick(matters).number : null,
      ip: random.pick(IPS),
      details,
    };
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const createSeedDatabase = (): MockDatabase => {
  const random = createRandom(20260928);
  const users = SEED_USERS;
  const matters = Array.from({ length: MATTER_COUNT }, (_, index) => buildMatter(random, index, users)).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  let opinionCounter = 0;
  [...matters].reverse().forEach((matter) => {
    if (matter.opinion) matter.opinion.number = `HX-${YEAR}-${pad(++opinionCounter)}`;
  });

  return {
    version: MOCK_DB_VERSION,
    branches: SEED_BRANCHES,
    users,
    matters,
    courtCases: Array.from({ length: COURT_COUNT }, (_, index) => buildCourtCase(random, index, users)).sort((a, b) =>
      b.filedAt.localeCompare(a.filedAt),
    ),
    legislation: buildLegislation(users),
    risks: buildRisks(random, users, matters),
    knowledge: KNOWLEDGE_SEED.map((item, index) => ({
      ...item,
      id: `k-${pad(index + 1, 3)}`,
      authorId: users.filter((user) => user.role === UserRole.LAWYER)[index % 6].id,
      usageCount: random.int(2, 140),
      updatedAt: daysFromNow(-random.int(3, 200)),
      sourceMatterNumber: random.chance(0.4) ? random.pick(matters).number : null,
    })),
    audit: buildAudit(random, users, matters),
    counters: { matter: MATTER_COUNT, opinion: opinionCounter, court: COURT_COUNT, risk: RISK_SEED.length },
  };
};
