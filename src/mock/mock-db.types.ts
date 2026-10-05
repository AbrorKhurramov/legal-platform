import type { AuditAction, AuditEntityType } from "@/entities/audit/audit.entry";
import type { BranchDTO } from "@/entities/branch/branch.entry";
import type { CourtCaseCategory, CourtCaseResult, CourtCaseStage } from "@/entities/court-case/court-case.entry";
import type { KnowledgeCategory } from "@/entities/knowledge/knowledge.entry";
import type { ImpactLevel, LegislationSource, LegislationStatus } from "@/entities/legislation/legislation.entry";
import type {
  ApprovalDecision,
  MatterComplexity,
  MatterHistoryType,
  MatterPriority,
  MatterStatus,
  MatterType,
  OpinionResult,
} from "@/entities/matter/matter.entry";
import type { RiskCategory, RiskLevel, RiskStatus } from "@/entities/risk/risk.entry";
import type { UserRole } from "@/entities/user/user.entry";

export type BranchRecord = BranchDTO;

export interface UserRecord {
  id: string;
  username: string;
  fullName: string;
  position: string;
  role: UserRole;
  branchId: string;
}

export interface MatterDocumentRecord {
  id: string;
  version: number;
  fileName: string;
  size: number;
  uploadedById: string;
  uploadedAt: string;
  comment: string | null;
}

export interface MatterApprovalRecord {
  id: string;
  approverId: string;
  decision: ApprovalDecision;
  comment: string | null;
  decidedAt: string | null;
}

export interface MatterOpinionRecord {
  id: string;
  number: string;
  result: OpinionResult;
  text: string;
  lawyerId: string;
  createdAt: string;
  isAiDraft: boolean;
}

export interface MatterHistoryRecord {
  id: string;
  type: MatterHistoryType;
  userId: string;
  createdAt: string;
  comment: string | null;
  fromStatus: MatterStatus | null;
  toStatus: MatterStatus | null;
}

export interface MatterRecord {
  id: string;
  number: string;
  title: string;
  type: MatterType;
  status: MatterStatus;
  priority: MatterPriority;
  complexity: MatterComplexity;
  confidential: boolean;
  description: string;
  initiatorId: string;
  branchId: string;
  lawyerId: string | null;
  createdAt: string;
  dueDate: string;
  completedAt: string | null;
  pausedAt: string | null;
  pausedDays: number;
  counterparty: string | null;
  contractAmount: number | null;
  finalResult: string | null;
  documents: MatterDocumentRecord[];
  approvals: MatterApprovalRecord[];
  opinion: MatterOpinionRecord | null;
  history: MatterHistoryRecord[];
}

export interface CourtCaseRecord {
  id: string;
  caseNumber: string;
  category: CourtCaseCategory;
  stage: CourtCaseStage;
  result: CourtCaseResult;
  plaintiff: string;
  defendant: string;
  court: string;
  subject: string;
  claimAmount: number;
  recoveredAmount: number;
  lawyerId: string;
  branchId: string;
  nextHearingDate: string | null;
  filedAt: string;
  deadlines: Array<{ id: string; title: string; date: string; isDone: boolean }>;
  events: Array<{ id: string; date: string; title: string; description: string }>;
  documents: Array<{ id: string; name: string; uploadedAt: string }>;
}

export interface LegislationRecord {
  id: string;
  title: string;
  docNumber: string;
  source: LegislationSource;
  publishedAt: string;
  effectiveAt: string;
  impactLevel: ImpactLevel;
  status: LegislationStatus;
  responsibleId: string;
  summary: string;
  affectedDocuments: Array<{ id: string; name: string; department: string }>;
  tasks: Array<{ id: string; title: string; assigneeId: string; dueDate: string; isDone: boolean }>;
}

export interface RiskRecord {
  id: string;
  code: string;
  title: string;
  category: RiskCategory;
  level: RiskLevel;
  probability: number;
  impact: number;
  status: RiskStatus;
  ownerId: string;
  branchId: string;
  dueDate: string;
  relatedMatterNumber: string | null;
  description: string;
  mitigation: string;
  notes: Array<{ id: string; createdAt: string; authorId: string; text: string }>;
}

export interface KnowledgeRecord {
  id: string;
  question: string;
  answer: string;
  category: KnowledgeCategory;
  tags: string[];
  authorId: string;
  usageCount: number;
  updatedAt: string;
  sourceMatterNumber: string | null;
}

export interface AuditRecord {
  id: string;
  createdAt: string;
  userId: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityRef: string | null;
  ip: string;
  details: string;
}

export interface MockDatabase {
  version: number;
  branches: BranchRecord[];
  users: UserRecord[];
  matters: MatterRecord[];
  courtCases: CourtCaseRecord[];
  legislation: LegislationRecord[];
  risks: RiskRecord[];
  knowledge: KnowledgeRecord[];
  audit: AuditRecord[];
  counters: { matter: number; opinion: number; court: number; risk: number };
}
