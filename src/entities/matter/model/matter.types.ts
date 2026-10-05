import type { TPageableRequestParams, TReferenceDTO } from "@/shared/api/api-types";

import type {
  ApprovalDecision,
  MatterAction,
  MatterComplexity,
  MatterHistoryType,
  MatterPriority,
  MatterStatus,
  MatterType,
  OpinionResult,
} from "./matter.const";

export interface MatterUserDTO {
  id: string;
  fullName: string;
}

export interface MatterListItemDTO {
  id: string;
  number: string;
  title: string;
  type: MatterType;
  status: MatterStatus;
  priority: MatterPriority;
  confidential: boolean;
  initiator: MatterUserDTO;
  branch: TReferenceDTO;
  lawyer: MatterUserDTO | null;
  createdAt: string;
  dueDate: string;
  isOverdue: boolean;
  isDeadlinePaused: boolean;
}

export interface MatterDocumentDTO {
  id: string;
  version: number;
  fileName: string;
  size: number;
  uploadedBy: MatterUserDTO;
  uploadedAt: string;
  comment: string | null;
}

export interface MatterApprovalDTO {
  id: string;
  approver: MatterUserDTO;
  position: string;
  decision: ApprovalDecision;
  comment: string | null;
  decidedAt: string | null;
}

export interface MatterOpinionDTO {
  id: string;
  number: string;
  result: OpinionResult;
  text: string;
  lawyer: MatterUserDTO;
  createdAt: string;
  isAiDraft: boolean;
}

export interface MatterDetailDTO extends MatterListItemDTO {
  description: string;
  complexity: MatterComplexity;
  counterparty: string | null;
  contractAmount: number | null;
  currentVersion: number;
  finalResult: string | null;
  completedAt: string | null;
  pausedDays: number;
  availableActions: MatterAction[];
  documents: MatterDocumentDTO[];
  approvals: MatterApprovalDTO[];
  opinion: MatterOpinionDTO | null;
}

export interface MatterHistoryItemDTO {
  id: string;
  type: MatterHistoryType;
  user: MatterUserDTO;
  createdAt: string;
  comment: string | null;
  fromStatus: MatterStatus | null;
  toStatus: MatterStatus | null;
}

export interface MatterListRequestParams extends TPageableRequestParams {
  search?: string;
  status?: MatterStatus;
  type?: MatterType;
  priority?: MatterPriority;
  branchId?: string;
  overdueOnly?: boolean;
  mineOnly?: boolean;
}

export interface CreateMatterRequestBody {
  title: string;
  type: MatterType;
  description: string;
  priority: MatterPriority;
  dueDate: string;
  confidential: boolean;
  counterparty?: string;
  contractAmount?: number;
  fileName?: string;
}

export interface MatterActionRequestBody {
  action: MatterAction;
  comment?: string;
  lawyerId?: string;
  opinionResult?: OpinionResult;
  opinionText?: string;
  fileName?: string;
}

export interface MatterStatisticsDTO {
  kpi: {
    total: number;
    active: number;
    overdue: number;
    incompleteDocs: number;
    onApproval: number;
    completedThisMonth: number;
    avgResolutionDays: number;
  };
  byStatus: Array<{ status: MatterStatus; count: number }>;
  byType: Array<{ type: MatterType; count: number }>;
  byBranch: Array<{ branch: TReferenceDTO; total: number; overdue: number; completed: number }>;
  lawyerWorkload: Array<{ lawyer: MatterUserDTO; active: number; overdue: number; completed: number; weightedScore: number }>;
  monthlyTrend: Array<{ month: string; created: number; completed: number }>;
  overdueMatters: MatterListItemDTO[];
}
