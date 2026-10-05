import type { TPageableEndpointDTO } from "@/shared/api/api-types";
import { createScopedApi } from "@/shared/api/create-scoped-api";
import { QueryKeyBootstrap } from "@/shared/lib/query-lib";

import type {
  CreateMatterRequestBody,
  MatterActionRequestBody,
  MatterDetailDTO,
  MatterHistoryItemDTO,
  MatterListItemDTO,
  MatterListRequestParams,
  MatterStatisticsDTO,
} from "./matter.types";

class MatterApi {
  public readonly key = "matter-service";

  private readonly scopedApi = createScopedApi("matter-service");

  getMatters = async (params: MatterListRequestParams) => {
    const response = await this.scopedApi.get<TPageableEndpointDTO<MatterListItemDTO[]>>("/matters", { params });
    return response.data;
  };

  getMatterDetail = async (id: string) => {
    const response = await this.scopedApi.get<MatterDetailDTO>(`/matters/${id}`);
    return response.data;
  };

  getMatterHistory = async (id: string) => {
    const response = await this.scopedApi.get<MatterHistoryItemDTO[]>(`/matters/${id}/history`);
    return response.data;
  };

  getMatterStatistics = async () => {
    const response = await this.scopedApi.get<MatterStatisticsDTO>("/matters/statistics");
    return response.data;
  };

  createMatter = async (body: CreateMatterRequestBody) => {
    const response = await this.scopedApi.post<MatterDetailDTO>("/matters", body);
    return response.data;
  };

  actionMatter = async (id: string, body: MatterActionRequestBody) => {
    const response = await this.scopedApi.post<MatterDetailDTO>(`/matters/${id}/action`, body);
    return response.data;
  };
}

export const matterApi = new MatterApi();
export const matterApiQueryKeys = new QueryKeyBootstrap(matterApi);
