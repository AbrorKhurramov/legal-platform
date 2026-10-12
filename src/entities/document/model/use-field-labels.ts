import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { documentApi, documentApiQueryKeys } from "./document.api";

const ONE_HOUR = 60 * 60 * 1000;

/**
 * Field labels in the UI language from the OCR service's catalogue. The same field name means
 * different things per type ({@code number} is the contract number or the power of attorney number),
 * so the document's own type wins; other types are a fallback; the raw name until the catalogue loads.
 */
export const useFieldLabels = (docType?: string | null) => {
  const { i18n } = useTranslation();

  const { data } = useQuery({
    queryFn: documentApi.getDocTypes,
    queryKey: documentApiQueryKeys.getKey("getDocTypes"),
    staleTime: ONE_HOUR,
  });

  const labels = new Map<string, string>();
  const ordered = [...(data ?? [])].sort((a, b) => Number(b.code === docType) - Number(a.code === docType));
  ordered.forEach((type) =>
    type.fields.forEach((field) => {
      if (!labels.has(field.name)) labels.set(field.name, i18n.resolvedLanguage === "ru" ? field.labelRu : field.labelUz);
    }),
  );

  return (name: string) => labels.get(name) ?? name;
};
