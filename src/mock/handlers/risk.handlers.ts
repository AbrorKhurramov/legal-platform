import { AuditAction, AuditEntityType } from "@/entities/audit/audit.entry";
import { RISK_LEVELS, type RiskCategory, RiskStatus } from "@/entities/risk/risk.entry";

import { getDb } from "../mock-db";
import type { MockDatabase, RiskRecord } from "../mock-db.types";
import { mockRoute } from "../mock-router";
import { calcRiskLevel, toBranchRef, toShortUser } from "../mock-rules";
import { fail, matchesSearch, message, nowIso, ok, paginate, writeAudit } from "../mock-utils";
import { createId } from "../seed/random";

const toListItem = (db: MockDatabase, item: RiskRecord) => ({
  id: item.id,
  code: item.code,
  title: item.title,
  category: item.category,
  level: item.level,
  probability: item.probability,
  impact: item.impact,
  status: item.status,
  owner: toShortUser(db, item.ownerId),
  branch: toBranchRef(db, item.branchId),
  dueDate: item.dueDate,
  relatedMatterNumber: item.relatedMatterNumber,
});

const toDetail = (db: MockDatabase, item: RiskRecord) => ({
  ...toListItem(db, item),
  description: item.description,
  mitigation: item.mitigation,
  notes: [...item.notes]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(({ authorId, ...note }) => ({ ...note, author: toShortUser(db, authorId) })),
});

const SCALE = [1, 2, 3, 4, 5];

export const registerRiskHandlers = () => {
  mockRoute("get", "/risk-service/risks/statistics", () => {
    const open = getDb().risks.filter((item) => item.status !== RiskStatus.CLOSED);
    return ok({
      open: open.length,
      byLevel: RISK_LEVELS.map((level) => ({ level, count: open.filter((item) => item.level === level).length })),
      matrix: SCALE.flatMap((probability) =>
        SCALE.map((impact) => ({
          probability,
          impact,
          count: open.filter((item) => item.probability === probability && item.impact === impact).length,
        })),
      ),
    });
  });

  mockRoute("get", "/risk-service/risks", (request) => {
    const db = getDb();
    const { search, category, level, status } = request.query;
    const items = db.risks
      .filter((item) => !category || item.category === category)
      .filter((item) => !level || item.level === level)
      .filter((item) => !status || item.status === status)
      .filter((item) => matchesSearch(search, item.code, item.title))
      .sort((a, b) => b.probability * b.impact - a.probability * a.impact)
      .map((item) => toListItem(db, item));
    return ok(paginate(items, request.query));
  });

  mockRoute("get", "/risk-service/risks/:id", (request) => {
    const db = getDb();
    const item = db.risks.find((record) => record.id === request.params.id);
    return item ? ok(toDetail(db, item)) : fail(request, 404, "notFound");
  });

  mockRoute("post", "/risk-service/risks", (request) => {
    const db = getDb();
    const body = request.body;
    if (!body.title || !body.category || !body.probability || !body.impact || !body.ownerId) return fail(request, 400, "validation");
    db.counters.risk += 1;
    const probability = Number(body.probability);
    const impact = Number(body.impact);
    const record: RiskRecord = {
      id: createId("r"),
      code: `XR-${String(db.counters.risk).padStart(3, "0")}`,
      title: String(body.title),
      category: body.category as RiskCategory,
      level: calcRiskLevel(probability, impact),
      probability,
      impact,
      status: RiskStatus.IDENTIFIED,
      ownerId: String(body.ownerId),
      branchId: request.user!.branchId,
      dueDate: String(body.dueDate),
      relatedMatterNumber: null,
      description: String(body.description ?? ""),
      mitigation: String(body.mitigation ?? ""),
      notes: [{ id: createId("n"), createdAt: nowIso(), authorId: request.user!.id, text: "Xatar reestrga kiritildi." }],
    };
    db.risks.unshift(record);
    writeAudit(request, AuditAction.CREATE, AuditEntityType.RISK, record.code, "Yangi xatar kartasi yaratildi");
    return ok(toDetail(db, record), message(request, "created"));
  });

  mockRoute("post", "/risk-service/risks/:id/action", (request) => {
    const db = getDb();
    const item = db.risks.find((record) => record.id === request.params.id);
    if (!item) return fail(request, 404, "notFound");
    item.status = request.body.status as RiskStatus;
    if (request.body.note) item.notes.push({ id: createId("n"), createdAt: nowIso(), authorId: request.user!.id, text: String(request.body.note) });
    writeAudit(request, AuditAction.UPDATE, AuditEntityType.RISK, item.code, "Xatar holati yangilandi");
    return ok(toDetail(db, item), message(request, "saved"));
  });
};
