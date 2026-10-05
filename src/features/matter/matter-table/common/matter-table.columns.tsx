import type { TFunction } from "i18next";
import { createColumnHelper } from "local-agro-ui";

import { Icon } from "@/shared/ui/icon/icon.entry";

import { MatterDeadline, type MatterListItemDTO, MatterPriorityTag, MatterStatus, MatterStatusTag } from "@/entities/matter/matter.entry";
import { UserCell } from "@/entities/user/user.entry";

const columnHelper = createColumnHelper<MatterListItemDTO>();

export const getMatterColumns = (t: TFunction<["matter", "common"]>) => [
  columnHelper.accessor("number", {
    header: t("matter:fields.number"),
    cell: ({ row }) => (
      <span className="flex items-center gap-1.5 font-mono text-xs text-greyscale-700">
        {row.original.confidential && <Icon name="lock" className="size-3.5 text-error-400" />}
        {row.original.number}
      </span>
    ),
  }),
  columnHelper.accessor("title", {
    header: t("matter:fields.title"),
    cell: ({ row }) => (
      <span className="flex max-w-80 flex-col">
        <span className="truncate font-medium text-greyscale-900">{row.original.title}</span>
        <span className="truncate text-xs text-greyscale-500">{t(`matter:type.${row.original.type}`)}</span>
      </span>
    ),
  }),
  columnHelper.accessor("status", {
    header: t("matter:fields.status"),
    cell: ({ row }) => (
      <span className="flex flex-col items-start gap-1">
        <MatterStatusTag status={row.original.status} />
        <MatterPriorityTag priority={row.original.priority} />
      </span>
    ),
  }),
  columnHelper.accessor("branch", {
    header: t("matter:fields.initiator"),
    enableSorting: false,
    cell: ({ row }) => (
      <span className="flex max-w-44 flex-col">
        <span className="truncate text-greyscale-800">{row.original.initiator.fullName}</span>
        <span className="truncate text-xs text-greyscale-500">{row.original.branch.name}</span>
      </span>
    ),
  }),
  columnHelper.accessor("lawyer", {
    header: t("matter:fields.lawyer"),
    enableSorting: false,
    cell: ({ row }) => <UserCell user={row.original.lawyer} />,
  }),
  columnHelper.accessor("dueDate", {
    header: t("matter:fields.dueDate"),
    cell: ({ row }) => (
      <MatterDeadline
        dueDate={row.original.dueDate}
        isOverdue={row.original.isOverdue}
        isPaused={row.original.isDeadlinePaused}
        isClosed={row.original.status === MatterStatus.COMPLETED || row.original.status === MatterStatus.REJECTED}
      />
    ),
  }),
];
