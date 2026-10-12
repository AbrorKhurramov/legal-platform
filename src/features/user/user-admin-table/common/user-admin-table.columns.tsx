import type { TFunction } from "i18next";
import { IconButton, Tag, Toggle, createColumnHelper } from "local-agro-ui";

import { Icon } from "@/shared/ui/icon/icon.entry";
import { formatDateTime } from "@/shared/utils/format-date";
import { stop } from "@/shared/utils/stop-propagation";

import { type AdminUserDTO, RoleTag, UserAvatar, UserRole } from "@/entities/user/user.entry";

const columnHelper = createColumnHelper<AdminUserDTO>();

interface IUserAdminColumnHandlers {
  currentUserId?: string;
  onEdit(user: AdminUserDTO): void;
  onToggleFileManager(user: AdminUserDTO): void;
  onResetPassword(user: AdminUserDTO): void;
  onToggleActive(user: AdminUserDTO): void;
}

const isLocked = (user: AdminUserDTO) => !!user.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now();

const StatusTags = ({ user, t }: { user: AdminUserDTO; t: TFunction<"admin"> }) => (
  <span className="flex flex-col items-start gap-1">
    <Tag colorType={user.active ? "GrassGreen" : "Gray"} sizeType="sm" rounded>
      {user.active ? t("status.active") : t("status.blocked")}
    </Tag>
    {isLocked(user) && (
      <Tag colorType="Orange" sizeType="sm" rounded>
        {t("status.locked")}
      </Tag>
    )}
    {user.active && user.mustChangePassword && <span className="text-xs text-warning-600">{t("status.mustChangePassword")}</span>}
  </span>
);

export const getUserAdminColumns = (t: TFunction<"admin">, handlers: IUserAdminColumnHandlers) => [
  columnHelper.accessor("fullName", {
    header: t("fields.fullName"),
    cell: ({ row }) => (
      <span className="flex items-center gap-3">
        <UserAvatar fullName={row.original.fullName} className="size-8 shrink-0 text-xs" />
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-greyscale-900">{row.original.fullName}</span>
          <span className="truncate text-xs text-greyscale-500">
            {row.original.username}
            {row.original.position && ` · ${row.original.position}`}
          </span>
        </span>
      </span>
    ),
  }),
  columnHelper.accessor("role", {
    header: t("fields.role"),
    cell: ({ row }) => <RoleTag role={row.original.role} />,
  }),
  columnHelper.accessor("branch", {
    header: t("fields.branch"),
    enableSorting: false,
    cell: ({ row }) => <span className="text-sm text-greyscale-800">{row.original.branch.name}</span>,
  }),
  columnHelper.accessor("fileManagerAccess", {
    header: t("fields.fileManagerShort"),
    enableSorting: false,
    cell: ({ row }) =>
      row.original.role === UserRole.ADMIN ? (
        <span className="text-greyscale-400">—</span>
      ) : (
        <span onClick={(event) => event.stopPropagation()}>
          <Toggle
            checked={row.original.fileManagerAccess}
            disabled={!row.original.active}
            aria-label={t("fields.fileManagerAccess")}
            onChange={() => handlers.onToggleFileManager(row.original)}
          />
        </span>
      ),
  }),
  columnHelper.accessor("active", {
    header: t("fields.status"),
    enableSorting: false,
    cell: ({ row }) => <StatusTags user={row.original} t={t} />,
  }),
  columnHelper.accessor("lastLoginAt", {
    header: t("fields.lastLogin"),
    enableSorting: false,
    cell: ({ row }) => <span className="text-sm whitespace-nowrap text-greyscale-700">{formatDateTime(row.original.lastLoginAt)}</span>,
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) => {
      const isSelf = row.original.id === handlers.currentUserId;
      return (
        <span className="flex items-center justify-end gap-1.5">
          <IconButton
            sizeType="xs"
            variantType="Outlined"
            colorType="Gray"
            aria-label={t("actions.edit")}
            title={t("actions.edit")}
            onClick={stop(() => handlers.onEdit(row.original))}
          >
            <Icon name="pencil" className="size-3.5" />
          </IconButton>
          <IconButton
            sizeType="xs"
            variantType="Outlined"
            colorType="Gray"
            aria-label={t("actions.resetPassword")}
            title={t("actions.resetPassword")}
            disabled={!row.original.active}
            onClick={stop(() => handlers.onResetPassword(row.original))}
          >
            <Icon name="key" className="size-3.5" />
          </IconButton>
          {!isSelf && (
            <IconButton
              sizeType="xs"
              variantType="Outlined"
              colorType={row.original.active ? "Error" : "MainGreen"}
              aria-label={row.original.active ? t("actions.deactivate") : t("actions.activate")}
              title={row.original.active ? t("actions.deactivate") : t("actions.activate")}
              onClick={stop(() => handlers.onToggleActive(row.original))}
            >
              <Icon name={row.original.active ? "lock" : "check-circle"} className="size-3.5" />
            </IconButton>
          )}
        </span>
      );
    },
  }),
];
