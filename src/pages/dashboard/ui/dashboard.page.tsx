import { useTranslation } from "react-i18next";

import { PageHeading } from "@/shared/components/page-heading/page-heading.entry";

import { DashboardOverview } from "@/widgets/dashboard/dashboard-overview/dashboard-overview.entry";

export const DashboardPage = () => {
  const { t } = useTranslation("dashboard");

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title={t("page.title")} description={t("page.description")} />
      <DashboardOverview />
    </div>
  );
};
