import { useQuery } from "@tanstack/react-query";
import { ActivityCondition, EmptyData, TabsSwitcher } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router";

import { InfoList } from "@/shared/components/info-list/info-list.entry";
import { ROUTES } from "@/shared/const/route-const";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { Icon } from "@/shared/ui/icon/icon.entry";
import { formatDateTime } from "@/shared/utils/format-date";
import { formatFileSize } from "@/shared/utils/format-number";

import { DocumentDownloadButton } from "@/features/document/document-download/document-download.entry";
import { DocumentVersionHistory } from "@/features/document/document-version-history/document-version-history.entry";
import { DocumentVersionUpload } from "@/features/document/document-version-upload/document-version-upload.entry";
import { DocumentViewer } from "@/features/document/document-viewer/document-viewer.entry";

import {
  ContentSourceTag,
  DocTypeLabel,
  DocumentDetailSkeleton,
  DocumentFields,
  DocumentStamps,
  DocumentStatus,
  DocumentStatusTag,
  FileNameCell,
  FolderName,
  NeedsReviewBadge,
  ProcessingStatus,
  ProcessingStatusTag,
  documentApi,
  documentApiQueryKeys,
  useFieldLabels,
} from "@/entities/document/document.entry";
import { useCurrentUser } from "@/entities/user/user.entry";

import { getDocumentDetailTabs } from "../common/document-detail.const";
import { DocumentDetailTab } from "../common/document-detail.types";
import { DocumentPages } from "./document-pages.component";

const TAB_QUERY = "tab";
const VERSION_QUERY = "version";
const POLL_INTERVAL_MS = 4000;
/** Wide enough for the original and the extracted content side by side. */
const SIDE_BY_SIDE_QUERY = "(min-width: 1280px)";

interface IDocumentDetailProps {
  fileId: string;
}

