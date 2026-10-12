import { EmptyData } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import type { DocumentFieldDTO } from "../model/document.types";
import { NeedsReviewBadge } from "./document-tags.component";

interface IDocumentFieldsProps {
  fields: DocumentFieldDTO[];
  labelFor(name: string): string;
}

export const DocumentFields = (props: IDocumentFieldsProps) => {
  const { fields, labelFor } = props;
  const { t } = useTranslation("document");

  if (!fields.length) return <EmptyData title={t("fields.empty")} />;

  return (
    <dl className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {fields.map((field, index) => (
        <div key={`${field.name}-${index}`} className="flex flex-col gap-1.5 rounded-xl border border-greyscale-300 p-4">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-xs font-medium tracking-wide text-greyscale-500 uppercase">{labelFor(field.name)}</dt>
            {field.needsConfirmation && <NeedsReviewBadge />}
          </div>
          <dd className="text-sm font-semibold break-words text-greyscale-900">{field.value}</dd>
          {field.quote && field.quote !== field.value && (
            <p className="rounded-md bg-greyscale-100 px-2 py-1 text-xs text-greyscale-600 italic">
              “{field.quote}”{field.page ? ` · ${t("fields.page", { page: field.page })}` : ""}
            </p>
          )}
        </div>
      ))}
    </dl>
  );
};
