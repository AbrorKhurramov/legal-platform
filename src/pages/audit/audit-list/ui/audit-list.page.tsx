import { useTranslation } from "react-i18next";

import { PageHeading } from "@/shared/components/page-heading/page-heading.entry";

import { AuditLog } from "@/widgets/audit/audit-log/audit-log.entry";

export const AuditListPage = () => {
  const { t } = useTranslation("audit");

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title={t("page.title")} description={t("page.description")} />
      <AuditLog />
    </div>
  );
};