export const DocumentDetail = (props: IDocumentDetailProps) => {
  const { fileId } = props;
  const { t } = useTranslation("document");
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useCurrentUser();
  // No version in the URL means the latest one, so the link to a document never goes stale.
  const version = Number(searchParams.get(VERSION_QUERY)) || undefined;
  const { data, isFetching, isError } = useQuery({
    queryFn: () => documentApi.getDocumentDetail(fileId, version),
    queryKey: documentApiQueryKeys.getKey("getDocumentDetail", fileId, version),
    enabled: !!fileId,
    refetchInterval: (query) =>
      query.state.data?.status === ProcessingStatus.PENDING || query.state.data?.status === ProcessingStatus.PROCESSING ? POLL_INTERVAL_MS : false,
  });
  const isSideBySide = useMediaQuery(SIDE_BY_SIDE_QUERY);
  const labelFor = useFieldLabels(data?.docType);

  if (isError && !data) {
    return (
      <EmptyData
        title={t("detail.notAvailable")}
        className="rounded-2xl bg-white py-16"
        extraContent={
          <Link to={ROUTES.documents} className="text-sm font-medium text-main-green-700">
            {t("detail.backToList")}
          </Link>
        }
      />
    );
  }

  const tabs = data ? getDocumentDetailTabs(data, !isSideBySide) : [];
  const isOldVersion = !!data && data.versionNo !== data.latestVersionNo;
  const canAddVersion = !!user?.fileManagerAccess && data?.documentStatus !== DocumentStatus.SIGNED;

  const openVersion = (versionNo: number | null) =>
    setSearchParams((prevState) => {
      if (versionNo && versionNo !== data?.latestVersionNo) prevState.set(VERSION_QUERY, String(versionNo));
      else prevState.delete(VERSION_QUERY);
      return prevState;
    });
  const requested = searchParams.get(TAB_QUERY) as DocumentDetailTab | null;
  const activeTab = tabs.find((tab) => tab.name === requested)?.name ?? tabs[0]?.name;

  return (
    <ActivityCondition condition={isFetching && !data} fallback={<DocumentDetailSkeleton />}>
      {data && (
        <div className="flex flex-col gap-5">
          <Link to={ROUTES.documents} className="flex w-fit items-center gap-1 text-sm text-greyscale-600 hover:text-main-green-700">
            <Icon name="arrow-left" className="size-4" />
            {t("detail.backToList")}
          </Link>

          <div className="flex flex-col gap-4 rounded-2xl border border-greyscale-300 bg-white p-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 flex-col gap-3">
              <FileNameCell name={data.originalName} format={data.format} sizeBytes={data.sizeBytes} confidential={data.confidential} />
              <div className="flex flex-wrap items-center gap-2">
                <DocumentStatusTag status={data.documentStatus} />
                <span className="rounded-full bg-greyscale-100 px-2 py-0.5 text-xs font-medium text-greyscale-700">
                  {t("versions.versionOf", { number: data.versionNo, total: data.latestVersionNo })}
                </span>
                <ProcessingStatusTag status={data.status} />
                <ContentSourceTag source={data.source} />
                {data.needsReview && <NeedsReviewBadge />}
              </div>
            </div>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-start lg:justify-end">
              {canAddVersion && <DocumentVersionUpload fileId={data.documentId} onUploaded={() => openVersion(null)} />}
              <DocumentDownloadButton fileId={data.id} fileName={data.originalName} />
            </div>
          </div>

          {isOldVersion && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neon-blue-200 bg-neon-blue-50 px-4 py-3 text-sm text-neon-blue-800">
              <span className="flex items-center gap-2">
                <Icon name="history" className="size-4" />
                {t("versions.oldVersion", { number: data.versionNo, latest: data.latestVersionNo })}
              </span>
              <button type="button" className="font-medium underline" onClick={() => openVersion(null)}>
                {t("versions.openLatest")}
              </button>
            </div>
          )}

          {data.versionComment && (
            <div className="flex gap-2 rounded-2xl border border-greyscale-300 bg-white px-4 py-3 text-sm text-greyscale-700">
              <Icon name="message" className="mt-0.5 size-4 shrink-0 text-greyscale-500" />
              <span>
                <span className="font-medium text-greyscale-900">{t("versions.commentOf", { number: data.versionNo })}: </span>
                {data.versionComment}
              </span>
            </div>
          )}

          <div className="rounded-2xl border border-greyscale-300 bg-white p-5">
            <InfoList
              className="lg:grid-cols-4"
              items={[
                { key: "folder", label: t("columns.folder"), value: <FolderName name={data.folder?.name} emptyLabel={t("folders.unfiled")} /> },
                { key: "docType", label: t("columns.docType"), value: <DocTypeLabel docType={data.docType} /> },
                {
                  key: "language",
                  label: t("detail.language"),
                  value: data.language ? t(`language.${data.language}`, { defaultValue: data.language }) : "—",
                },
                {
                  key: "confidence",
                  label: t("detail.confidence"),
                  value: data.confidence === null ? "—" : `${Math.round(data.confidence * 100)}%`,
                },
                {
                  key: "createdBy",
                  label: t("detail.createdBy"),
                  value: `${data.documentCreatedBy.fullName} · ${formatDateTime(data.documentCreatedAt)}`,
                },
                {
                  key: "lastEditedBy",
                  label: t("detail.lastEditedBy"),
                  value: data.lastEditedBy ? `${data.lastEditedBy.fullName} · ${formatDateTime(data.lastEditedAt)}` : "—",
                },
                { key: "processedAt", label: t("detail.processedAt"), value: formatDateTime(data.processedAt) },
                { key: "size", label: t("detail.size"), value: formatFileSize(data.sizeBytes) },
                { key: "pages", label: t("columns.pages"), value: data.pageCount ?? "—" },
              ]}
            />
          </div>

          <div className={isSideBySide ? "grid grid-cols-2 items-start gap-5" : "flex flex-col gap-5"}>
            {isSideBySide && (
              <DocumentViewer
                fileId={data.id}
                format={data.format}
                contentType={data.contentType}
                fileName={data.originalName}
                className="sticky top-24 h-[calc(100vh-8rem)]"
              />
            )}
            <div className="flex min-w-0 flex-col gap-5">
              {data.status === ProcessingStatus.FAILED && (
                <div className="flex gap-3 rounded-2xl border border-error-200 bg-error-50 p-4 text-sm text-error-700">
                  <Icon name="x-circle" className="mt-0.5" />
                  <span>
                    <span className="block font-semibold">{t("detail.failed")}</span>
                    {data.errorMessage}
                  </span>
                </div>
              )}

              {(data.status === ProcessingStatus.PENDING || data.status === ProcessingStatus.PROCESSING) && (
                <div className="flex items-center gap-3 rounded-2xl border border-neon-blue-200 bg-neon-blue-50 p-4 text-sm text-neon-blue-800">
                  <Icon name="refresh" className="animate-spin" />
                  {t("detail.processing")}
                </div>
              )}

              {data.needsReview && (
                <div className="rounded-2xl border border-warning-200 bg-warning-50 p-4 text-sm text-warning-800">{t("detail.needsReviewHint")}</div>
              )}

              {data.warnings.length > 0 && (
                <ul className="flex flex-col gap-1 rounded-2xl border border-warning-200 bg-warning-50 p-4 text-sm text-warning-800">
                  {data.warnings.map((warning) => (
                    <li key={warning} className="flex gap-2">
                      <Icon name="alert" className="mt-0.5 size-4" />
                      {warning}
                    </li>
                  ))}
                </ul>
              )}

              {tabs.length > 1 && (
                <div className="overflow-x-auto">
                  <TabsSwitcher
                    items={tabs}
                    activeTab={activeTab}
                    onTabChange={(tab) =>
                      setSearchParams((prevState) => {
                        prevState.set(TAB_QUERY, tab);
                        return prevState;
                      })
                    }
                  />
                </div>
              )}
              {activeTab === DocumentDetailTab.Original && (
                <DocumentViewer
                  fileId={data.id}
                  format={data.format}
                  contentType={data.contentType}
                  fileName={data.originalName}
                  className="h-[75vh]"
                />
              )}
              {activeTab && activeTab !== DocumentDetailTab.Original && (
                <div className="rounded-2xl border border-greyscale-300 bg-white p-5">
                  {activeTab === DocumentDetailTab.Text && <DocumentPages pages={data.pages} />}
                  {activeTab === DocumentDetailTab.Fields && <DocumentFields fields={data.fields} labelFor={labelFor} />}
                  {activeTab === DocumentDetailTab.Stamps && <DocumentStamps stamps={data.stamps} />}
                  {activeTab === DocumentDetailTab.History && (
                    <DocumentVersionHistory fileId={data.documentId} viewedVersionNo={data.versionNo} onOpenVersion={openVersion} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ActivityCondition>
  );
};
