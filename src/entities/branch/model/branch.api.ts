import { createScopedApi } from "@/shared/api/create-scoped-api";
import { QueryKeyBootstrap } from "@/shared/lib/query-lib";

import type { BranchDTO } from "./branch.types";

class BranchApi {
  public readonly key = "branch-service";

  private readonly scopedApi = createScopedApi("branch-service");

  private readonly backendApi = createScopedApi("api/v1");

  getBranches = async () => {
    const response = await this.scopedApi.get<BranchDTO[]>("/branches");
    return response.data;
  };

  /** From the real backend; the mock-backed tabs keep {@link getBranches} until they migrate. */
  getDirectoryBranches = async () => {
    const response = await this.backendApi.get<BranchDTO[]>("/branches");
    return response.data;
  };
}

export const branchApi = new BranchApi();
export const branchApiQueryKeys = new QueryKeyBootstrap(branchApi);
