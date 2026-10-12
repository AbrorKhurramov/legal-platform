import { useEffect, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { type FileManagerItemDTO, documentApi, documentApiQueryKeys } from "@/entities/document/document.entry";
import { FolderSelect, folderApiQueryKeys } from "@/entities/folder/folder.entry";

interface IFileMoveModalProps {
  /** Null keeps the modal closed. */
  file: FileManagerItemDTO | null;
  onClose(): void;
}

export const FileMoveModal = (props: IFileMoveModalProps) => {
  const { file, onClose } = props;
  const { t } = useTranslation(["document", "common"]);
  const queryClient = useQueryClient();
  const [folderId, setFolderId] = useState<string | null>(null);

  useEffect(() => setFolderId(file?.folder?.id ?? null), [file]);

  const { mutate: move, isPending } = useMutation({
    mutationFn: documentApi.actionMoveToFolder,
    mutationKey: documentApiQueryKeys.getKey("actionMoveToFolder"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentApiQueryKeys.getRootKey() });
      queryClient.invalidateQueries({ queryKey: folderApiQueryKeys.getRootKey() });
      onClose();
    },
  });

  return (
    <Modal
      isOpen={!!file}
      onClose={onClose}
      title={t("document:move.title")}
      className="w-full max-w-lg"
      footer={
        <div className="flex w-full justify-end gap-3">
          <Button variantType="Outlined" colorType="Gray" onClick={onClose}>
            {t("common:cancel")}
          </Button>
          <Button
            loading={isPending}
            disabled={!folderId || folderId === file?.folder?.id}
            onClick={() => file && folderId && move({ fileId: file.id, folderId })}
          >
            {t("document:move.submit")}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="truncate text-sm text-greyscale-700" title={file?.originalName}>
          {file?.originalName}
        </p>
        <FolderSelect label={t("document:move.target")} value={folderId} onChange={setFolderId} />
      </div>
    </Modal>
  );
};
