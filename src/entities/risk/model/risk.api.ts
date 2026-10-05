import type { TPageableEndpointDTO } from "@/shared/api/api-types";
import { createScopedApi } from "@/shared/api/create-scoped-api";
import { QueryKeyBootstrap } from "@/shared/lib/query-lib";

import type {
  CreateRiskRequestBody,
  RiskActionRequestBody,
  RiskDetailDTO,
  RiskListItemDTO,
  RiskListRequestParams,
  RiskStatisticsDTO,
} from "./risk.types";

class RiskApi {
  public readonly key = "risk-service";

  private readonly scopedApi = createScopedApi("risk-service");

  getRisks = async (params: RiskListRequestParams) => {
    const response = await this.scopedApi.get<TPageableEndpointDTO<RiskListItemDTO[]>>("/risks", { params });
    return response.data;
  };

  getRiskDetail = async (id: string) => {
    const response = await this.scopedApi.get<RiskDetailDTO>(`/risks/${id}`);
    return response.data;
  };

  getRiskStatistics = async () => {
    const response = await this.scopedApi.get<RiskStatisticsDTO>("/risks/statistics");
    return response.data;
  };

  createRisk = async (body: CreateRiskRequestBody) => {
    const response = await this.scopedApi.post<RiskDetailDTO>("/risks", body);
    return response.data;
  };

  actionRisk = async (id: string, body: RiskActionRequestBody) => {
    const response = await this.scopedApi.post<RiskDetailDTO>(`/risks/${id}/action`, body);
    return response.data;
  };
}

export const riskApi = new RiskApi();
export const riskApiQueryKeys = new QueryKeyBootstrap(riskApi);
