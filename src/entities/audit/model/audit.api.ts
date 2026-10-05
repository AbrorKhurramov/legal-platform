import type { TPageableEndpointDTO } from "@/shared/api/api-types";
import { createScopedApi } from "@/shared/api/create-scoped-api";
import { QueryKeyBootstrap } from "@/shared/lib/query-lib";

import type { AuditLogDTO, AuditLogRequestParams } from "./audit.types";

class AuditApi {
  public readonly key = "audit-service";

  private readonly scopedApi = createScopedApi("audit-service");

  getAuditLogs = async (params: AuditLogRequestParams) => {
    const response = await this.scopedApi.get<TPageableEndpointDTO<AuditLogDTO[]>>("/logs", { params });
    return response.data;
  };
}

export const auditApi = new AuditApi();
export const auditApiQueryKeys = new QueryKeyBootstrap(auditApi);
