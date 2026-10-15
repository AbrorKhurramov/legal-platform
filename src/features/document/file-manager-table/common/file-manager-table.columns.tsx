import type { TFunction } from "i18next";
import { Button, IconButton, createColumnHelper } from "local-agro-ui";

import { Icon } from "@/shared/ui/icon/icon.entry";
import { formatDateTime } from "@/shared/utils/format-date";
import { stop } from "@/shared/utils/stop-propagation";

import {
  ContentSourceTag,
  DocTypeLabel,
  DocumentStatusTag,
  type FileManagerItemDTO,
  FileNameCell,
  FolderName,
  ProcessingStatus,
  ProcessingStatusTag,
} from "@/entities/document/document.entry";

const columnHelper = createColumnHelper<FileManagerItemDTO>();

interface IFileManagerColumnHandlers {
  onReprocess(id: string): void;
  onMove(file: FileManagerItemDTO): void;
}

export const getFileManagerColumns = (t: TFunction<"document">, handlers: IFileManagerColumnHandlers) => [
  columnHelper.accessor("originalName", {
    header: t("columns.file"),
    cell: ({ row }) => (
      <FileNameCell
        name={row.original.originalName}
        format={row.original.format}
        sizeBytes={row.original.sizeBytes}
        confidential={row.original.confidential}
      />
    ),
  }),
  columnHelper.accessor("documentStatus", {
    header: t("columns.documentStatus"),
    enableSorting: false,
    cell: ({ row }) => (
      <span className="flex flex-col items-start gap-1">
        <DocumentStatusTag status={row.original.documentStatus} />
        {row.original.versionNo > 1 && (
          <span className="text-xs text-greyscale-500">{t("versions.versionLabel", { number: row.original.versionNo })}</span>
        )}
      </span>
    ),
  }),
  columnHelper.accessor("folder", {
    header: t("columns.folder"),
    enableSorting: false,
    cell: ({ row }) => <FolderName name={row.original.folder?.name} emptyLabel={t("folders.unfiled")} />,
  }),
  columnHelper.accessor("status", {
    header: t("columns.status"),
    cell: ({ row }) => (
      <span className="flex flex-col items-start gap-1">
        <ProcessingStatusTag status={row.original.status} />
        {row.original.status === ProcessingStatus.FAILED && row.original.errorMessage && (
          <span className="max-w-60 truncate text-xs text-error-500" title={row.original.errorMessage}>
            {row.original.errorMessage}
          </span>
        )}
        {row.original.status === ProcessingStatus.PENDING && row.original.attempts > 0 && (
          <span className="text-xs text-warning-600">{t("retrying", { count: row.original.attempts })}</span>
        )}
      </span>
    ),
  }),
  columnHelper.accessor("source", {
    header: t("columns.source"),
    cell: ({ row }) => <ContentSourceTag source={row.original.source} />,
  }),
  columnHelper.accessor("docType", {
    header: t("columns.docType"),
    cell: ({ row }) => <DocTypeLabel docType={row.original.status === ProcessingStatus.DONE ? row.original.docType : null} />,
  }),
  columnHelper.accessor("uploadedBy", {
    header: t("columns.uploadedBy"),
    enableSorting: false,
    cell: ({ row }) => (
      <span className="flex flex-col">
        <span className="text-greyscale-800">{row.original.uploadedBy.fullName}</span>
        <span className="text-xs text-greyscale-500">{formatDateTime(row.original.createdAt)}</span>
      </span>
    ),
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="flex items-center justify-end gap-2">
        {(row.original.status === ProcessingStatus.FAILED || row.original.status === ProcessingStatus.DONE) && (
          <Button
            sizeType="xs"
            variantType="Outlined"
            colorType="Gray"
            leftIcon={<Icon name="refresh" className="size-3.5" />}
            onClick={stop(() => handlers.onReprocess(row.original.id))}
          >
            {t("reprocess")}
          </Button>
        )}
        <IconButton
          sizeType="xs"
          variantType="Outlined"
          colorType="Gray"
          aria-label={t("move.title")}
          title={t("move.title")}
          onClick={stop(() => handlers.onMove(row.original))}
        >
          <Icon name="folder" className="size-3.5" />
        </IconButton>
      </span>
    ),
  }),
];
