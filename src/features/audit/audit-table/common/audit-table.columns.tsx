import type { TFunction } from "i18next";
import { createColumnHelper } from "local-agro-ui";

import { formatDateTime } from "@/shared/utils/format-date";

import { AuditActionTag, type AuditLogDTO } from "@/entities/audit/audit.entry";

const columnHelper = createColumnHelper<AuditLogDTO>();

export const getAuditColumns = (t: TFunction<["audit", "common"]>) => [
  columnHelper.accessor("createdAt", {
    header: t("audit:fields.createdAt"),
    cell: ({ row }) => <span className="text-xs text-greyscale-700 tabular-nums">{formatDateTime(row.original.createdAt)}</span>,
  }),
  columnHelper.accessor("user", {
    header: t("audit:fields.user"),
    enableSorting: false,
    cell: ({ row }) => (
      <span className="flex flex-col">
        <span className="text-greyscale-900">{row.original.user.fullName}</span>
        <span className="text-xs text-greyscale-500">{t(`common:role.${row.original.role}`)}</span>
      </span>
    ),
  }),
  columnHelper.accessor("action", {
    header: t("audit:fields.action"),
    cell: ({ row }) => <AuditActionTag action={row.original.action} />,
  }),
  columnHelper.accessor("entityType", {
    header: t("audit:fields.entity"),
    cell: ({ row }) => (
      <span className="flex flex-col">
        <span className="text-greyscale-800">{t(`audit:entityType.${row.original.entityType}`)}</span>
        {row.original.entityRef && <span className="font-mono text-xs text-greyscale-500">{row.original.entityRef}</span>}
      </span>
    ),
  }),
  columnHelper.accessor("details", {
    header: t("audit:fields.details"),
    enableSorting: false,
    cell: ({ row }) => <span className="block max-w-sm truncate text-greyscale-700">{row.original.details}</span>,
  }),
  columnHelper.accessor("ip", {
    header: t("audit:fields.ip"),
    cell: ({ row }) => <span className="font-mono text-xs text-greyscale-500">{row.original.ip}</span>,
  }),
];
