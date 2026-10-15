import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { Button, Select, Skeleton } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { Icon } from "@/shared/ui/icon/icon.entry";
import { formatDateTime } from "@/shared/utils/format-date";
import { formatFileSize } from "@/shared/utils/format-number";

import {
  DocumentStatusTag,
  ProcessingStatus,
  ProcessingStatusTag,
  STATUS_BY_VERSION_KIND,
  documentApi,
  documentApiQueryKeys,
} from "@/entities/document/document.entry";

import { DocumentVersionCompare } from "./document-version-compare.component";

const POLL_INTERVAL_MS = 4000;

interface IDocumentVersionHistoryProps {
  /** Any version id of the document. */
  fileId: string;
  viewedVersionNo: number;
  onOpenVersion(versionNo: number): void;
}

export const DocumentVersionHistory = (props: IDocumentVersionHistoryProps) => {
  const { fileId, viewedVersionNo, onOpenVersion } = props;
  const { t } = useTranslation("document");
  const [compare, setCompare] = useState<{ from: number; to: number } | null>(null);
  const [selection, setSelection] = useState<{ from?: number; to?: number }>({});

  const { data: versions } = useQuery({
    queryFn: () => documentApi.getVersions(fileId),
    queryKey: documentApiQueryKeys.getKey("getVersions", fileId),
    refetchInterval: (query) =>
      query.state.data?.some((version) => version.status === ProcessingStatus.PENDING || version.status === ProcessingStatus.PROCESSING)
        ? POLL_INTERVAL_MS
        : false,
  });

  if (!versions) return <Skeleton className="h-40 rounded-xl" />;

  // Only processed versions have text to compare; newest first, so the defaults are "previous → latest".
  const comparable = versions.filter((version) => version.status === ProcessingStatus.DONE);
  const options = comparable.map((version) => ({ label: t("versions.versionLabel", { number: version.versionNo }), value: version.versionNo }));
  const from = selection.from ?? comparable[1]?.versionNo;
  const to = selection.to ?? comparable[0]?.versionNo;

  return (
    <div className="flex flex-col gap-6">
      <ol className="flex flex-col">
        {versions.map((version, index) => (
          <li key={version.id} className="relative flex gap-4 pb-5 last:pb-0">
            {index < versions.length - 1 && <span className="absolute top-8 bottom-0 left-4 w-px bg-greyscale-300" />}
            <span
              className={twMerge(
                "z-1 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                version.versionNo === viewedVersionNo ? "bg-main-green-600 text-white" : "bg-greyscale-200 text-greyscale-700",
              )}
            >
              v{version.versionNo}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <DocumentStatusTag status={STATUS_BY_VERSION_KIND[version.versionKind]} />
                {version.status !== ProcessingStatus.DONE && <ProcessingStatusTag status={version.status} />}
                {version.versionNo === viewedVersionNo && <span className="text-xs font-medium text-main-green-700">{t("versions.viewing")}</span>}
              </div>
              <span className="text-sm text-greyscale-900">
                <span className="font-medium">{version.uploadedBy.fullName}</span>
                <span className="text-greyscale-500"> · {formatDateTime(version.createdAt)}</span>
              </span>
              <span className="truncate text-xs text-greyscale-500" title={version.originalName}>
                {version.originalName} · {formatFileSize(version.sizeBytes)}
              </span>
              {version.comment && <p className="rounded-lg bg-greyscale-100 px-3 py-2 text-sm text-greyscale-700">{version.comment}</p>}
            </div>
            <div className="flex shrink-0 items-start gap-2">
              {version.versionNo !== viewedVersionNo && (
                <Button sizeType="xs" variantType="Outlined" colorType="Gray" onClick={() => onOpenVersion(version.versionNo)}>
                  {t("versions.open")}
                </Button>
              )}
              <Button
                sizeType="xs"
                variantType="Outlined"
                colorType="Gray"
                leftIcon={<Icon name="download" className="size-3.5" />}
                onClick={() => documentApi.actionDownload(version.id, version.originalName)}
              >
                {t("versions.download")}
              </Button>
            </div>
          </li>
        ))}
      </ol>

      {comparable.length > 1 && (
        <div className="flex flex-col gap-4 border-t border-greyscale-200 pt-5">
          <span className="text-sm font-semibold text-greyscale-900">{t("versions.compareTitle")}</span>
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-40">
              <Select
                label={t("versions.compareFrom")}
                options={options}
                value={options.find((option) => option.value === from) ?? null}
                onChange={(option) => option && setSelection((prevState) => ({ ...prevState, from: option.value }))}
              />
            </div>
            <div className="w-40">
              <Select
                label={t("versions.compareTo")}
                options={options}
                value={options.find((option) => option.value === to) ?? null}
                onChange={(option) => option && setSelection((prevState) => ({ ...prevState, to: option.value }))}
              />
            </div>
            <Button disabled={!from || !to || from === to} onClick={() => from && to && setCompare({ from, to })}>
              {t("versions.compare")}
            </Button>
          </div>
          {compare && <DocumentVersionCompare fileId={fileId} fromVersion={compare.from} toVersion={compare.to} />}
        </div>
      )}
    </div>
  );
};
