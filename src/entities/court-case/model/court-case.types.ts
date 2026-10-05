import type { TPageableRequestParams, TReferenceDTO } from "@/shared/api/api-types";

import type { CourtCaseCategory, CourtCaseResult, CourtCaseStage } from "./court-case.const";

export interface CourtCaseListItemDTO {
  id: string;
  caseNumber: string;
  category: CourtCaseCategory;
  stage: CourtCaseStage;
  result: CourtCaseResult;
  plaintiff: string;
  defendant: string;
  court: string;
  claimAmount: number;
  recoveredAmount: number;
  lawyer: { id: string; fullName: string };
  branch: TReferenceDTO;
  nextHearingDate: string | null;
  filedAt: string;
}

export interface CourtDeadlineDTO {
  id: string;
  title: string;
  date: string;
  isDone: boolean;
}

export interface CourtEventDTO {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface CourtCaseDetailDTO extends CourtCaseListItemDTO {
  subject: string;
  deadlines: CourtDeadlineDTO[];
  events: CourtEventDTO[];
  documents: Array<{ id: string; name: string; uploadedAt: string }>;
}

export interface CourtCaseListRequestParams extends TPageableRequestParams {
  search?: string;
  category?: CourtCaseCategory;
  stage?: CourtCaseStage;
  result?: CourtCaseResult;
}

export interface CreateCourtCaseRequestBody {
  category: CourtCaseCategory;
  plaintiff: string;
  defendant: string;
  court: string;
  subject: string;
  claimAmount: number;
  nextHearingDate?: string;
}

export interface UpdateCourtCaseRequestBody {
  stage: CourtCaseStage;
  result: CourtCaseResult;
  recoveredAmount: number;
  nextHearingDate?: string | null;
}

export interface CourtCaseStatisticsDTO {
  total: number;
  active: number;
  byResult: Array<{ result: CourtCaseResult; count: number }>;
  claimTotal: number;
  recoveredTotal: number;
  upcomingHearings: Array<{ id: string; caseNumber: string; court: string; defendant: string; date: string }>;
}
