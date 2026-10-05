import type { TPageableRequestParams } from "@/shared/api/api-types";

import type { OpinionRegistryResult, OpinionRegistryStatus } from "./opinion.const";

export interface OpinionListItemDTO {
  id: string;
  number: string;
  matterId: string;
  matterNumber: string;
  matterTitle: string;
  matterType: string;
  result: OpinionRegistryResult;
  status: OpinionRegistryStatus;
  lawyer: { id: string; fullName: string };
  approvedBy: { id: string; fullName: string } | null;
  createdAt: string;
  approvedAt: string | null;
  summary: string;
}

export interface OpinionListRequestParams extends TPageableRequestParams {
  search?: string;
  result?: OpinionRegistryResult;
}
