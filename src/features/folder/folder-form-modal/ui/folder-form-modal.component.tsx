import { useEffect } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Modal } from "local-agro-ui";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { documentApiQueryKeys } from "@/entities/document/document.entry";
import { type FolderDTO, FolderSelect, folderApi, folderApiQueryKeys } from "@/entities/folder/folder.entry";

const FORM_ID = "folder-form";
const MAX_NAME_LENGTH = 200;

export type FolderFormTarget = { kind: "create"; parentId: string | null } | { kind: "rename"; folder: Pick<FolderDTO, "id" | "name"> };

interface IFolderFormValues {
  name: string;
  parentId: string | null;
}

interface IFolderFormModalProps {
  /** Null keeps the modal closed. */
  target: FolderFormTarget | null;
  onClose(): void;
  onSaved?(folder: FolderDTO): void;
}

export const FolderFormModal = (props: IFolderFormModalProps) => {
  const { target, onClose, onSaved } = props;
  const { t } = useTranslation(["document", "common"]);
  const queryClient = useQueryClient();
  const isRename = target?.kind === "rename";

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = useForm<IFolderFormValues>({ mode: "onChange", defaultValues: { name: "", parentId: null } });

  useEffect(() => {
    if (!target) return;
    reset(target.kind === "rename" ? { name: target.folder.name, parentId: null } : { name: "", parentId: target.parentId });
  }, [target, reset]);

  const onSuccess = (folder: FolderDTO) => {
    queryClient.invalidateQueries({ queryKey: folderApiQueryKeys.getRootKey() });
    // Folder names are shown in the file and document lists too.
    if (isRename) queryClient.invalidateQueries({ queryKey: documentApiQueryKeys.getRootKey() });
    onClose();
    onSaved?.(folder);
  };

  const { mutate: createFolder, isPending: isCreating } = useMutation({
    mutationFn: folderApi.createFolder,
    mutationKey: folderApiQueryKeys.getKey("createFolder"),
    onSuccess,
  });

  const { mutate: renameFolder, isPending: isRenaming } = useMutation({
    mutationFn: folderApi.actionRename,
    mutationKey: folderApiQueryKeys.getKey("actionRename"),
    onSuccess,
  });

  const onSubmit = (values: IFolderFormValues) => {
    const name = values.name.trim();
    if (target?.kind === "rename") renameFolder({ id: target.folder.id, name });
    else createFolder({ name, parentId: values.parentId });
  };

  return (
    <Modal
      isOpen={!!target}
      onClose={onClose}
      title={isRename ? t("document:folders.renameTitle") : t("document:folders.createTitle")}
      className="w-full max-w-lg"
      footer={
        <div className="flex w-full justify-end gap-3">
          <Button variantType="Outlined" colorType="Gray" onClick={onClose}>
            {t("common:cancel")}
          </Button>
          <Button type="submit" form={FORM_ID} loading={isCreating || isRenaming} disabled={!isValid || (isRename && !isDirty)}>
            {isRename ? t("common:save") : t("common:create")}
          </Button>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          label={t("document:folders.name")}
          autoFocus
          maxLength={MAX_NAME_LENGTH}
          {...register("name", { required: true, validate: (value) => value.trim().length > 0 })}
        />
        {!isRename && (
          <Controller
            control={control}
            name="parentId"
            render={({ field }) => (
              <FolderSelect
                label={t("document:folders.parent")}
                placeholder={t("document:folders.noParent")}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        )}
      </form>
    </Modal>
  );
};
