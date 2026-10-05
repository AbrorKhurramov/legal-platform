import { useTranslation } from "react-i18next";

import { PageHeading } from "@/shared/components/page-heading/page-heading.entry";

import { LegislationRegistry } from "@/widgets/legislation/legislation-registry/legislation-registry.entry";

export const LegislationListPage = () => {
  const { t } = useTranslation("legislation");

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title={t("page.title")} description={t("page.description")} />
      <LegislationRegistry />
    </div>
  );
};
