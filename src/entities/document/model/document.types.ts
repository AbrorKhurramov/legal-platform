import type { TPageableRequestParams } from "@/shared/api/api-types";

import type { ContentSource, DocumentFormat, DocumentStatus, ProcessingStatus, VersionKind } from "./document.const";

export interface UserRefDTO {
  id: string;
  fullName: string;
}

export interface DocumentFolderRefDTO {
  id: string;
  name: string;
}

export interface FileManagerItemDTO {
  id: string;
  /** Stable across versions; the detail page and history use it. */
  documentId: string;
  versionNo: number;
  documentStatus: DocumentStatus;
  originalName: string;
  format: DocumentFormat;
  sizeBytes: number;
  confidential: boolean;
  folder: DocumentFolderRefDTO | null;
  uploadedBy: UserRefDTO;
  createdAt: string;
  status: ProcessingStatus;
  source: ContentSource;
  attempts: number;
  docType: string | null;
  needsReview: boolean;
  errorMessage: string | null;
  processedAt: string | null;
}

export interface DocumentListItemDTO {
  /** The shown version: the newest one that finished processing. */
  id: string;
  documentId: string;
  versionNo: number;
  documentStatus: DocumentStatus;
  lastEditedBy: UserRefDTO | null;
  lastEditedAt: string | null;
  originalName: string;
  format: DocumentFormat;
  source: ContentSource;
  docType: string | null;
  language: string | null;
  pageCount: number | null;
  needsReview: boolean;
  confidential: boolean;
  folder: DocumentFolderRefDTO | null;
  uploadedBy: UserRefDTO;
  createdAt: string;
  processedAt: string | null;
  snippet: string | null;
}

export interface DocumentBlockDTO {
  type: "heading" | "paragraph" | "table" | "stamp" | "signature";
  text: string;
  level: number | null;
  rows: string[][] | null;
  headerRows: number | null;
  /** [row, col, rows, cols], zero-based */
  spans: number[][] | null;
}

export interface DocumentPageDTO {
  number: number;
  source: string;
  title: string | null;
  language: string | null;
  confidence: number | null;
  blocks: DocumentBlockDTO[];
  text: string;
}

export interface DocumentFieldDTO {
  name: string;
  value: string;
  quote: string;
  page: number | null;
  confidence: number;
  needsConfirmation: boolean;
}

export interface DocumentStampDTO {
  page: number;
  kind: string;
  text: string;
  organization: string | null;
  date: string | null;
  dateText: string | null;
  number: string | null;
  person: string | null;
  handwritten: string[];
  needsConfirmation: boolean;
}

export interface DocumentDetailDTO {
  /** The viewed version. */
  id: string;
  documentId: string;
  versionNo: number;
  versionKind: VersionKind;
  versionComment: string | null;
  latestVersionNo: number;
  /** From the latest version, whichever version is viewed. */
  documentStatus: DocumentStatus;
  documentCreatedBy: UserRefDTO;
  documentCreatedAt: string;
  lastEditedBy: UserRefDTO | null;
  lastEditedAt: string | null;
  originalName: string;
  format: DocumentFormat;
  contentType: string;
  sizeBytes: number;
  sha256: string;
  confidential: boolean;
  folder: DocumentFolderRefDTO | null;
  uploadedBy: UserRefDTO;
  createdAt: string;
  status: ProcessingStatus;
  source: ContentSource;
  docType: string | null;
  language: string | null;
  confidence: number | null;
  needsReview: boolean;
  pageCount: number | null;
  processedAt: string | null;
  errorMessage: string | null;
  pages: DocumentPageDTO[];
  fields: DocumentFieldDTO[];
  stamps: DocumentStampDTO[];
  warnings: string[];
}

export interface OcrFieldInfoDTO {
  name: string;
  labelUz: string;
  labelRu: string;
}

export interface OcrDocTypeDTO {
  code: string;
  labelUz: string;
  labelRu: string;
  fields: OcrFieldInfoDTO[];
}

export interface FileListRequestParams extends TPageableRequestParams {
  search?: string;
  status?: ProcessingStatus;
  mineOnly?: boolean;
}

export interface DocumentListRequestParams extends TPageableRequestParams {
  search?: string;
  docType?: string;
  source?: ContentSource;
  needsReview?: boolean;
  /** The folder and everything below it. */
  folderId?: string;
  status?: DocumentStatus;
}

export interface DocumentVersionDTO {
  id: string;
  versionNo: number;
  versionKind: VersionKind;
  comment: string | null;
  originalName: string;
  format: DocumentFormat;
  sizeBytes: number;
  uploadedBy: UserRefDTO;
  createdAt: string;
  status: ProcessingStatus;
  latest: boolean;
}

export interface AddVersionRequestBody {
  /** Any version id of the document. */
  fileId: string;
  file: File;
  comment: string;
  /** The signed copy locks the document. */
  signed: boolean;
}

export interface UploadFilesRequestBody {
  files: File[];
  confidential: boolean;
  folderId: string;
}

export interface MoveFileRequestBody {
  fileId: string;
  folderId: string;
}
