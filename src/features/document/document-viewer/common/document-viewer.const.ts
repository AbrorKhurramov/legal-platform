import { DocumentFormat } from "@/entities/document/document.entry";

export const enum ViewerKind {
  PDF = "pdf",
  IMAGE = "image",
  DOCX = "docx",
  XLSX = "xlsx",
  NONE = "none",
}

/**
 * Legacy DOC and XLS have no browser renderer, and only Safari draws TIFF;
 * those fall back to the extracted text plus the download button.
 */
export const VIEWER_BY_FORMAT: Record<DocumentFormat, ViewerKind> = {
  [DocumentFormat.PDF]: ViewerKind.PDF,
  [DocumentFormat.PNG]: ViewerKind.IMAGE,
  [DocumentFormat.JPEG]: ViewerKind.IMAGE,
  [DocumentFormat.TIFF]: ViewerKind.NONE,
  [DocumentFormat.DOCX]: ViewerKind.DOCX,
  [DocumentFormat.DOC]: ViewerKind.NONE,
  [DocumentFormat.XLSX]: ViewerKind.XLSX,
  [DocumentFormat.XLS]: ViewerKind.NONE,
};

/** A sheet past these limits is cut, with a note; the download has the rest. */
export const XLSX_MAX_ROWS = 1000;
export const XLSX_MAX_COLUMNS = 60;
