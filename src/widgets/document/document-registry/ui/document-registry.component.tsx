import { useState } from "react";

import { IconButton } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

import { Icon } from "@/shared/ui/icon/icon.entry";
import { stop } from "@/shared/utils/stop-propagation";

import { DocumentTable } from "@/features/document/document-table/document-table.entry";
import { FolderDeleteModal } from "@/features/folder/folder-delete-modal/folder-delete-modal.entry";
import { FolderFormModal, type FolderFormTarget } from "@/features/folder/folder-form-modal/folder-form-modal.entry";

import { type FolderNode, FolderTree, useFolderTree } from "@/entities/folder/folder.entry";
import { useCurrentUser } from "@/entities/user/user.entry";

const FOLDER_QUERY = "folder";

export const DocumentRegistry = () => {
  const { t } = useTranslation("document");
  const user = useCurrentUser();
  const canManage = !!user?.fileManagerAccess;
  const [searchParams, setSearchParams] = useSearchParams();
  const folderId = searchParams.get(FOLDER_QUERY);
  const { tree } = useFolderTree();
  const [folderForm, setFolderForm] = useState<FolderFormTarget | null>(null);
  const [deleting, setDeleting] = useState<FolderNode | null>(null);

  const selectFolder = (id: string | null) =>
    setSearchParams((prevState) => {
      if (id) prevState.set(FOLDER_QUERY, id);
      else prevState.delete(FOLDER_QUERY);
      return prevState;
    });

  const renderActions = (node: FolderNode) => (
    <>
      <IconButton
        sizeType="xs"
        variantType="Plain"
        colorType="Gray"
        aria-label={t("folders.addChild")}
        title={t("folders.addChild")}
        onClick={stop(() => setFolderForm({ kind: "create", parentId: node.id }))}
      >
        <Icon name="plus" className="size-3.5" />
      </IconButton>
      <IconButton
        sizeType="xs"
        variantType="Plain"
        colorType="Gray"
        aria-label={t("folders.rename")}
        title={t("folders.rename")}
        onClick={stop(() => setFolderForm({ kind: "rename", folder: node }))}
      >
        <Icon name="pencil" className="size-3.5" />
      </IconButton>
      <IconButton
        sizeType="xs"
        variantType="Plain"
        colorType="Gray"
        aria-label={t("folders.delete")}
        title={t("folders.delete")}
        onClick={stop(() => setDeleting(node))}
      >
        <Icon name="trash" className="size-3.5" />
      </IconButton>
    </>
  );

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
      <aside className="flex flex-col gap-3 rounded-2xl border border-greyscale-300 bg-white p-3 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:w-72 lg:shrink-0 lg:overflow-y-auto">
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-semibold text-greyscale-900">{t("folders.title")}</span>
          {canManage && (
            <IconButton
              sizeType="xs"
              variantType="Outlined"
              colorType="Gray"
              aria-label={t("folders.new")}
              title={t("folders.new")}
              onClick={() => setFolderForm({ kind: "create", parentId: folderId })}
            >
              <Icon name="plus" className="size-3.5" />
            </IconButton>
          )}
        </div>
        <FolderTree
          tree={tree}
          selectedId={folderId}
          allLabel={t("folders.all")}
          onSelect={selectFolder}
          renderActions={canManage ? renderActions : undefined}
        />
      </aside>
      <div className="min-w-0 flex-1">
        <DocumentTable folderId={folderId} />
      </div>
      <FolderFormModal target={folderForm} onClose={() => setFolderForm(null)} onSaved={(folder) => selectFolder(folder.id)} />
      <FolderDeleteModal folder={deleting} onClose={() => setDeleting(null)} onDeleted={(id) => id === folderId && selectFolder(null)} />
    </div>
  );
};
