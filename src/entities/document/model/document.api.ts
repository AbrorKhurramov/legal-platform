import { axiosInstance } from "@/shared/api/api-instance";
import type { TPageableEndpointDTO } from "@/shared/api/api-types";
import { createScopedApi } from "@/shared/api/create-scoped-api";
import { downloadFile } from "@/shared/api/download-file";
import { QueryKeyBootstrap } from "@/shared/lib/query-lib";

import type {
  DocumentDetailDTO,
  DocumentListItemDTO,
  DocumentListRequestParams,
  FileListRequestParams,
  FileManagerItemDTO,
  MoveFileRequestBody,
  OcrDocTypeDTO,
  UploadFilesRequestBody,
} from "./document.types";

const BACKEND_PREFIX = "api/v1";

class DocumentApi {
  public readonly key = "document-service";

  private readonly scopedApi = createScopedApi(BACKEND_PREFIX);

  createUpload = async (body: UploadFilesRequestBody) => {
    const form = new FormData();
    body.files.forEach((file) => form.append("files", file));
    const response = await this.scopedApi.post<FileManagerItemDTO[]>("/files", form, {
      params: { confidential: body.confidential, folderId: body.folderId },
    });
    return response.data;
  };

  getFiles = async (params: FileListRequestParams) => {
    const response = await this.scopedApi.get<TPageableEndpointDTO<FileManagerItemDTO[]>>("/files", { params });
    return response.data;
  };

  actionReprocess = async (fileId: string) => {
    const response = await this.scopedApi.post<FileManagerItemDTO>(`/files/${fileId}/reprocess`);
    return response.data;
  };

  actionMoveToFolder = async ({ fileId, folderId }: MoveFileRequestBody) => {
    const response = await this.scopedApi.patch<FileManagerItemDTO>(`/files/${fileId}/folder`, { folderId });
    return response.data;
  };

  getDocuments = async (params: DocumentListRequestParams) => {
    const response = await this.scopedApi.get<TPageableEndpointDTO<DocumentListItemDTO[]>>("/documents", { params });
    return response.data;
  };

  getDocumentDetail = async (fileId: string) => {
    const response = await this.scopedApi.get<DocumentDetailDTO>(`/documents/${fileId}`);
    return response.data;
  };

  getDocTypes = async () => {
    const response = await this.scopedApi.get<OcrDocTypeDTO[]>("/ocr/doc-types", undefined, false);
    return response.data;
  };

  /** The original bytes for the in-page viewer; no envelope, like the download. */
  getOriginal = async (fileId: string) => {
    const response = await axiosInstance.get<ArrayBuffer>(`/${BACKEND_PREFIX}/files/${fileId}/content`, { responseType: "arraybuffer" });
    return response.data;
  };

  actionDownload = async (fileId: string, fallbackName: string) => downloadFile(`/${BACKEND_PREFIX}/files/${fileId}/content`, fallbackName);
}

export const documentApi = new DocumentApi();
export const documentApiQueryKeys = new QueryKeyBootstrap(documentApi);
