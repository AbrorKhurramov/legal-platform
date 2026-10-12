import { createScopedApi } from "@/shared/api/create-scoped-api";
import { QueryKeyBootstrap } from "@/shared/lib/query-lib";

import type { ChangePasswordRequestBody, DemoAccountDTO, LoginRequestBody, LoginResponseDTO } from "./auth.types";

class AuthApi {
  public readonly key = "auth-service";

  private readonly scopedApi = createScopedApi("auth-service");

  private readonly backendApi = createScopedApi("api/v1/auth");

  createLogin = async (body: LoginRequestBody) => {
    const response = await this.backendApi.post<LoginResponseDTO>("/login", body, undefined, false);
    return response.data;
  };

  createLogout = async () => {
    const response = await this.backendApi.post<void>("/logout", undefined, undefined, false);
    return response.data;
  };

  actionChangePassword = async (body: ChangePasswordRequestBody) => {
    const response = await this.backendApi.post<LoginResponseDTO>("/change-password", body);
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
