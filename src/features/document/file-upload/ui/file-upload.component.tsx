import { type DragEvent, type ReactNode, useRef, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Toggle } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { Icon } from "@/shared/ui/icon/icon.entry";
import { formatFileSize } from "@/shared/utils/format-number";

import { ACCEPTED_EXTENSIONS, MAX_FILES_PER_UPLOAD, MAX_FILE_BYTES, documentApi, documentApiQueryKeys } from "@/entities/document/document.entry";
import { FolderSelect, folderApiQueryKeys } from "@/entities/folder/folder.entry";

const hasAcceptedExtension = (file: File) => ACCEPTED_EXTENSIONS.some((extension) => file.name.toLowerCase().endsWith(extension));

interface IFileUploadProps {
  /** Every upload lands in a folder; the widget owns it so a newly created folder can be selected. */
  folderId: string | null;
  onFolderChange(folderId: string | null): void;
  /** Sits next to the folder picker, e.g. a "new folder" button. */
  folderAction?: ReactNode;
}

export const FileUpload = (props: IFileUploadProps) => {
  const { folderId, onFolderChange, folderAction } = props;
  const { t } = useTranslation("document");
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [confidential, setConfidential] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const { mutate: upload, isPending } = useMutation({
    mutationFn: documentApi.createUpload,
    mutationKey: documentApiQueryKeys.getKey("createUpload"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentApiQueryKeys.getRootKey() });
      queryClient.invalidateQueries({ queryKey: folderApiQueryKeys.getRootKey() });
      setFiles([]);
      setConfidential(false);
    },
  });

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const next = [...files, ...Array.from(incoming)];
    const rejected = next.find((file) => !hasAcceptedExtension(file) || file.size > MAX_FILE_BYTES || file.size === 0);
    if (rejected) {
      setProblem(t("upload.rejected", { name: rejected.name }));
      return;
    }
    if (next.length > MAX_FILES_PER_UPLOAD) {
      setProblem(t("upload.tooMany", { count: MAX_FILES_PER_UPLOAD }));
      return;
    }
    setProblem(null);
    setFiles(next);
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-greyscale-300 bg-white p-5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={twMerge(
          "flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-greyscale-400 px-6 py-8 text-center transition hover:border-main-green-400 hover:bg-main-green-50",
          isDragging && "border-main-green-500 bg-main-green-50",
        )}
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-main-green-50 text-main-green-700">
          <Icon name="upload" />
        </span>
        <span className="text-h6 text-greyscale-900">{t("upload.title")}</span>
        <span className="text-sm text-greyscale-600">{t("upload.hint", { count: MAX_FILES_PER_UPLOAD })}</span>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS.join(",")}
          className="hidden"
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </button>

      {problem && (
        <p className="flex items-center gap-2 rounded-lg bg-error-50 px-3 py-2 text-sm text-error-600">
          <Icon name="alert" className="size-4" />
          {problem}
        </p>
      )}

      {files.length > 0 && (
        <ul className="flex flex-col divide-y divide-greyscale-200 rounded-xl border border-greyscale-300">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              <Icon name="file" className="size-4 text-greyscale-500" />
              <span className="flex-1 truncate text-greyscale-900">{file.name}</span>
              <span className="text-xs text-greyscale-500">{formatFileSize(file.size)}</span>
              <button
                type="button"
                aria-label={t("upload.remove")}
                className="text-greyscale-500 hover:text-error-500"
                onClick={() => setFiles((prevState) => prevState.filter((_, position) => position !== index))}
              >
                <Icon name="close" className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-64 flex-1 sm:max-w-md">
          <FolderSelect label={t("upload.folder")} value={folderId} onChange={onFolderChange} />
        </div>
        {folderAction}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Toggle checked={confidential} onChange={(event) => setConfidential(event.target.checked)} />
          <span>
            <span className="block text-sm font-medium text-greyscale-900">{t("upload.confidential")}</span>
            <span className="block text-xs text-greyscale-500">{t("upload.confidentialHint")}</span>
          </span>
        </div>
        <Button
          leftIcon={<Icon name="upload" className="size-4" />}
          loading={isPending}
          disabled={!files.length || !folderId}
          onClick={() => folderId && upload({ files, confidential, folderId })}
        >
          {files.length ? t("upload.submit", { count: files.length }) : t("upload.submitEmpty")}
        </Button>
      </div>
      {files.length > 0 && !folderId && <p className="-mt-2 text-right text-xs text-warning-600">{t("upload.folderRequired")}</p>}
    </div>
  );
};
