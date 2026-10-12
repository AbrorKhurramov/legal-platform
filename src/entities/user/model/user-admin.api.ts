import type { TPageableEndpointDTO } from "@/shared/api/api-types";
import { createScopedApi } from "@/shared/api/create-scoped-api";
import { QueryKeyBootstrap } from "@/shared/lib/query-lib";

import type {
  AdminUserDTO,
  AdminUserListRequestParams,
  CreateUserRequestBody,
  CreatedUserDTO,
  TemporaryPasswordDTO,
  UpdateUserRequestBody,
  UserImportDTO,
} from "./user.types";

class UserAdminApi {
  public readonly key = "user-admin-service";

  private readonly scopedApi = createScopedApi("api/v1/admin/users");

  getUsers = async (params: AdminUserListRequestParams) => {
    const response = await this.scopedApi.get<TPageableEndpointDTO<AdminUserDTO[]>>("", { params });
    return response.data;
  };

  createUser = async (body: CreateUserRequestBody) => {
    const response = await this.scopedApi.post<CreatedUserDTO>("", body);
    return response.data;
  };

  updateUser = async ({ id, ...body }: UpdateUserRequestBody) => {
    const response = await this.scopedApi.put<AdminUserDTO>(`/${id}`, body);
    return response.data;
  };

  actionDeactivate = async (id: string) => {
    const response = await this.scopedApi.post<AdminUserDTO>(`/${id}/deactivate`);
    return response.data;
  };

  actionActivate = async (id: string) => {
    const response = await this.scopedApi.post<AdminUserDTO>(`/${id}/activate`);
    return response.data;
  };

  actionResetPassword = async (id: string) => {
    const response = await this.scopedApi.post<TemporaryPasswordDTO>(`/${id}/reset-password`);
    return response.data;
  };

  createImport = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const response = await this.scopedApi.post<UserImportDTO>("/import", form);
    return response.data;
  };
}

export const userAdminApi = new UserAdminApi();
export const userAdminApiQueryKeys = new QueryKeyBootstrap(userAdminApi);
