import { useState } from "react";

import { Button } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui/icon/icon.entry";

import { FileManagerTable } from "@/features/document/file-manager-table/file-manager-table.entry";
import { FileUpload } from "@/features/document/file-upload/file-upload.entry";
import { FolderFormModal, type FolderFormTarget } from "@/features/folder/folder-form-modal/folder-form-modal.entry";

export const FileManager = () => {
  const { t } = useTranslation("document");
  const [folderId, setFolderId] = useState<string | null>(null);
  const [folderForm, setFolderForm] = useState<FolderFormTarget | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <FileUpload
        folderId={folderId}
        onFolderChange={setFolderId}
        folderAction={
          <Button
            variantType="Outlined"
            colorType="Gray"
            leftIcon={<Icon name="plus" className="size-4" />}
            onClick={() => setFolderForm({ kind: "create", parentId: folderId })}
          >
            {t("folders.new")}
          </Button>
        }
      />
      <FileManagerTable />
      <FolderFormModal target={folderForm} onClose={() => setFolderForm(null)} onSaved={(folder) => setFolderId(folder.id)} />
    </div>
  );
};
