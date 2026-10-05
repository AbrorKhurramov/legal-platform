import { AuditAction, AuditEntityType } from "@/entities/audit/audit.entry";
import {
  ApprovalDecision,
  MATTER_STATUSES,
  MATTER_TYPES,
  MatterAction,
  MatterComplexity,
  MatterHistoryType,
  MatterPriority,
  MatterStatus,
  MatterType,
  OpinionResult,
} from "@/entities/matter/matter.entry";
import { UserRole } from "@/entities/user/user.entry";

import { getDb } from "../mock-db";
import type { MatterRecord } from "../mock-db.types";
import { type MockRequest, mockRoute } from "../mock-router";
import {
  CLOSED_STATUSES,
  COMPLEXITY_WEIGHT,
  canSeeMatter,
  getAvailableActions,
  isMatterOverdue,
  toBranchRef,
  toMatterDetail,
  toMatterListItem,
  toShortUser,
} from "../mock-rules";
import { fail, matchesSearch, message, nowIso, ok, paginate, writeAudit } from "../mock-utils";
import { addDays, createId, diffDays } from "../seed/random";
import { DEPUTY_ID, DIRECTOR_ID } from "../seed/seed-dictionary";

const YEAR = new Date().getFullYear();

const SLA_DAYS: Record<MatterPriority, number> = {
  [MatterPriority.LOW]: 10,
  [MatterPriority.MEDIUM]: 7,
  [MatterPriority.HIGH]: 5,
  [MatterPriority.CRITICAL]: 2,
};

const visibleMatters = (request: MockRequest) => getDb().matters.filter((matter) => canSeeMatter(request.user!, matter));

const addHistory = (matter: MatterRecord, request: MockRequest, type: MatterHistoryType, toStatus: MatterStatus | null, comment?: string | null) => {
  matter.history.push({
    id: createId("h"),
    type,
    userId: request.user!.id,
    createdAt: nowIso(),
    comment: comment || null,
    fromStatus: matter.status,
    toStatus,
  });
  if (toStatus) matter.status = toStatus;
};

const addDocumentVersion = (matter: MatterRecord, request: MockRequest, fileName: string, comment: string | null) => {
  const version = Math.max(0, ...matter.documents.map((document) => document.version)) + 1;
  matter.documents.push({
    id: createId("d"),
    version,
    fileName,
    size: Math.round(80_000 + Math.random() * 900_000),
    uploadedById: request.user!.id,
    uploadedAt: nowIso(),
    comment,
  });
};

