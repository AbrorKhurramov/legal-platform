import { createScopedApi } from "@/shared/api/create-scoped-api";
import { QueryKeyBootstrap } from "@/shared/lib/query-lib";

import type { DemoAccountDTO, LoginRequestBody, LoginResponseDTO } from "./auth.types";

class AuthApi {
  public readonly key = "auth-service";

  private readonly scopedApi = createScopedApi("auth-service");

  createLogin = async (body: LoginRequestBody) => {
    const response = await this.scopedApi.post<LoginResponseDTO>("/login", body, undefined, false);
    return response.data;
  };

  createLogout = async () => {
    const response = await this.scopedApi.post<void>("/logout", undefined, undefined, false);
    return response.data;
  };

  createDemoReset = async () => {
    const response = await this.scopedApi.post<void>("/demo-reset");
    return response.data;
  };

  getDemoAccounts = async () => {
    const response = await this.scopedApi.get<DemoAccountDTO[]>("/demo-accounts", undefined, false);
    return response.data;
  };
}

export const authApi = new AuthApi();
export const authApiQueryKeys = new QueryKeyBootstrap(authApi);
