import type { TPageableEndpointDTO } from "@/shared/api/api-types";
import { createScopedApi } from "@/shared/api/create-scoped-api";
import { QueryKeyBootstrap } from "@/shared/lib/query-lib";

import type { KnowledgeArticleDTO, KnowledgeListRequestParams } from "./knowledge.types";

class KnowledgeApi {
  public readonly key = "knowledge-service";

  private readonly scopedApi = createScopedApi("knowledge-service");

  getArticles = async (params: KnowledgeListRequestParams) => {
    const response = await this.scopedApi.get<TPageableEndpointDTO<KnowledgeArticleDTO[]>>("/articles", { params });
    return response.data;
  };

  actionArticleUse = async (id: string) => {
    const response = await this.scopedApi.post<KnowledgeArticleDTO>(`/articles/${id}/use`, undefined, undefined, false);
    return response.data;
  };
}

export const knowledgeApi = new KnowledgeApi();
export const knowledgeApiQueryKeys = new QueryKeyBootstrap(knowledgeApi);
