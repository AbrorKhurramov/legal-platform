import type { TPageableRequestParams, TReferenceDTO } from "@/shared/api/api-types";

import type { RiskCategory, RiskLevel, RiskStatus } from "./risk.const";

export interface RiskListItemDTO {
  id: string;
  code: string;
  title: string;
  category: RiskCategory;
  level: RiskLevel;
  probability: number;
  impact: number;
  status: RiskStatus;
  owner: { id: string; fullName: string };
  branch: TReferenceDTO;
  dueDate: string;
  relatedMatterNumber: string | null;
}

export interface RiskNoteDTO {
  id: string;
  createdAt: string;
  author: { id: string; fullName: string };
  text: string;
}

export interface RiskDetailDTO extends RiskListItemDTO {
  description: string;
  mitigation: string;
  notes: RiskNoteDTO[];
}

export interface RiskListRequestParams extends TPageableRequestParams {
  search?: string;
  category?: RiskCategory;
  level?: RiskLevel;
  status?: RiskStatus;
}

export interface CreateRiskRequestBody {
  title: string;
  category: RiskCategory;
  probability: number;
  impact: number;
  description: string;
  mitigation: string;
  dueDate: string;
  ownerId: string;
}

export interface RiskActionRequestBody {
  status: RiskStatus;
  note?: string;
}

export interface RiskStatisticsDTO {
  open: number;
  byLevel: Array<{ level: RiskLevel; count: number }>;
  matrix: Array<{ probability: number; impact: number; count: number }>;
}
