import { useRef, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal, TextArea } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui/icon/icon.entry";
import { formatFileSize } from "@/shared/utils/format-number";

import { ACCEPTED_EXTENSIONS, MAX_FILE_BYTES, documentApi, documentApiQueryKeys } from "@/entities/document/document.entry";
import { folderApiQueryKeys } from "@/entities/folder/folder.entry";

const MAX_COMMENT_LENGTH = 1000;

const isAccepted = (file: File) =>
  ACCEPTED_EXTENSIONS.some((extension) => file.name.toLowerCase().endsWith(extension)) && file.size > 0 && file.size <= MAX_FILE_BYTES;

interface IDocumentVersionUploadProps {
  /** Any version id of the document. */
  fileId: string;
  onUploaded?(): void;
}

/** "Editing" is a new version uploaded from Word; the signed copy is the last version and locks the document. */
export const DocumentVersionUpload = (props: IDocumentVersionUploadProps) => {
  const { fileId, onUploaded } = props;
  const { t } = useTranslation(["document", "common"]);
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"version" | "signed" | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const [problem, setProblem] = useState<string | null>(null);
  const isSigned = mode === "signed";

  const open = (next: "version" | "signed") => {
    setMode(next);
    setFile(null);
    setComment("");
    setProblem(null);
  };

  const { mutate: upload, isPending } = useMutation({
    mutationFn: documentApi.createVersion,
    mutationKey: documentApiQueryKeys.getKey("createVersion"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentApiQueryKeys.getRootKey() });
      queryClient.invalidateQueries({ queryKey: folderApiQueryKeys.getRootKey() });
      setMode(null);
      onUploaded?.();
    },
  });

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button variantType="Outlined" colorType="Gray" leftIcon={<Icon name="upload" className="size-4" />} onClick={() => open("version")}>
          {t("document:versions.upload")}
        </Button>
        <Button variantType="Outlined" colorType="Gray" leftIcon={<Icon name="lock" className="size-4" />} onClick={() => open("signed")}>
          {t("document:versions.attachSigned")}
        </Button>
      </div>

      <Modal
        isOpen={!!mode}
        onClose={() => setMode(null)}
        title={isSigned ? t("document:versions.signedTitle") : t("document:versions.uploadTitle")}
        className="w-full max-w-lg"
        footer={
          <div className="flex w-full justify-end gap-3">
            <Button variantType="Outlined" colorType="Gray" onClick={() => setMode(null)}>
              {t("common:cancel")}
            </Button>
            <Button loading={isPending} disabled={!file} onClick={() => file && upload({ fileId, file, comment, signed: isSigned })}>
              {isSigned ? t("document:versions.signedSubmit") : t("document:versions.uploadSubmit")}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-greyscale-700">{isSigned ? t("document:versions.signedHint") : t("document:versions.uploadHint")}</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-3 rounded-xl border-2 border-dashed border-greyscale-400 px-4 py-4 text-left transition hover:border-main-green-400 hover:bg-main-green-50"
          >
            <Icon name="upload" className="text-main-green-700" />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm text-greyscale-900">{file ? file.name : t("document:versions.choose")}</span>
              {file && <span className="text-xs text-greyscale-500">{formatFileSize(file.size)}</span>}
            </span>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS.join(",")}
              className="hidden"
              onChange={(event) => {
                const chosen = event.target.files?.[0] ?? null;
                event.target.value = "";
                if (chosen && !isAccepted(chosen)) {
                  setProblem(t("document:upload.rejected", { name: chosen.name }));
                  return;
                }
                setProblem(null);
                setFile(chosen);
              }}
            />
          </button>
          {problem && <p className="rounded-lg bg-error-50 px-3 py-2 text-sm text-error-600">{problem}</p>}
          <TextArea
            label={t("document:versions.comment")}
            placeholder={isSigned ? t("document:versions.signedCommentPlaceholder") : t("document:versions.commentPlaceholder")}
            maxLength={MAX_COMMENT_LENGTH}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          {isSigned && (
            <p className="flex gap-2 rounded-lg bg-warning-50 px-3 py-2 text-sm text-warning-800">
              <Icon name="alert" className="mt-0.5 size-4 shrink-0" />
              {t("document:versions.signedWarning")}
            </p>
          )}
        </div>
      </Modal>
    </>
  );
};
