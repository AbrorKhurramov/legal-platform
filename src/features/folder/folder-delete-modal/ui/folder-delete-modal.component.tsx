import { useEffect, useRef } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { type BaseModalHandlers, ConfirmModal } from "@/shared/ui/confirm-modal/confirm-modal.entry";

import { type FolderNode, folderApi, folderApiQueryKeys } from "@/entities/folder/folder.entry";

interface IFolderDeleteModalProps {
  /** Null keeps the modal closed. */
  folder: FolderNode | null;
  onClose(): void;
  onDeleted?(folderId: string): void;
}

export const FolderDeleteModal = (props: IFolderDeleteModalProps) => {
  const { folder, onClose, onDeleted } = props;
  const { t } = useTranslation("document");
  const queryClient = useQueryClient();
  const modalRef = useRef<BaseModalHandlers>(null);

  useEffect(() => {
    if (folder) modalRef.current?.openModal();
    else modalRef.current?.closeModal();
  }, [folder]);

  const { mutate: deleteFolder, isPending } = useMutation({
    mutationFn: folderApi.deleteFolder,
    mutationKey: folderApiQueryKeys.getKey("deleteFolder"),
    onSuccess: (_, folderId) => {
      queryClient.invalidateQueries({ queryKey: folderApiQueryKeys.getRootKey() });
      onClose();
      onDeleted?.(folderId);
    },
  });

  // The count is only what this user can see; the backend refuses a folder with any file or subfolder.
  const isEmpty = !!folder && folder.totalCount === 0 && folder.children.length === 0;

  return (
    <ConfirmModal
      ref={modalRef}
      title={t("folders.deleteTitle")}
      submitLabel={t("folders.delete")}
      submitColor="Error"
      isLoading={isPending}
      isSubmitDisabled={!isEmpty}
      onSubmit={() => folder && deleteFolder(folder.id)}
      onClose={onClose}
    >
      <p className="text-sm text-greyscale-700">
        {isEmpty ? t("folders.deleteConfirm", { name: folder?.name }) : t("folders.deleteNotEmpty", { name: folder?.name })}
      </p>
    </ConfirmModal>
  );
};
