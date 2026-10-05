import type { TPageableEndpointDTO } from "@/shared/api/api-types";
import { createScopedApi } from "@/shared/api/create-scoped-api";
import { QueryKeyBootstrap } from "@/shared/lib/query-lib";

import type {
  CourtCaseDetailDTO,
  CourtCaseListItemDTO,
  CourtCaseListRequestParams,
  CourtCaseStatisticsDTO,
  CreateCourtCaseRequestBody,
  UpdateCourtCaseRequestBody,
} from "./court-case.types";

class CourtCaseApi {
  public readonly key = "court-service";

  private readonly scopedApi = createScopedApi("court-service");

  getCourtCases = async (params: CourtCaseListRequestParams) => {
    const response = await this.scopedApi.get<TPageableEndpointDTO<CourtCaseListItemDTO[]>>("/court-cases", { params });
    return response.data;
  };

  getCourtCaseDetail = async (id: string) => {
    const response = await this.scopedApi.get<CourtCaseDetailDTO>(`/court-cases/${id}`);
    return response.data;
  };

  getCourtCaseStatistics = async () => {
    const response = await this.scopedApi.get<CourtCaseStatisticsDTO>("/court-cases/statistics");
    return response.data;
  };

  createCourtCase = async (body: CreateCourtCaseRequestBody) => {
    const response = await this.scopedApi.post<CourtCaseDetailDTO>("/court-cases", body);
    return response.data;
  };

  actionCourtCaseUpdate = async (id: string, body: UpdateCourtCaseRequestBody) => {
    const response = await this.scopedApi.put<CourtCaseDetailDTO>(`/court-cases/${id}`, body);
    return response.data;
  };

  actionCourtDeadlineToggle = async (id: string, deadlineId: string) => {
    const response = await this.scopedApi.post<CourtCaseDetailDTO>(`/court-cases/${id}/deadlines/${deadlineId}/toggle`, undefined, undefined, false);
    return response.data;
  };
}

export const courtCaseApi = new CourtCaseApi();
export const courtCaseApiQueryKeys = new QueryKeyBootstrap(courtCaseApi);
