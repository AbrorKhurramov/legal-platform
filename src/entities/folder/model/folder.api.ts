import { createScopedApi } from "@/shared/api/create-scoped-api";
import { QueryKeyBootstrap } from "@/shared/lib/query-lib";

import type { CreateFolderRequestBody, FolderDTO, RenameFolderRequestBody } from "./folder.types";

class FolderApi {
  public readonly key = "folder-service";

  private readonly scopedApi = createScopedApi("api/v1");

  getFolders = async () => {
    const response = await this.scopedApi.get<FolderDTO[]>("/folders");
    return response.data;
  };

  createFolder = async (body: CreateFolderRequestBody) => {
    const response = await this.scopedApi.post<FolderDTO>("/folders", body);
    return response.data;
  };

  actionRename = async ({ id, name }: RenameFolderRequestBody) => {
    const response = await this.scopedApi.put<FolderDTO>(`/folders/${id}`, { name });
    return response.data;
  };

  deleteFolder = async (id: string) => {
    const response = await this.scopedApi.delete<null>(`/folders/${id}`);
    return response.data;
  };
}

export const folderApi = new FolderApi();
export const folderApiQueryKeys = new QueryKeyBootstrap(folderApi);
