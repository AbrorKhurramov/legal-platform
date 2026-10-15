import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import { EmptyData, Skeleton } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { type DiffLine, diffLines, toSideBySide } from "@/shared/lib/text-diff-lib";

import { type DocumentDetailDTO, documentApi, documentApiQueryKeys } from "@/entities/document/document.entry";

/** Compared by the extracted text, line by line: that is what both formats (OCR and Word/Excel) share. */
const linesOf = (document: DocumentDetailDTO) =>
  document.pages
    .flatMap((page) => page.text.split("\n"))
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);

const CELL_CLASS: Record<DiffLine["operation"], string> = {
  same: "text-greyscale-700",
  removed: "bg-error-50 text-error-700 line-through decoration-error-300",
  added: "bg-success-50 text-success-800",
};

interface IDocumentVersionCompareProps {
  fileId: string;
  fromVersion: number;
  toVersion: number;
}

export const DocumentVersionCompare = (props: IDocumentVersionCompareProps) => {
  const { fileId, fromVersion, toVersion } = props;
  const { t } = useTranslation("document");

  const { data: from } = useQuery({
    queryFn: () => documentApi.getDocumentDetail(fileId, fromVersion),
    queryKey: documentApiQueryKeys.getKey("getDocumentDetail", fileId, fromVersion),
  });
  const { data: to } = useQuery({
    queryFn: () => documentApi.getDocumentDetail(fileId, toVersion),
    queryKey: documentApiQueryKeys.getKey("getDocumentDetail", fileId, toVersion),
  });

  const rows = useMemo(() => {
    if (!from || !to) return undefined;
    const lines = diffLines(linesOf(from), linesOf(to));
    return lines && toSideBySide(lines);
  }, [from, to]);

  if (rows === undefined) return <Skeleton className="h-48 rounded-xl" />;
  if (rows === null) return <EmptyData title={t("versions.compareTooLarge")} className="py-10" />;

  const changes = rows.filter((row) => row.left?.operation !== "same").length;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-greyscale-600">{changes ? t("versions.changes", { count: changes }) : t("versions.noChanges")}</p>
      <div className="overflow-hidden rounded-xl border border-greyscale-300">
        <div className="grid grid-cols-2 border-b border-greyscale-300 bg-greyscale-100 text-xs font-semibold text-greyscale-700">
          <span className="px-3 py-2">{t("versions.versionLabel", { number: fromVersion })}</span>
          <span className="border-l border-greyscale-300 px-3 py-2">{t("versions.versionLabel", { number: toVersion })}</span>
        </div>
        <div className="max-h-[60vh] overflow-y-auto text-sm">
          {rows.map((row, index) => (
            <div key={index} className="grid grid-cols-2 border-b border-greyscale-100 last:border-0">
              <span className={twMerge("px-3 py-1.5 whitespace-pre-wrap", row.left && CELL_CLASS[row.left.operation])}>{row.left?.text}</span>
              <span
                className={twMerge("border-l border-greyscale-200 px-3 py-1.5 whitespace-pre-wrap", row.right && CELL_CLASS[row.right.operation])}
              >
                {row.right?.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
