import type { TPageableRequestParams } from "@/shared/api/api-types";

import type { AuditAction, AuditEntityType } from "./audit.const";

export interface AuditLogDTO {
  id: string;
  createdAt: string;
  user: { id: string; fullName: string };
  role: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityRef: string | null;
  ip: string;
  details: string;
}

export interface AuditLogRequestParams extends TPageableRequestParams {
  search?: string;
  action?: AuditAction;
  entityType?: AuditEntityType;
  dateFrom?: string;
  dateTo?: string;
}
