import type { TPageableEndpointDTO } from "@/shared/api/api-types";
import { createScopedApi } from "@/shared/api/create-scoped-api";
import { QueryKeyBootstrap } from "@/shared/lib/query-lib";

import type { OpinionListItemDTO, OpinionListRequestParams } from "./opinion.types";

class OpinionApi {
  public readonly key = "opinion-service";

  private readonly scopedApi = createScopedApi("opinion-service");

  getOpinions = async (params: OpinionListRequestParams) => {
    const response = await this.scopedApi.get<TPageableEndpointDTO<OpinionListItemDTO[]>>("/opinions", { params });
    return response.data;
  };
}

export const opinionApi = new OpinionApi();
export const opinionApiQueryKeys = new QueryKeyBootstrap(opinionApi);
