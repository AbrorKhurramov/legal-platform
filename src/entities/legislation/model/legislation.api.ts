import type { TPageableEndpointDTO } from "@/shared/api/api-types";
import { createScopedApi } from "@/shared/api/create-scoped-api";
import { QueryKeyBootstrap } from "@/shared/lib/query-lib";

import type {
  AddLegislationTaskRequestBody,
  CreateLegislationRequestBody,
  LegislationDetailDTO,
  LegislationListItemDTO,
  LegislationListRequestParams,
} from "./legislation.types";

class LegislationApi {
  public readonly key = "legislation-service";

  private readonly scopedApi = createScopedApi("legislation-service");

  getLegislationChanges = async (params: LegislationListRequestParams) => {
    const response = await this.scopedApi.get<TPageableEndpointDTO<LegislationListItemDTO[]>>("/changes", { params });
    return response.data;
  };

  getLegislationDetail = async (id: string) => {
    const response = await this.scopedApi.get<LegislationDetailDTO>(`/changes/${id}`);
    return response.data;
  };

  createLegislationChange = async (body: CreateLegislationRequestBody) => {
    const response = await this.scopedApi.post<LegislationDetailDTO>("/changes", body);
    return response.data;
  };

  addLegislationTask = async (id: string, body: AddLegislationTaskRequestBody) => {
    const response = await this.scopedApi.post<LegislationDetailDTO>(`/changes/${id}/tasks`, body);
    return response.data;
  };

  actionLegislationTaskToggle = async (id: string, taskId: string) => {
    const response = await this.scopedApi.post<LegislationDetailDTO>(`/changes/${id}/tasks/${taskId}/toggle`, undefined, undefined, false);
    return response.data;
  };
}

export const legislationApi = new LegislationApi();
export const legislationApiQueryKeys = new QueryKeyBootstrap(legislationApi);
