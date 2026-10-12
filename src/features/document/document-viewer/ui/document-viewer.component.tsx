import { useCallback, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { EmptyData, Skeleton } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { type DocumentFormat, documentApi, documentApiQueryKeys } from "@/entities/document/document.entry";

import { VIEWER_BY_FORMAT, ViewerKind } from "../common/document-viewer.const";
import { BlobViewer } from "./blob-viewer.component";
import { DocxViewer } from "./docx-viewer.component";
import { XlsxViewer } from "./xlsx-viewer.component";

/** The bytes can be tens of megabytes; they are dropped soon after the page is left. */
const ORIGINAL_GC_MS = 60_000;

interface IDocumentViewerProps {
  fileId: string;
  format: DocumentFormat;
  contentType: string;
  fileName: string;
  className?: string;
}

export const DocumentViewer = (props: IDocumentViewerProps) => {
  const { fileId, format, contentType, fileName, className } = props;
  const { t } = useTranslation("document");
  const kind = VIEWER_BY_FORMAT[format];
  const [renderFailed, setRenderFailed] = useState(false);
  const handleRenderError = useCallback(() => setRenderFailed(true), []);

  const { data, isFetching, isError } = useQuery({
    queryFn: () => documentApi.getOriginal(fileId),
    queryKey: documentApiQueryKeys.getKey("getOriginal", fileId),
    enabled: kind !== ViewerKind.NONE,
    staleTime: Infinity,
    gcTime: ORIGINAL_GC_MS,
  });

  const renderBody = () => {
    if (kind === ViewerKind.NONE) {
      return <EmptyData title={t("viewer.unsupported", { format })} className="py-16" />;
    }
    if (isError || renderFailed) return <EmptyData title={t("viewer.failed")} className="py-16" />;
    if (isFetching || !data) return <Skeleton className="m-4 h-[calc(100%-2rem)] min-h-64 rounded-lg" />;
    if (kind === ViewerKind.DOCX) return <DocxViewer data={data} onError={handleRenderError} />;
    if (kind === ViewerKind.XLSX) return <XlsxViewer data={data} onError={handleRenderError} />;
    return <BlobViewer kind={kind} data={data} contentType={contentType} title={fileName} />;
  };

  return <div className={twMerge("overflow-hidden rounded-2xl border border-greyscale-300 bg-white", className)}>{renderBody()}</div>;
};
