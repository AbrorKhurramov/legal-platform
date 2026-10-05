import { useTranslation } from "react-i18next";

import { PageHeading } from "@/shared/components/page-heading/page-heading.entry";

import { CourtCaseRegistry } from "@/widgets/court-case/court-case-registry/court-case-registry.entry";

export const CourtCaseListPage = () => {
  const { t } = useTranslation("court");

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title={t("page.title")} description={t("page.description")} />
      <CourtCaseRegistry />
    </div>
  );
};
