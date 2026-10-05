import type { TPageableRequestParams } from "@/shared/api/api-types";

import type { ImpactLevel, LegislationSource, LegislationStatus } from "./legislation.const";

export interface LegislationListItemDTO {
  id: string;
  title: string;
  docNumber: string;
  source: LegislationSource;
  publishedAt: string;
  effectiveAt: string;
  impactLevel: ImpactLevel;
  status: LegislationStatus;
  responsible: { id: string; fullName: string };
  affectedDocumentsCount: number;
  tasksDone: number;
  tasksTotal: number;
}

export interface LegislationTaskDTO {
  id: string;
  title: string;
  assignee: { id: string; fullName: string };
  dueDate: string;
  isDone: boolean;
}

export interface LegislationDetailDTO extends LegislationListItemDTO {
  summary: string;
  affectedDocuments: Array<{ id: string; name: string; department: string }>;
  tasks: LegislationTaskDTO[];
}

export interface LegislationListRequestParams extends TPageableRequestParams {
  search?: string;
  source?: LegislationSource;
  status?: LegislationStatus;
  impactLevel?: ImpactLevel;
}

export interface CreateLegislationRequestBody {
  title: string;
  docNumber: string;
  source: LegislationSource;
  publishedAt: string;
  effectiveAt: string;
  impactLevel: ImpactLevel;
  summary: string;
  responsibleId: string;
}

export interface AddLegislationTaskRequestBody {
  title: string;
  assigneeId: string;
  dueDate: string;
}
