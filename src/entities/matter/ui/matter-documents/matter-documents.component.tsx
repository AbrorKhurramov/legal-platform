import { EmptyData, Tag } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui/icon/icon.entry";
import { formatDateTime } from "@/shared/utils/format-date";
import { formatFileSize } from "@/shared/utils/format-number";

import type { MatterDocumentDTO } from "../../model/matter.types";

interface IMatterDocumentsProps {
  documents: MatterDocumentDTO[];
  currentVersion: number;
}

export const MatterDocuments = (props: IMatterDocumentsProps) => {
  const { documents, currentVersion } = props;
  const { t } = useTranslation("matter");

  if (!documents.length) return <EmptyData title={t("documents.empty")} />;

  return (
    <ul className="flex flex-col gap-3">
      {documents.map((document) => (
        <li key={document.id} className="flex items-start gap-4 rounded-xl border border-greyscale-300 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
            <Icon name="file-text" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate text-sm font-semibold text-greyscale-900">{document.fileName}</span>
              <Tag colorType={document.version === currentVersion ? "Green" : "Gray"} sizeType="sm" rounded>
                {`v${document.version}`}
              </Tag>
              {document.version === currentVersion && <span className="text-xs font-medium text-main-green-700">{t("documents.current")}</span>}
            </div>
            <div className="mt-1 text-xs text-greyscale-500">
              {`${document.uploadedBy.fullName} · ${formatDateTime(document.uploadedAt)} · ${formatFileSize(document.size)}`}
            </div>
            {document.comment && <p className="mt-2 text-sm text-greyscale-700">{document.comment}</p>}
          </div>
          <span className="cursor-pointer text-greyscale-500 hover:text-main-green-700" title={t("documents.download")}>
            <Icon name="download" className="size-4.5" />
          </span>
        </li>
      ))}
    </ul>
  );
};
