import { useEffect, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Drawer, Input, Select, Toggle } from "local-agro-ui";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { findOption } from "@/shared/lib/select-lib";

import { branchApi, branchApiQueryKeys, mapBranchesToOptions } from "@/entities/branch/branch.entry";
import {
  type AdminUserDTO,
  type CreatedUserDTO,
  TemporaryPassword,
  UserRole,
  getUserRoleOptions,
  userAdminApi,
  userAdminApiQueryKeys,
} from "@/entities/user/user.entry";

const FORM_ID = "user-form";
const USERNAME_PATTERN = /^[A-Za-z0-9._-]{3,50}$/;
const MAX_TEXT_LENGTH = 200;
/** Only these roles see legal documents, so only they can be given the file manager. */
const FILE_MANAGER_ROLES: UserRole[] = [UserRole.BRANCH, UserRole.HEAD_OFFICE, UserRole.LAWYER, UserRole.HEAD];

interface IUserFormValues {
  username: string;
  fullName: string;
  position: string;
  role: UserRole | null;
  branchId: string | null;
  fileManagerAccess: boolean;
}

const EMPTY_VALUES: IUserFormValues = { username: "", fullName: "", position: "", role: null, branchId: null, fileManagerAccess: false };

interface IUserFormDrawerProps {
  isOpen: boolean;
  /** Null creates a new account. */
  user: AdminUserDTO | null;
  onClose(): void;
}

export const UserFormDrawer = (props: IUserFormDrawerProps) => {
  const { isOpen, user, onClose } = props;
  const { t } = useTranslation(["admin", "common"]);
  const queryClient = useQueryClient();
  const roleOptions = getUserRoleOptions();
  const [created, setCreated] = useState<CreatedUserDTO | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isValid, isDirty, errors },
  } = useForm<IUserFormValues>({ mode: "onChange", defaultValues: EMPTY_VALUES });
  const role = watch("role");
  const canHaveFileManager = !!role && FILE_MANAGER_ROLES.includes(role);

  useEffect(() => {
    if (!isOpen) return;
    setCreated(null);
    reset(
      user
        ? {
            username: user.username,
            fullName: user.fullName,
            position: user.position ?? "",
            role: user.role,
            branchId: user.branch.id,
            fileManagerAccess: user.fileManagerAccess,
          }
        : EMPTY_VALUES,
    );
  }, [isOpen, user, reset]);

  useEffect(() => {
    if (!canHaveFileManager) setValue("fileManagerAccess", false, { shouldDirty: true });
  }, [canHaveFileManager, setValue]);

  const { data: branches } = useQuery({
    queryFn: branchApi.getDirectoryBranches,
    queryKey: branchApiQueryKeys.getKey("getDirectoryBranches"),
    enabled: isOpen,
  });
  const branchOptions = mapBranchesToOptions(branches);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: userAdminApiQueryKeys.getRootKey() });

  const { mutate: createUser, isPending: isCreating } = useMutation({
    mutationFn: userAdminApi.createUser,
    mutationKey: userAdminApiQueryKeys.getKey("createUser"),
    onSuccess: (response) => {
      invalidate();
      setCreated(response);
    },
  });

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: userAdminApi.updateUser,
    mutationKey: userAdminApiQueryKeys.getKey("updateUser"),
    onSuccess: () => {
      invalidate();
      onClose();
    },
  });

  const onSubmit = (values: IUserFormValues) => {
    const body = {
      fullName: values.fullName.trim(),
      position: values.position.trim() || null,
      role: values.role!,
      branchId: values.branchId!,
      fileManagerAccess: values.fileManagerAccess,
    };
    if (user) updateUser({ id: user.id, ...body });
    else createUser({ username: values.username.trim(), ...body });
  };

  const footer = created ? (
    <div className="flex w-full justify-end">
      <Button onClick={onClose}>{t("common:close")}</Button>
    </div>
  ) : (
    <div className="flex w-full justify-end gap-3">
      <Button variantType="Outlined" colorType="Gray" onClick={onClose}>
        {t("common:cancel")}
      </Button>
      <Button type="submit" form={FORM_ID} loading={isCreating || isUpdating} disabled={!isValid || !isDirty}>
        {user ? t("common:save") : t("common:create")}
      </Button>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={user ? t("admin:form.editTitle") : t("admin:form.createTitle")}
      className="w-full max-w-xl"
      footer={footer}
    >
      {created ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-greyscale-700">{t("admin:form.created", { name: created.user.fullName })}</p>
          <TemporaryPassword username={created.user.username} password={created.temporaryPassword} />
          <p className="rounded-lg bg-warning-50 px-3 py-2 text-sm text-warning-800">{t("admin:password.onceHint")}</p>
        </div>
      ) : (
        <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Input
            label={t("admin:fields.username")}
            disabled={!!user}
            autoComplete="off"
            errorMessage={errors.username ? t("admin:form.usernameRule") : undefined}
            {...register("username", { required: !user, pattern: user ? undefined : USERNAME_PATTERN })}
          />
          <Input
            label={t("admin:fields.fullName")}
            maxLength={MAX_TEXT_LENGTH}
            {...register("fullName", { required: true, validate: (value) => value.trim().length > 0 })}
          />
          <Input label={t("admin:fields.position")} maxLength={MAX_TEXT_LENGTH} {...register("position")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              control={control}
              name="role"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  label={t("admin:fields.role")}
                  placeholder={t("common:select")}
                  options={roleOptions}
                  value={findOption(roleOptions, field.value)}
                  onChange={(option) => field.onChange(option?.value ?? null)}
                />
              )}
            />
            <Controller
              control={control}
              name="branchId"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  label={t("admin:fields.branch")}
                  placeholder={t("common:select")}
                  options={branchOptions}
                  value={findOption(branchOptions, field.value)}
                  onChange={(option) => field.onChange(option?.value ?? null)}
                />
              )}
            />
          </div>
          <Controller
            control={control}
            name="fileManagerAccess"
            render={({ field }) => (
              <div className="flex items-start gap-3 rounded-xl border border-greyscale-300 p-4">
                <Toggle checked={field.value} disabled={!canHaveFileManager} onChange={(event) => field.onChange(event.target.checked)} />
                <span>
                  <span className="block text-sm font-medium text-greyscale-900">{t("admin:fields.fileManagerAccess")}</span>
                  <span className="block text-xs text-greyscale-500">
                    {role === UserRole.ADMIN ? t("admin:form.fileManagerNotForRole") : t("admin:form.fileManagerHint")}
                  </span>
                </span>
              </div>
            )}
          />
          {!user && <p className="text-xs text-greyscale-500">{t("admin:form.passwordHint")}</p>}
        </form>
      )}
    </Drawer>
  );
};
