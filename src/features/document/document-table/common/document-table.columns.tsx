import type { TFunction } from "i18next";
import { createColumnHelper } from "local-agro-ui";

import { formatDate } from "@/shared/utils/format-date";

import {
  ContentSourceTag,
  DocTypeLabel,
  type DocumentListItemDTO,
  FileNameCell,
  FolderName,
  NeedsReviewBadge,
} from "@/entities/document/document.entry";

const columnHelper = createColumnHelper<DocumentListItemDTO>();

export const getDocumentColumns = (t: TFunction<"document">) => [
  columnHelper.accessor("originalName", {
    header: t("columns.document"),
    cell: ({ row }) => (
      <span className="flex max-w-xl flex-col gap-1">
        <FileNameCell name={row.original.originalName} format={row.original.format} confidential={row.original.confidential} />
        {row.original.snippet && <span className="line-clamp-2 pl-12 text-xs whitespace-normal text-greyscale-500">{row.original.snippet}</span>}
      </span>
    ),
  }),
  columnHelper.accessor("folder", {
    header: t("columns.folder"),
    enableSorting: false,
    cell: ({ row }) => <FolderName name={row.original.folder?.name} emptyLabel={t("folders.unfiled")} />,
  }),
  columnHelper.accessor("docType", {
    header: t("columns.docType"),
    cell: ({ row }) => (
      <span className="flex flex-col items-start gap-1">
        <DocTypeLabel docType={row.original.docType} />
        {row.original.needsReview && <NeedsReviewBadge />}
      </span>
    ),
  }),
  columnHelper.accessor("source", {
    header: t("columns.source"),
    cell: ({ row }) => <ContentSourceTag source={row.original.source} />,
  }),
  columnHelper.accessor("pageCount", {
    header: t("columns.pages"),
    cell: ({ row }) => <span className="tabular-nums">{row.original.pageCount ?? "—"}</span>,
  }),
  columnHelper.accessor("uploadedBy", {
    header: t("columns.uploadedBy"),
    enableSorting: false,
    cell: ({ row }) => (
      <span className="flex flex-col">
        <span className="text-greyscale-800">{row.original.uploadedBy.fullName}</span>
        <span className="text-xs text-greyscale-500">{formatDate(row.original.createdAt)}</span>
      </span>
    ),
  }),
];
