import { ApprovalDecision, MatterAction, MatterComplexity, MatterStatus } from "@/entities/matter/matter.entry";
import type { MatterDetailDTO, MatterListItemDTO } from "@/entities/matter/matter.entry";
import { RiskLevel } from "@/entities/risk/risk.entry";
import { type UserDTO, UserRole } from "@/entities/user/user.entry";

import type { MatterRecord, MockDatabase, UserRecord } from "./mock-db.types";
import { startOfToday } from "./seed/random";

export const CLOSED_STATUSES: MatterStatus[] = [MatterStatus.COMPLETED, MatterStatus.REJECTED];

export const COMPLEXITY_WEIGHT: Record<MatterComplexity, number> = {
  [MatterComplexity.SIMPLE]: 1,
  [MatterComplexity.MEDIUM]: 2,
  [MatterComplexity.COMPLEX]: 3,
};

export const calcRiskLevel = (probability: number, impact: number): RiskLevel => {
  const score = probability * impact;
  if (score >= 16) return RiskLevel.CRITICAL;
  if (score >= 10) return RiskLevel.HIGH;
  if (score >= 5) return RiskLevel.MEDIUM;
  return RiskLevel.LOW;
};

export const findUser = (db: MockDatabase, id: string) => db.users.find((user) => user.id === id)!;

export const toShortUser = (db: MockDatabase, id: string) => {
  const user = findUser(db, id);
  return { id: user.id, fullName: user.fullName };
};

export const toBranchRef = (db: MockDatabase, id: string) => {
  const branch = db.branches.find((item) => item.id === id)!;
  return { id: branch.id, name: branch.name };
};

export const toUserDTO = (db: MockDatabase, user: UserRecord): UserDTO => ({
  id: user.id,
  username: user.username,
  fullName: user.fullName,
  position: user.position,
  role: user.role,
  branch: toBranchRef(db, user.branchId),
});

export const isMatterOverdue = (matter: MatterRecord) =>
  !CLOSED_STATUSES.includes(matter.status) && matter.status !== MatterStatus.INCOMPLETE_DOCS && new Date(matter.dueDate).getTime() < startOfToday();

//* Ko'rinish qoidasi: rahbar hammasini, yurist maxfiy bo'lmagan va o'ziga biriktirilganlarni, tashabbuskor o'z filiali ishlarini ko'radi
export const canSeeMatter = (user: UserRecord, matter: MatterRecord) => {
  switch (user.role) {
    case UserRole.HEAD:
      return true;
    case UserRole.LAWYER:
      return !matter.confidential || matter.lawyerId === user.id;
    default:
      return matter.initiatorId === user.id || (!matter.confidential && matter.branchId === user.branchId);
  }
};

const getNextApproval = (matter: MatterRecord) => matter.approvals.find((approval) => approval.decision === ApprovalDecision.PENDING);

export const getAvailableActions = (user: UserRecord, matter: MatterRecord): MatterAction[] => {
  const isHead = user.role === UserRole.HEAD;
  const isAssignedLawyer = matter.lawyerId === user.id;
  const isInitiatorSide = matter.initiatorId === user.id || (user.role !== UserRole.LAWYER && user.branchId === matter.branchId && !isHead);

  switch (matter.status) {
    case MatterStatus.NEW:
      return isHead ? [MatterAction.ASSIGN, MatterAction.REJECT] : [];
    case MatterStatus.ASSIGNED:
      return [...(isAssignedLawyer ? [MatterAction.START_REVIEW, MatterAction.REQUEST_DOCS] : []), ...(isHead ? [MatterAction.ASSIGN] : [])];
    case MatterStatus.IN_REVIEW:
      return [
        ...(isAssignedLawyer ? [MatterAction.SUBMIT_OPINION, MatterAction.REQUEST_DOCS, MatterAction.REJECT] : []),
        ...(isHead ? [MatterAction.ASSIGN] : []),
      ];
    case MatterStatus.INCOMPLETE_DOCS:
      return isInitiatorSide ? [MatterAction.PROVIDE_DOCS] : [];
    case MatterStatus.ON_APPROVAL:
      return getNextApproval(matter)?.approverId === user.id ? [MatterAction.APPROVE, MatterAction.RETURN] : [];
    default:
      return [];
  }
};

export const toMatterListItem = (db: MockDatabase, matter: MatterRecord): MatterListItemDTO => ({
  id: matter.id,
  number: matter.number,
  title: matter.title,
  type: matter.type,
  status: matter.status,
  priority: matter.priority,
  confidential: matter.confidential,
  initiator: toShortUser(db, matter.initiatorId),
  branch: toBranchRef(db, matter.branchId),
  lawyer: matter.lawyerId ? toShortUser(db, matter.lawyerId) : null,
  createdAt: matter.createdAt,
  dueDate: matter.dueDate,
  isOverdue: isMatterOverdue(matter),
  isDeadlinePaused: matter.status === MatterStatus.INCOMPLETE_DOCS,
});

export const toMatterDetail = (db: MockDatabase, matter: MatterRecord, user: UserRecord): MatterDetailDTO => ({
  ...toMatterListItem(db, matter),
  description: matter.description,
  complexity: matter.complexity,
  counterparty: matter.counterparty,
  contractAmount: matter.contractAmount,
  currentVersion: Math.max(...matter.documents.map((document) => document.version), 0),
  finalResult: matter.finalResult,
  completedAt: matter.completedAt,
  pausedDays: matter.pausedDays,
  availableActions: getAvailableActions(user, matter),
  documents: [...matter.documents]
    .sort((a, b) => b.version - a.version)
    .map((document) => ({ ...document, uploadedBy: toShortUser(db, document.uploadedById) })),
  approvals: matter.approvals.map((approval) => ({
    id: approval.id,
    approver: toShortUser(db, approval.approverId),
    position: findUser(db, approval.approverId).position,
    decision: approval.decision,
    comment: approval.comment,
    decidedAt: approval.decidedAt,
  })),
  opinion: matter.opinion ? { ...matter.opinion, lawyer: toShortUser(db, matter.opinion.lawyerId) } : null,
});
