import { useTranslation } from "react-i18next";

import { PageHeading } from "@/shared/components/page-heading/page-heading.entry";

import { DocumentRegistry } from "@/widgets/document/document-registry/document-registry.entry";

export const DocumentListPage = () => {
  const { t } = useTranslation("document");

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title={t("documents.title")} description={t("documents.description")} />
      <DocumentRegistry />
    </div>
  );
};
