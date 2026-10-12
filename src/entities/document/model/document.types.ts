import type { TPageableRequestParams } from "@/shared/api/api-types";

import type { ContentSource, DocumentFormat, ProcessingStatus } from "./document.const";

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
  id: string;
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
  id: string;
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
