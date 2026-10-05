import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui/icon/icon.entry";

import { AuditTable } from "@/features/audit/audit-table/audit-table.entry";

export const AuditLog = () => {
  const { t } = useTranslation("audit");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 rounded-2xl border border-neon-blue-200 bg-neon-blue-50 p-4 text-sm text-neon-blue-800">
        <Icon name="info" className="mt-0.5" />
        <span>{t("notice")}</span>
      </div>
      <AuditTable />
    </div>
  );
};
