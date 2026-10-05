import type { TFunction } from "i18next";
import { createColumnHelper } from "local-agro-ui";

import { formatDate } from "@/shared/utils/format-date";

import { RiskLevelTag, type RiskListItemDTO, RiskStatusTag } from "@/entities/risk/risk.entry";

const columnHelper = createColumnHelper<RiskListItemDTO>();

export const getRiskColumns = (t: TFunction<"risk">) => [
  columnHelper.accessor("code", {
    header: t("fields.code"),
    cell: ({ row }) => <span className="font-mono text-xs text-greyscale-700">{row.original.code}</span>,
  }),
  columnHelper.accessor("title", {
    header: t("fields.title"),
    cell: ({ row }) => (
      <span className="flex max-w-lg flex-col">
        <span className="truncate font-medium text-greyscale-900">{row.original.title}</span>
        <span className="truncate text-xs text-greyscale-500">{t(`category.${row.original.category}`)}</span>
      </span>
    ),
  }),
  columnHelper.accessor("level", {
    header: t("fields.level"),
    cell: ({ row }) => (
      <span className="flex items-center gap-2">
        <RiskLevelTag level={row.original.level} />
        <span className="text-xs text-greyscale-500 tabular-nums">{row.original.probability * row.original.impact}</span>
      </span>
    ),
  }),
  columnHelper.accessor("status", {
    header: t("fields.status"),
    cell: ({ row }) => <RiskStatusTag status={row.original.status} />,
  }),
  columnHelper.accessor("owner", {
    header: t("fields.owner"),
    enableSorting: false,
    cell: ({ row }) => <span className="text-greyscale-800">{row.original.owner.fullName}</span>,
  }),
  columnHelper.accessor("dueDate", {
    header: t("fields.dueDate"),
    cell: ({ row }) => formatDate(row.original.dueDate),
  }),
];
