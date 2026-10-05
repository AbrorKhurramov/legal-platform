import { useTranslation } from "react-i18next";

import { PageHeading } from "@/shared/components/page-heading/page-heading.entry";

import { RiskRegistry } from "@/widgets/risk/risk-registry/risk-registry.entry";

export const RiskListPage = () => {
  const { t } = useTranslation("risk");

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title={t("page.title")} description={t("page.description")} />
      <RiskRegistry />
    </div>
  );
};
