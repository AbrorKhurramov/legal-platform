import { useMutation } from "@tanstack/react-query";
import { Button } from "local-agro-ui";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui/icon/icon.entry";

import { documentApi, documentApiQueryKeys } from "@/entities/document/document.entry";

interface IDocumentDownloadButtonProps {
  fileId: string;
  fileName: string;
}

export const DocumentDownloadButton = (props: IDocumentDownloadButtonProps) => {
  const { fileId, fileName } = props;
  const { t } = useTranslation("document");

  const { mutate: download, isPending } = useMutation({
    mutationFn: () => documentApi.actionDownload(fileId, fileName),
    mutationKey: documentApiQueryKeys.getKey("actionDownload", fileId),
    onError: () => toast.error(t("downloadFailed")),
  });

  return (
    <Button leftIcon={<Icon name="download" className="size-4" />} loading={isPending} onClick={() => download()}>
      {t("download")}
    </Button>
  );
};
