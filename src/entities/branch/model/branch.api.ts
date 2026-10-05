import { createScopedApi } from "@/shared/api/create-scoped-api";
import { QueryKeyBootstrap } from "@/shared/lib/query-lib";

import type { BranchDTO } from "./branch.types";

class BranchApi {
  public readonly key = "branch-service";

  private readonly scopedApi = createScopedApi("branch-service");

  getBranches = async () => {
    const response = await this.scopedApi.get<BranchDTO[]>("/branches");
    return response.data;
  };
}

export const branchApi = new BranchApi();
export const branchApiQueryKeys = new QueryKeyBootstrap(branchApi);
