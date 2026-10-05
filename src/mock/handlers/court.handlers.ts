import { AuditAction, AuditEntityType } from "@/entities/audit/audit.entry";
import { CourtCaseCategory, CourtCaseResult, CourtCaseStage } from "@/entities/court-case/court-case.entry";

import { getDb } from "../mock-db";
import type { CourtCaseRecord, MockDatabase } from "../mock-db.types";
import { mockRoute } from "../mock-router";
import { toBranchRef, toShortUser } from "../mock-rules";
import { fail, matchesSearch, message, nowIso, ok, paginate, writeAudit } from "../mock-utils";
import { addDays, createId, startOfToday } from "../seed/random";

const toListItem = (db: MockDatabase, item: CourtCaseRecord) => {
  const { deadlines: _deadlines, events: _events, documents: _documents, subject: _subject, lawyerId, branchId, ...rest } = item;
  return { ...rest, lawyer: toShortUser(db, lawyerId), branch: toBranchRef(db, branchId) };
};

const toDetail = (db: MockDatabase, item: CourtCaseRecord) => ({
  ...toListItem(db, item),
  subject: item.subject,
  deadlines: [...item.deadlines].sort((a, b) => a.date.localeCompare(b.date)),
  events: [...item.events].sort((a, b) => b.date.localeCompare(a.date)),
  documents: item.documents,
});

const RESULTS: CourtCaseResult[] = [
  CourtCaseResult.PENDING,
  CourtCaseResult.WON,
  CourtCaseResult.PARTIAL,
  CourtCaseResult.LOST,
  CourtCaseResult.SETTLED,
];

export const registerCourtHandlers = () => {
  mockRoute("get", "/court-service/court-cases/statistics", () => {
    const db = getDb();
    const cases = db.courtCases;
    const today = startOfToday();
    return ok({
      total: cases.length,
      active: cases.filter((item) => item.stage !== CourtCaseStage.CLOSED).length,
      byResult: RESULTS.map((result) => ({ result, count: cases.filter((item) => item.result === result).length })),
      claimTotal: cases.filter((item) => item.category !== CourtCaseCategory.CLAIM_AGAINST_BANK).reduce((sum, item) => sum + item.claimAmount, 0),
      recoveredTotal: cases.reduce((sum, item) => sum + item.recoveredAmount, 0),
      upcomingHearings: cases
        .filter((item) => item.nextHearingDate && new Date(item.nextHearingDate).getTime() >= today)
        .sort((a, b) => a.nextHearingDate!.localeCompare(b.nextHearingDate!))
        .slice(0, 6)
        .map((item) => ({ id: item.id, caseNumber: item.caseNumber, court: item.court, defendant: item.defendant, date: item.nextHearingDate! })),
    });
  });

  mockRoute("get", "/court-service/court-cases", (request) => {
    const db = getDb();
    const { search, category, stage, result } = request.query;
    const items = db.courtCases
      .filter((item) => !category || item.category === category)
      .filter((item) => !stage || item.stage === stage)
      .filter((item) => !result || item.result === result)
      .filter((item) => matchesSearch(search, item.caseNumber, item.plaintiff, item.defendant, item.court))
      .map((item) => toListItem(db, item));
    return ok(paginate(items, request.query));
  });

  mockRoute("get", "/court-service/court-cases/:id", (request) => {
    const db = getDb();
    const item = db.courtCases.find((record) => record.id === request.params.id);
    return item ? ok(toDetail(db, item)) : fail(request, 404, "notFound");
  });

  mockRoute("post", "/court-service/court-cases", (request) => {
    const db = getDb();
    const body = request.body;
    if (!body.category || !body.plaintiff || !body.defendant || !body.court || !body.claimAmount) return fail(request, 400, "validation");
    db.counters.court += 1;
    const id = createId("c");
    const filedAt = nowIso();
    const record: CourtCaseRecord = {
      id,
      caseNumber: `4-${1000 + db.counters.court}-${String(new Date().getFullYear()).slice(2)}/${Math.round(Math.random() * 9000 + 1000)}`,
      category: body.category as CourtCaseCategory,
      stage: CourtCaseStage.PRE_TRIAL,
      result: CourtCaseResult.PENDING,
      plaintiff: String(body.plaintiff),
      defendant: String(body.defendant),
      court: String(body.court),
      subject: String(body.subject ?? ""),
      claimAmount: Number(body.claimAmount),
      recoveredAmount: 0,
      lawyerId: request.user!.id,
      branchId: request.user!.branchId,
      nextHearingDate: (body.nextHearingDate as string) || null,
      filedAt,
      deadlines: [
        { id: `${id}-dl1`, title: "Talabnoma yuborish", date: addDays(filedAt, 3), isDone: false },
        { id: `${id}-dl2`, title: "Da'vo arizasini sudga kiritish", date: addDays(filedAt, 33), isDone: false },
      ],
      events: [{ id: `${id}-e1`, date: filedAt, title: "Ish reestrga kiritildi", description: "Sudgacha bo'lgan bosqich boshlandi." }],
      documents: [],
    };
    db.courtCases.unshift(record);
    writeAudit(request, AuditAction.CREATE, AuditEntityType.COURT_CASE, record.caseNumber, "Yangi sud ishi reestrga kiritildi");
    return ok(toDetail(db, record), message(request, "created"));
  });

  mockRoute("put", "/court-service/court-cases/:id", (request) => {
    const db = getDb();
    const item = db.courtCases.find((record) => record.id === request.params.id);
    if (!item) return fail(request, 404, "notFound");
    const body = request.body;
    const previousStage = item.stage;
    item.stage = body.stage as CourtCaseStage;
    item.result = body.result as CourtCaseResult;
    item.recoveredAmount = Number(body.recoveredAmount ?? item.recoveredAmount);
    item.nextHearingDate = (body.nextHearingDate as string) || null;
    if (previousStage !== item.stage) {
      item.events.push({ id: createId("e"), date: nowIso(), title: "Bosqich o'zgartirildi", description: `Ish yangi bosqichga o'tkazildi` });
    }
    writeAudit(request, AuditAction.UPDATE, AuditEntityType.COURT_CASE, item.caseNumber, "Sud ishi ma'lumotlari yangilandi");
    return ok(toDetail(db, item), message(request, "saved"));
  });

  mockRoute("post", "/court-service/court-cases/:id/deadlines/:deadlineId/toggle", (request) => {
    const db = getDb();
    const item = db.courtCases.find((record) => record.id === request.params.id);
    const deadline = item?.deadlines.find((record) => record.id === request.params.deadlineId);
    if (!item || !deadline) return fail(request, 404, "notFound");
    deadline.isDone = !deadline.isDone;
    return ok(toDetail(db, item));
  });
};
