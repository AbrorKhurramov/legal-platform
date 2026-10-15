import type { TagColorType } from "local-agro-ui";

import type { IconNameTypes } from "@/shared/ui/icon/icon.entry";

import { ContentSource, DocumentFormat, DocumentStatus, ProcessingStatus, VersionKind } from "../model/document.const";

export const ProcessingStatusColor: Record<ProcessingStatus, TagColorType> = {
  [ProcessingStatus.PENDING]: "Gray",
  [ProcessingStatus.PROCESSING]: "SkyBlue",
  [ProcessingStatus.DONE]: "Green",
  [ProcessingStatus.FAILED]: "Red",
};

export const DocumentStatusConfig: Record<DocumentStatus, { color: TagColorType; icon: IconNameTypes }> = {
  [DocumentStatus.UPLOADED]: { color: "SkyBlue", icon: "upload" },
  [DocumentStatus.EDITED]: { color: "Amber", icon: "pencil" },
  [DocumentStatus.SIGNED]: { color: "GrassGreen", icon: "lock" },
};

/** A version's kind reads as the status it gave the document. */
export const STATUS_BY_VERSION_KIND: Record<VersionKind, DocumentStatus> = {
  [VersionKind.ORIGINAL]: DocumentStatus.UPLOADED,
  [VersionKind.EDIT]: DocumentStatus.EDITED,
  [VersionKind.SIGNED]: DocumentStatus.SIGNED,
};

export const ContentSourceColor: Record<ContentSource, TagColorType> = {
  [ContentSource.OCR]: "Magenta",
  [ContentSource.WORD]: "Blue",
  [ContentSource.EXCEL]: "GrassGreen",
};

export const DocumentFormatConfig: Record<DocumentFormat, { icon: IconNameTypes; className: string }> = {
  [DocumentFormat.PDF]: { icon: "file-text", className: "bg-error-50 text-error-500" },
  [DocumentFormat.DOC]: { icon: "file-text", className: "bg-blue-50 text-blue-500" },
  [DocumentFormat.DOCX]: { icon: "file-text", className: "bg-blue-50 text-blue-500" },
  [DocumentFormat.XLS]: { icon: "layers", className: "bg-success-50 text-success-700" },
  [DocumentFormat.XLSX]: { icon: "layers", className: "bg-success-50 text-success-700" },
  [DocumentFormat.PNG]: { icon: "file", className: "bg-electro-50 text-electro-500" },
  [DocumentFormat.JPEG]: { icon: "file", className: "bg-electro-50 text-electro-500" },
  [DocumentFormat.TIFF]: { icon: "file", className: "bg-electro-50 text-electro-500" },
};
