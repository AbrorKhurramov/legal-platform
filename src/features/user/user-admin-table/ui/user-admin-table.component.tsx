import { useRef, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Select, Table } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { FilterBar } from "@/shared/components/filter-bar/filter-bar.entry";
import { SearchInput } from "@/shared/components/search-input/search-input.entry";
import { useListState } from "@/shared/hooks/use-list-state";
import { cleanParams } from "@/shared/lib/filter-lib";
import { findOption } from "@/shared/lib/select-lib";
import { type BaseModalHandlers, ConfirmModal } from "@/shared/ui/confirm-modal/confirm-modal.entry";

import { branchApi, branchApiQueryKeys, mapBranchesToOptions } from "@/entities/branch/branch.entry";
import {
  type AdminUserDTO,
  type AdminUserListRequestParams,
  TemporaryPassword,
  type TemporaryPasswordDTO,
  type UserRole,
  getUserRoleOptions,
  useCurrentUser,
  userAdminApi,
  userAdminApiQueryKeys,
} from "@/entities/user/user.entry";

import { getUserAdminColumns } from "../common/user-admin-table.columns";

interface IUserAdminFilters {
  role?: UserRole;
  branchId?: string;
  /** A string, not a boolean: a false filter would read as "no filter" in the list state. */
  status?: "active" | "blocked";
}

interface IUserAdminTableProps {
  onEdit(user: AdminUserDTO): void;
}

export const UserAdminTable = (props: IUserAdminTableProps) => {
  const { onEdit } = props;
  const { t } = useTranslation(["admin", "common"]);
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const list = useListState<IUserAdminFilters>({});
  const roleOptions = getUserRoleOptions();
  const statusOptions = [
    { label: t("admin:status.active"), value: "active" as const },
    { label: t("admin:status.blocked"), value: "blocked" as const },
  ];
  const confirmRef = useRef<BaseModalHandlers>(null);
  const [pending, setPending] = useState<{ kind: "reset" | "deactivate"; user: AdminUserDTO } | null>(null);
  const [issued, setIssued] = useState<TemporaryPasswordDTO | null>(null);

  const requestParams: AdminUserListRequestParams = {
    ...list.requestParams,
    ...cleanParams({
      role: list.filters.role,
      branchId: list.filters.branchId,
      active: list.filters.status ? list.filters.status === "active" : undefined,
      search: list.debouncedSearch,
    }),
  };

  const { data, isFetching } = useQuery({
    queryFn: () => userAdminApi.getUsers(requestParams),
    queryKey: userAdminApiQueryKeys.getKey("getUsers", requestParams),
  });

  const { data: branches } = useQuery({
    queryFn: branchApi.getDirectoryBranches,
    queryKey: branchApiQueryKeys.getKey("getDirectoryBranches"),
  });
  const branchOptions = mapBranchesToOptions(branches);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: userAdminApiQueryKeys.getRootKey() });
  const closeConfirm = () => {
    confirmRef.current?.closeModal();
    setPending(null);
  };

  const { mutate: updateUser } = useMutation({
    mutationFn: userAdminApi.updateUser,
    mutationKey: userAdminApiQueryKeys.getKey("updateUser"),
    onSuccess: invalidate,
  });

  const { mutate: activate } = useMutation({
    mutationFn: userAdminApi.actionActivate,
    mutationKey: userAdminApiQueryKeys.getKey("actionActivate"),
    onSuccess: invalidate,
  });

  const { mutate: deactivate, isPending: isDeactivating } = useMutation({
    mutationFn: userAdminApi.actionDeactivate,
    mutationKey: userAdminApiQueryKeys.getKey("actionDeactivate"),
    onSuccess: () => {
      invalidate();
      closeConfirm();
    },
  });

  const { mutate: resetPassword, isPending: isResetting } = useMutation({
    mutationFn: userAdminApi.actionResetPassword,
    mutationKey: userAdminApiQueryKeys.getKey("actionResetPassword"),
    onSuccess: (response) => {
      invalidate();
      closeConfirm();
      setIssued(response);
    },
  });

  const ask = (kind: "reset" | "deactivate", user: AdminUserDTO) => {
    setPending({ kind, user });
    confirmRef.current?.openModal();
  };

  const columns = getUserAdminColumns(t, {
    currentUserId: currentUser?.id,
    onEdit,
    // The update endpoint takes the whole profile, so the toggle resends it unchanged.
    onToggleFileManager: (user) =>
      updateUser({
        id: user.id,
        fullName: user.fullName,
        position: user.position,
        role: user.role,
        branchId: user.branch.id,
        fileManagerAccess: !user.fileManagerAccess,
      }),
    onResetPassword: (user) => ask("reset", user),
    onToggleActive: (user) => (user.active ? ask("deactivate", user) : activate(user.id)),
  });

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-greyscale-300 bg-white pb-5">
      <FilterBar hasActiveFilters={list.hasActiveFilters} onReset={list.resetFilters}>
        <SearchInput value={list.search} placeholder={t("admin:filters.search")} onChange={list.setSearch} />
        <Select
          placeholder={t("admin:fields.role")}
          options={roleOptions}
          value={findOption(roleOptions, list.filters.role)}
          isClearable
          onChange={(option) => list.setFilter("role", option?.value)}
        />
        <Select
          placeholder={t("admin:fields.branch")}
          options={branchOptions}
          value={findOption(branchOptions, list.filters.branchId)}
          isClearable
          onChange={(option) => list.setFilter("branchId", option?.value)}
        />
        <Select
          placeholder={t("admin:fields.status")}
          options={statusOptions}
          value={findOption(statusOptions, list.filters.status)}
          isClearable
          onChange={(option) => list.setFilter("status", option?.value)}
        />
      </FilterBar>
      <div className="px-5">
        <Table
          data={data?.data}
          columns={columns}
          isLoading={isFetching && !data}
          onRowClick={onEdit}
          isPagination
          pagesSyncQuery
          page={list.page}
          setPage={list.setPage}
          perPage={list.perPage}
          setPerPage={list.setPerPage}
          totalCount={data?.totalCount || 0}
          textSize="sm"
        />
      </div>

      <ConfirmModal
        ref={confirmRef}
        title={pending?.kind === "reset" ? t("admin:actions.resetPassword") : t("admin:actions.deactivate")}
        submitLabel={pending?.kind === "reset" ? t("admin:actions.resetPassword") : t("admin:actions.deactivate")}
        submitColor={pending?.kind === "reset" ? "Warning" : "Error"}
        isLoading={isResetting || isDeactivating}
        onSubmit={() => pending && (pending.kind === "reset" ? resetPassword(pending.user.id) : deactivate(pending.user.id))}
        onClose={() => setPending(null)}
      >
        <p className="text-sm text-greyscale-700">
          {pending?.kind === "reset"
            ? t("admin:confirm.resetPassword", { name: pending.user.fullName })
            : t("admin:confirm.deactivate", { name: pending?.user.fullName })}
        </p>
      </ConfirmModal>

      <Modal
        isOpen={!!issued}
        onClose={() => setIssued(null)}
        title={t("admin:password.issuedTitle")}
        className="w-full max-w-lg"
        footer={
          <div className="flex w-full justify-end">
            <Button onClick={() => setIssued(null)}>{t("common:close")}</Button>
          </div>
        }
      >
        {issued && (
          <div className="flex flex-col gap-4">
            <TemporaryPassword username={issued.username} password={issued.temporaryPassword} />
            <p className="rounded-lg bg-warning-50 px-3 py-2 text-sm text-warning-800">{t("admin:password.onceHint")}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};
