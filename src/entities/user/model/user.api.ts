import { createScopedApi } from "@/shared/api/create-scoped-api";
import { QueryKeyBootstrap } from "@/shared/lib/query-lib";

import type { UserDTO, UsersRequestParams } from "./user.types";

class UserApi {
  public readonly key = "user-service";

  private readonly scopedApi = createScopedApi("user-service");

  getMe = async () => {
    const response = await this.scopedApi.get<UserDTO>("/users/me", undefined, false);
    return response.data;
  };

  getUsers = async (params: UsersRequestParams) => {
    const response = await this.scopedApi.get<UserDTO[]>("/users", { params });
    return response.data;
  };
}

export const userApi = new UserApi();
export const userApiQueryKeys = new QueryKeyBootstrap(userApi);
