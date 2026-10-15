import i18next from "i18next";
import type { SelectOptionType } from "local-agro-ui";

export const enum ProcessingStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  DONE = "DONE",
  FAILED = "FAILED",
}

export const enum ContentSource {
  OCR = "OCR",
  WORD = "WORD",
  EXCEL = "EXCEL",
}

export const enum DocumentFormat {
  PDF = "PDF",
  DOC = "DOC",
  DOCX = "DOCX",
  XLS = "XLS",
  XLSX = "XLSX",
  PNG = "PNG",
  JPEG = "JPEG",
  TIFF = "TIFF",
}

export const enum VersionKind {
  ORIGINAL = "ORIGINAL",
  EDIT = "EDIT",
  SIGNED = "SIGNED",
}

/** Derived on the backend from the kind of the document's latest version. */
export const enum DocumentStatus {
  UPLOADED = "UPLOADED",
  EDITED = "EDITED",
  SIGNED = "SIGNED",
}

export const DOCUMENT_STATUSES: DocumentStatus[] = [DocumentStatus.UPLOADED, DocumentStatus.EDITED, DocumentStatus.SIGNED];

export const DOC_TYPES = ["contract", "court_decision", "power_of_attorney", "letter", "other"] as const;
export type DocType = (typeof DOC_TYPES)[number];

export const PROCESSING_STATUSES: ProcessingStatus[] = [
  ProcessingStatus.PENDING,
  ProcessingStatus.PROCESSING,
  ProcessingStatus.DONE,
  ProcessingStatus.FAILED,
];

export const CONTENT_SOURCES: ContentSource[] = [ContentSource.OCR, ContentSource.WORD, ContentSource.EXCEL];

export const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".png", ".jpg", ".jpeg", ".tif", ".tiff"];
export const MAX_FILE_BYTES = 50 * 1024 * 1024;
export const MAX_FILES_PER_UPLOAD = 20;

export const getProcessingStatusOptions = (): SelectOptionType<ProcessingStatus>[] =>
  PROCESSING_STATUSES.map((value) => ({ label: i18next.t(`status.${value}`, { ns: "document" }), value }));

export const getDocTypeOptions = (): SelectOptionType<DocType>[] =>
  DOC_TYPES.map((value) => ({ label: i18next.t(`docType.${value}`, { ns: "document" }), value }));

export const getDocumentStatusOptions = (): SelectOptionType<DocumentStatus>[] =>
  DOCUMENT_STATUSES.map((value) => ({ label: i18next.t(`documentStatus.${value}`, { ns: "document" }), value }));

export const getContentSourceOptions = (): SelectOptionType<ContentSource>[] =>
  CONTENT_SOURCES.map((value) => ({ label: i18next.t(`source.${value}`, { ns: "document" }), value }));