const applyAction = (matter: MatterRecord, request: MockRequest) => {
  const db = getDb();
  const body = request.body;
  const comment = (body.comment as string | undefined) ?? null;

  switch (body.action as MatterAction) {
    case MatterAction.ASSIGN: {
      const lawyer = db.users.find((user) => user.id === body.lawyerId && user.role === UserRole.LAWYER);
      if (!lawyer) return false;
      matter.lawyerId = lawyer.id;
      addHistory(
        matter,
        request,
        MatterHistoryType.ASSIGNED,
        matter.status === MatterStatus.NEW ? MatterStatus.ASSIGNED : null,
        `Mas'ul yurist: ${lawyer.fullName}${comment ? `. ${comment}` : ""}`,
      );
      writeAudit(request, AuditAction.ASSIGN, AuditEntityType.MATTER, matter.number, `Mas'ul yurist biriktirildi: ${lawyer.fullName}`);
      return true;
    }
    case MatterAction.START_REVIEW:
      addHistory(matter, request, MatterHistoryType.STATUS_CHANGED, MatterStatus.IN_REVIEW, comment);
      return true;
    case MatterAction.REQUEST_DOCS:
      matter.pausedAt = nowIso();
      addHistory(matter, request, MatterHistoryType.STATUS_CHANGED, MatterStatus.INCOMPLETE_DOCS, comment);
      return true;
    case MatterAction.PROVIDE_DOCS: {
      const paused = matter.pausedAt ? Math.max(0, diffDays(matter.pausedAt, nowIso())) : 0;
      matter.pausedDays += paused;
      matter.dueDate = addDays(matter.dueDate, paused);
      matter.pausedAt = null;
      addDocumentVersion(matter, request, String(body.fileName || "Qo'shimcha hujjatlar.pdf"), comment);
      addHistory(matter, request, MatterHistoryType.DOCUMENT_UPLOADED, MatterStatus.IN_REVIEW, comment);
      writeAudit(request, AuditAction.UPLOAD, AuditEntityType.MATTER, matter.number, "Yetishmayotgan hujjatlar yuklandi");
      return true;
    }
    case MatterAction.SUBMIT_OPINION: {
      if (!body.opinionResult || !body.opinionText) return false;
      db.counters.opinion += 1;
      matter.opinion = {
        id: createId("op"),
        number: `HX-${YEAR}-${String(db.counters.opinion).padStart(4, "0")}`,
        result: body.opinionResult as OpinionResult,
        text: String(body.opinionText),
        lawyerId: request.user!.id,
        createdAt: nowIso(),
        isAiDraft: false,
      };
      const chain = matter.complexity === MatterComplexity.SIMPLE ? [DEPUTY_ID] : [DEPUTY_ID, DIRECTOR_ID];
      matter.approvals = chain.map((approverId) => ({
        id: createId("a"),
        approverId,
        decision: ApprovalDecision.PENDING,
        comment: null,
        decidedAt: null,
      }));
      addHistory(matter, request, MatterHistoryType.OPINION_SUBMITTED, MatterStatus.ON_APPROVAL, comment);
      writeAudit(request, AuditAction.CREATE, AuditEntityType.MATTER, matter.number, `Huquqiy xulosa ${matter.opinion.number} kelishuvga yuborildi`);
      return true;
    }
    case MatterAction.APPROVE: {
      const approval = matter.approvals.find((item) => item.decision === ApprovalDecision.PENDING);
      if (!approval) return false;
      approval.decision = ApprovalDecision.APPROVED;
      approval.comment = comment;
      approval.decidedAt = nowIso();
      const isLast = matter.approvals.every((item) => item.decision === ApprovalDecision.APPROVED);
      if (isLast) {
        matter.completedAt = nowIso();
        matter.finalResult = comment || "Huquqiy xulosa tasdiqlandi.";
      }
      addHistory(matter, request, MatterHistoryType.APPROVED, isLast ? MatterStatus.COMPLETED : null, comment);
      writeAudit(request, AuditAction.APPROVE, AuditEntityType.MATTER, matter.number, isLast ? "Yakuniy kelishildi" : "Vizalandi");
      return true;
    }
    case MatterAction.RETURN: {
      const approval = matter.approvals.find((item) => item.decision === ApprovalDecision.PENDING);
      if (approval) {
        approval.decision = ApprovalDecision.RETURNED;
        approval.comment = comment;
        approval.decidedAt = nowIso();
      }
      addHistory(matter, request, MatterHistoryType.RETURNED, MatterStatus.IN_REVIEW, comment);
      writeAudit(request, AuditAction.RETURN, AuditEntityType.MATTER, matter.number, "Xulosa qayta ishlashga qaytarildi");
      return true;
    }
    case MatterAction.REJECT:
      matter.completedAt = nowIso();
      matter.finalResult = comment;
      addHistory(matter, request, MatterHistoryType.REJECTED, MatterStatus.REJECTED, comment);
      writeAudit(request, AuditAction.REJECT, AuditEntityType.MATTER, matter.number, "Murojaat rad etildi");
      return true;
    default:
      return false;
  }
};

const monthKey = (iso: string) => iso.slice(0, 7);

const buildStatistics = (request: MockRequest) => {
  const db = getDb();
  const matters = visibleMatters(request);
  const active = matters.filter((matter) => !CLOSED_STATUSES.includes(matter.status));
  const completed = matters.filter((matter) => matter.status === MatterStatus.COMPLETED && matter.completedAt);
  const currentMonth = monthKey(nowIso());
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));
    return monthKey(date.toISOString());
  });
  const lawyers = db.users.filter((user) => user.role === UserRole.LAWYER);

  return {
    kpi: {
      total: matters.length,
      active: active.length,
      overdue: matters.filter(isMatterOverdue).length,
      incompleteDocs: matters.filter((matter) => matter.status === MatterStatus.INCOMPLETE_DOCS).length,
      onApproval: matters.filter((matter) => matter.status === MatterStatus.ON_APPROVAL).length,
      completedThisMonth: completed.filter((matter) => monthKey(matter.completedAt!) === currentMonth).length,
      avgResolutionDays: completed.length
        ? Math.round(
            (completed.reduce((sum, matter) => sum + diffDays(matter.createdAt, matter.completedAt!) - matter.pausedDays, 0) / completed.length) * 10,
          ) / 10
        : 0,
    },
    byStatus: MATTER_STATUSES.map((status) => ({ status, count: matters.filter((matter) => matter.status === status).length })),
    byType: MATTER_TYPES.map((type) => ({ type, count: matters.filter((matter) => matter.type === type).length })).filter((item) => item.count > 0),
    byBranch: db.branches
      .map((branch) => {
        const own = matters.filter((matter) => matter.branchId === branch.id);
        return {
          branch: toBranchRef(db, branch.id),
          total: own.length,
          overdue: own.filter(isMatterOverdue).length,
          completed: own.filter((matter) => matter.status === MatterStatus.COMPLETED).length,
        };
      })
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total),
    lawyerWorkload: lawyers
      .map((lawyer) => {
        const own = matters.filter((matter) => matter.lawyerId === lawyer.id);
        const done = own.filter((matter) => matter.status === MatterStatus.COMPLETED);
        return {
          lawyer: toShortUser(db, lawyer.id),
          active: own.filter((matter) => !CLOSED_STATUSES.includes(matter.status)).length,
          overdue: own.filter(isMatterOverdue).length,
          completed: done.length,
          weightedScore: done.reduce((sum, matter) => sum + COMPLEXITY_WEIGHT[matter.complexity], 0),
        };
      })
      .sort((a, b) => b.weightedScore - a.weightedScore),
    monthlyTrend: months.map((month) => ({
      month,
      created: matters.filter((matter) => monthKey(matter.createdAt) === month).length,
      completed: completed.filter((matter) => monthKey(matter.completedAt!) === month).length,
    })),
    overdueMatters: matters
      .filter(isMatterOverdue)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 6)
      .map((matter) => toMatterListItem(db, matter)),
  };
};

