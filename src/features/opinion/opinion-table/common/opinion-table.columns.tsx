import type { TFunction } from "i18next";
import { createColumnHelper } from "local-agro-ui";

import { formatDate } from "@/shared/utils/format-date";

import { type OpinionListItemDTO, OpinionResultTag, OpinionStatusTag } from "@/entities/opinion/opinion.entry";

const columnHelper = createColumnHelper<OpinionListItemDTO>();

export const getOpinionColumns = (t: TFunction<["opinion", "matter"]>) => [
  columnHelper.accessor("number", {
    header: t("opinion:fields.number"),
    cell: ({ row }) => <span className="font-mono text-xs text-greyscale-700">{row.original.number}</span>,
  }),
  columnHelper.accessor("matterTitle", {
    header: t("opinion:fields.matter"),
    cell: ({ row }) => (
      <span className="flex max-w-md flex-col">
        <span className="truncate font-medium text-greyscale-900">{row.original.matterTitle}</span>
        <span className="truncate text-xs text-greyscale-500">{`${row.original.matterNumber} · ${t(`matter:type.${row.original.matterType}`)}`}</span>
      </span>
    ),
  }),
  columnHelper.accessor("result", {
    header: t("opinion:fields.result"),
    cell: ({ row }) => <OpinionResultTag result={row.original.result} />,
  }),
  columnHelper.accessor("status", {
    header: t("opinion:fields.status"),
    cell: ({ row }) => <OpinionStatusTag status={row.original.status} />,
  }),
  columnHelper.accessor("lawyer", {
    header: t("opinion:fields.lawyer"),
    enableSorting: false,
    cell: ({ row }) => <span className="text-greyscale-800">{row.original.lawyer.fullName}</span>,
  }),
  columnHelper.accessor("createdAt", {
    header: t("opinion:fields.createdAt"),
    cell: ({ row }) => formatDate(row.original.createdAt),
  }),
  columnHelper.accessor("approvedAt", {
    header: t("opinion:fields.approvedAt"),
    cell: ({ row }) => (
      <span className="flex flex-col">
        <span>{formatDate(row.original.approvedAt)}</span>
        {row.original.approvedBy && <span className="text-xs text-greyscale-500">{row.original.approvedBy.fullName}</span>}
      </span>
    ),
  }),
];
