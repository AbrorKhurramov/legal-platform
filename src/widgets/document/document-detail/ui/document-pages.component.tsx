import { EmptyData } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { DocumentBlocks, type DocumentPageDTO } from "@/entities/document/document.entry";

interface IDocumentPagesProps {
  pages: DocumentPageDTO[];
}

export const DocumentPages = (props: IDocumentPagesProps) => {
  const { t } = useTranslation("document");

  if (!props.pages.length) return <EmptyData title={t("text.empty")} />;

  return (
    <div className="flex flex-col gap-6">
      {props.pages.map((page) => (
        <section key={page.number} className="flex flex-col gap-3">
          {props.pages.length > 1 && (
            <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-greyscale-500 uppercase">
              <span>{page.title ?? t("text.page", { page: page.number })}</span>
              {page.confidence !== null && page.confidence < 1 && (
                <span className="normal-case">{t("text.confidence", { value: Math.round(page.confidence * 100) })}</span>
              )}
              <span className="h-px flex-1 bg-greyscale-300" />
            </div>
          )}
          <DocumentBlocks blocks={page.blocks} />
        </section>
      ))}
    </div>
  );
};