export const registerMatterHandlers = () => {
  mockRoute("get", "/matter-service/matters/statistics", (request) => ok(buildStatistics(request)));

  mockRoute("get", "/matter-service/matters", (request) => {
    const db = getDb();
    const { search, status, type, priority, branchId, overdueOnly, mineOnly } = request.query;
    const user = request.user!;
    const items = visibleMatters(request)
      .filter((matter) => !status || matter.status === status)
      .filter((matter) => !type || matter.type === type)
      .filter((matter) => !priority || matter.priority === priority)
      .filter((matter) => !branchId || matter.branchId === branchId)
      .filter((matter) => overdueOnly !== "true" || isMatterOverdue(matter))
      .filter(
        (matter) =>
          mineOnly !== "true" || matter.lawyerId === user.id || matter.initiatorId === user.id || getAvailableActions(user, matter).length > 0,
      )
      .filter((matter) => matchesSearch(search, matter.number, matter.title, matter.counterparty))
      .map((matter) => toMatterListItem(db, matter));
    return ok(paginate(items, request.query));
  });

  mockRoute("get", "/matter-service/matters/:id", (request) => {
    const db = getDb();
    const matter = db.matters.find((item) => item.id === request.params.id);
    if (!matter) return fail(request, 404, "notFound");
    if (!canSeeMatter(request.user!, matter)) return fail(request, 403, "forbidden");
    writeAudit(request, AuditAction.VIEW, AuditEntityType.MATTER, matter.number, "Murojaat kartasini ko'rdi");
    return ok(toMatterDetail(db, matter, request.user!));
  });

  mockRoute("get", "/matter-service/matters/:id/history", (request) => {
    const db = getDb();
    const matter = db.matters.find((item) => item.id === request.params.id);
    if (!matter) return fail(request, 404, "notFound");
    if (!canSeeMatter(request.user!, matter)) return fail(request, 403, "forbidden");
    return ok(
      [...matter.history].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((item) => ({ ...item, user: toShortUser(db, item.userId) })),
    );
  });

  mockRoute("post", "/matter-service/matters", (request) => {
    const db = getDb();
    const body = request.body;
    if (!body.title || !body.type || !body.description || !body.priority || !body.dueDate) return fail(request, 400, "validation");
    db.counters.matter += 1;
    const createdAt = nowIso();
    const id = createId("m");
    const priority = body.priority as MatterPriority;
    const matter: MatterRecord = {
      id,
      number: `YD-${YEAR}-${String(db.counters.matter).padStart(4, "0")}`,
      title: String(body.title),
      type: body.type as MatterType,
      status: MatterStatus.NEW,
      priority,
      complexity: MatterComplexity.MEDIUM,
      confidential: Boolean(body.confidential),
      description: String(body.description),
      initiatorId: request.user!.id,
      branchId: request.user!.branchId,
      lawyerId: null,
      createdAt,
      dueDate: String(body.dueDate) || addDays(createdAt, SLA_DAYS[priority]),
      completedAt: null,
      pausedAt: null,
      pausedDays: 0,
      counterparty: (body.counterparty as string) || null,
      contractAmount: body.contractAmount ? Number(body.contractAmount) : null,
      finalResult: null,
      documents: [],
      approvals: [],
      opinion: null,
      history: [
        {
          id: createId("h"),
          type: MatterHistoryType.CREATED,
          userId: request.user!.id,
          createdAt,
          comment: null,
          fromStatus: null,
          toStatus: MatterStatus.NEW,
        },
      ],
    };
    if (body.fileName) addDocumentVersion(matter, request, String(body.fileName), null);
    db.matters.unshift(matter);
    writeAudit(request, AuditAction.CREATE, AuditEntityType.MATTER, matter.number, "Yangi murojaat yaratildi");
    return ok(toMatterDetail(db, matter, request.user!), message(request, "created"));
  });

  mockRoute("post", "/matter-service/matters/:id/action", (request) => {
    const db = getDb();
    const matter = db.matters.find((item) => item.id === request.params.id);
    if (!matter) return fail(request, 404, "notFound");
    if (!getAvailableActions(request.user!, matter).includes(request.body.action as MatterAction)) return fail(request, 403, "actionForbidden");
    if (!applyAction(matter, request)) return fail(request, 400, "validation");
    return ok(toMatterDetail(db, matter, request.user!), message(request, "actionDone"));
  });
};
