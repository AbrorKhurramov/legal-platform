import { AuditAction, AuditEntityType } from "@/entities/audit/audit.entry";
import { type ImpactLevel, type LegislationSource, LegislationStatus } from "@/entities/legislation/legislation.entry";

import { getDb } from "../mock-db";
import type { LegislationRecord, MockDatabase } from "../mock-db.types";
import { mockRoute } from "../mock-router";
import { toShortUser } from "../mock-rules";
import { fail, matchesSearch, message, ok, paginate, writeAudit } from "../mock-utils";
import { createId } from "../seed/random";

const toListItem = (db: MockDatabase, item: LegislationRecord) => ({
  id: item.id,
  title: item.title,
  docNumber: item.docNumber,
  source: item.source,
  publishedAt: item.publishedAt,
  effectiveAt: item.effectiveAt,
  impactLevel: item.impactLevel,
  status: item.status,
  responsible: toShortUser(db, item.responsibleId),
  affectedDocumentsCount: item.affectedDocuments.length,
  tasksDone: item.tasks.filter((task) => task.isDone).length,
  tasksTotal: item.tasks.length,
});

const toDetail = (db: MockDatabase, item: LegislationRecord) => ({
  ...toListItem(db, item),
  summary: item.summary,
  affectedDocuments: item.affectedDocuments,
  tasks: item.tasks.map(({ assigneeId, ...task }) => ({ ...task, assignee: toShortUser(db, assigneeId) })),
});

const syncStatus = (item: LegislationRecord) => {
  if (!item.tasks.length) return;
  item.status = item.tasks.every((task) => task.isDone) ? LegislationStatus.IMPLEMENTED : LegislationStatus.TASKS_ASSIGNED;
};

export const registerLegislationHandlers = () => {
  mockRoute("get", "/legislation-service/changes", (request) => {
    const db = getDb();
    const { search, source, status, impactLevel } = request.query;
    const items = [...db.legislation]
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .filter((item) => !source || item.source === source)
      .filter((item) => !status || item.status === status)
      .filter((item) => !impactLevel || item.impactLevel === impactLevel)
      .filter((item) => matchesSearch(search, item.title, item.docNumber))
      .map((item) => toListItem(db, item));
    return ok(paginate(items, request.query));
  });

  mockRoute("get", "/legislation-service/changes/:id", (request) => {
    const db = getDb();
    const item = db.legislation.find((record) => record.id === request.params.id);
    if (!item) return fail(request, 404, "notFound");
    writeAudit(request, AuditAction.VIEW, AuditEntityType.LEGISLATION, item.docNumber, "Qonunchilik o'zgarishini ko'rdi");
    return ok(toDetail(db, item));
  });

  mockRoute("post", "/legislation-service/changes", (request) => {
    const db = getDb();
    const body = request.body;
    if (!body.title || !body.docNumber || !body.source || !body.responsibleId) return fail(request, 400, "validation");
    const record: LegislationRecord = {
      id: createId("l"),
      title: String(body.title),
      docNumber: String(body.docNumber),
      source: body.source as LegislationSource,
      publishedAt: String(body.publishedAt),
      effectiveAt: String(body.effectiveAt),
      impactLevel: body.impactLevel as ImpactLevel,
      status: LegislationStatus.NEW,
      responsibleId: String(body.responsibleId),
      summary: String(body.summary ?? ""),
      affectedDocuments: [],
      tasks: [],
    };
    db.legislation.unshift(record);
    writeAudit(request, AuditAction.CREATE, AuditEntityType.LEGISLATION, record.docNumber, "Qonunchilik o'zgarishi qayd etildi");
    return ok(toDetail(db, record), message(request, "created"));
  });

  mockRoute("post", "/legislation-service/changes/:id/tasks", (request) => {
    const db = getDb();
    const item = db.legislation.find((record) => record.id === request.params.id);
    if (!item) return fail(request, 404, "notFound");
    if (!request.body.title || !request.body.assigneeId || !request.body.dueDate) return fail(request, 400, "validation");
    item.tasks.push({
      id: createId("t"),
      title: String(request.body.title),
      assigneeId: String(request.body.assigneeId),
      dueDate: String(request.body.dueDate),
      isDone: false,
    });
    item.status = LegislationStatus.TASKS_ASSIGNED;
    writeAudit(request, AuditAction.ASSIGN, AuditEntityType.LEGISLATION, item.docNumber, "Mas'ulga topshiriq berildi");
    return ok(toDetail(db, item), message(request, "saved"));
  });

  mockRoute("post", "/legislation-service/changes/:id/tasks/:taskId/toggle", (request) => {
    const db = getDb();
    const item = db.legislation.find((record) => record.id === request.params.id);
    const task = item?.tasks.find((record) => record.id === request.params.taskId);
    if (!item || !task) return fail(request, 404, "notFound");
    task.isDone = !task.isDone;
    syncStatus(item);
    return ok(toDetail(db, item));
  });
};
