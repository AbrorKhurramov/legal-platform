import type { TFunction } from "i18next";
import { createColumnHelper } from "local-agro-ui";
import { twMerge } from "tailwind-merge";

import { daysUntil, formatDate } from "@/shared/utils/format-date";
import { formatMoneyShort } from "@/shared/utils/format-number";

import { type CourtCaseListItemDTO, CourtCaseResultTag, CourtCaseStageTag } from "@/entities/court-case/court-case.entry";

const columnHelper = createColumnHelper<CourtCaseListItemDTO>();

const SOON_DAYS = 7;

export const getCourtCaseColumns = (t: TFunction<"court">) => [
  columnHelper.accessor("caseNumber", {
    header: t("fields.caseNumber"),
    cell: ({ row }) => (
      <span className="flex flex-col">
        <span className="font-mono text-xs text-greyscale-800">{row.original.caseNumber}</span>
        <span className="text-xs text-greyscale-500">{t(`category.${row.original.category}`)}</span>
      </span>
    ),
  }),
  columnHelper.accessor("defendant", {
    header: t("fields.parties"),
    enableSorting: false,
    cell: ({ row }) => (
      <span className="flex max-w-72 flex-col">
        <span className="truncate text-greyscale-900">{row.original.plaintiff}</span>
        <span className="truncate text-xs text-greyscale-500">{`→ ${row.original.defendant}`}</span>
      </span>
    ),
  }),
  columnHelper.accessor("court", {
    header: t("fields.court"),
    cell: ({ row }) => <span className="block max-w-56 truncate text-greyscale-700">{row.original.court}</span>,
  }),
  columnHelper.accessor("stage", {
    header: t("fields.stage"),
    cell: ({ row }) => <CourtCaseStageTag stage={row.original.stage} />,
  }),
  columnHelper.accessor("result", {
    header: t("fields.result"),
    cell: ({ row }) => <CourtCaseResultTag result={row.original.result} />,
  }),
  columnHelper.accessor("claimAmount", {
    header: t("fields.claimAmount"),
    cell: ({ row }) => (
      <span className="flex flex-col tabular-nums">
        <span className="text-greyscale-900">{formatMoneyShort(row.original.claimAmount)}</span>
        {row.original.recoveredAmount > 0 && (
          <span className="text-xs text-success-700">{`+ ${formatMoneyShort(row.original.recoveredAmount)}`}</span>
        )}
      </span>
    ),
  }),
  columnHelper.accessor("nextHearingDate", {
    header: t("fields.nextHearingDate"),
    cell: ({ row }) => {
      const date = row.original.nextHearingDate;
      const days = date ? daysUntil(date) : null;
      return (
        <span className={twMerge("text-greyscale-800", days !== null && days >= 0 && days <= SOON_DAYS && "font-semibold text-warning-600")}>
          {formatDate(date)}
        </span>
      );
    },
  }),
];
