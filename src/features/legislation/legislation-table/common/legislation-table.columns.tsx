import type { TFunction } from "i18next";
import { createColumnHelper } from "local-agro-ui";
import { twMerge } from "tailwind-merge";

import { daysUntil, formatDate } from "@/shared/utils/format-date";

import { ImpactLevelTag, type LegislationListItemDTO, LegislationStatus, LegislationStatusTag } from "@/entities/legislation/legislation.entry";

const columnHelper = createColumnHelper<LegislationListItemDTO>();

const URGENT_DAYS = 14;

export const getLegislationColumns = (t: TFunction<"legislation">) => [
  columnHelper.accessor("title", {
    header: t("fields.title"),
    cell: ({ row }) => (
      <span className="flex max-w-xl flex-col">
        <span className="truncate font-medium text-greyscale-900">{row.original.title}</span>
        <span className="truncate text-xs text-greyscale-500">{`${row.original.docNumber} · ${t(`source.${row.original.source}`)}`}</span>
      </span>
    ),
  }),
  columnHelper.accessor("impactLevel", {
    header: t("fields.impactLevel"),
    cell: ({ row }) => <ImpactLevelTag level={row.original.impactLevel} />,
  }),
  columnHelper.accessor("status", {
    header: t("fields.status"),
    cell: ({ row }) => <LegislationStatusTag status={row.original.status} />,
  }),
  columnHelper.accessor("effectiveAt", {
    header: t("fields.effectiveAt"),
    cell: ({ row }) => {
      const days = daysUntil(row.original.effectiveAt);
      const isUrgent = row.original.status !== LegislationStatus.IMPLEMENTED && days >= 0 && days <= URGENT_DAYS;
      return (
        <span className="flex flex-col">
          <span className={twMerge("text-greyscale-800", isUrgent && "font-semibold text-error-500")}>{formatDate(row.original.effectiveAt)}</span>
          {isUrgent && <span className="text-xs text-error-500">{t("daysLeft", { count: days })}</span>}
        </span>
      );
    },
  }),
  columnHelper.accessor("tasksDone", {
    header: t("fields.progress"),
    enableSorting: false,
    cell: ({ row }) => {
      const { tasksDone, tasksTotal } = row.original;
      return (
        <span className="flex w-28 flex-col gap-1">
          <span className="text-xs text-greyscale-700">{tasksTotal ? `${tasksDone}/${tasksTotal}` : "—"}</span>
          <svg viewBox="0 0 100 6" preserveAspectRatio="none" className="h-1.5 w-full" aria-hidden>
            <rect width="100" height="6" rx="3" className="fill-greyscale-200" />
            <rect width={tasksTotal ? (tasksDone / tasksTotal) * 100 : 0} height="6" rx="3" className="fill-main-green-500" />
          </svg>
        </span>
      );
    },
  }),
  columnHelper.accessor("responsible", {
    header: t("fields.responsible"),
    enableSorting: false,
    cell: ({ row }) => <span className="text-greyscale-800">{row.original.responsible.fullName}</span>,
  }),
];
