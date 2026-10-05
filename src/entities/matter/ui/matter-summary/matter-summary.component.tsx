import { useTranslation } from "react-i18next";

import { InfoList } from "@/shared/components/info-list/info-list.entry";
import { SectionCard } from "@/shared/components/section-card/section-card.entry";
import { formatDate, formatDateTime } from "@/shared/utils/format-date";
import { formatMoney } from "@/shared/utils/format-number";

import { MatterStatus } from "../../model/matter.const";
import type { MatterDetailDTO } from "../../model/matter.types";
import { MatterDeadline } from "../matter-deadline/matter-deadline.component";

interface IMatterSummaryProps {
  matter: MatterDetailDTO;
}

export const MatterSummary = (props: IMatterSummaryProps) => {
  const { matter } = props;
  const { t } = useTranslation(["matter", "common"]);
  const isClosed = matter.status === MatterStatus.COMPLETED || matter.status === MatterStatus.REJECTED;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
      <SectionCard title={t("matter:section.description")} className="xl:col-span-2">
        <p className="text-sm leading-6 whitespace-pre-line text-greyscale-800">{matter.description}</p>
        {matter.finalResult && (
          <div className="mt-5 rounded-xl border border-main-green-200 bg-main-green-50 p-4">
            <div className="text-xs font-semibold text-main-green-800 uppercase">{t("matter:fields.finalResult")}</div>
            <p className="mt-1 text-sm text-greyscale-800">{matter.finalResult}</p>
          </div>
        )}
      </SectionCard>
      <SectionCard title={t("matter:section.details")}>
        <InfoList
          className="sm:grid-cols-1"
          items={[
            { key: "type", label: t("matter:fields.type"), value: t(`matter:type.${matter.type}`) },
            { key: "complexity", label: t("matter:fields.complexity"), value: t(`matter:complexity.${matter.complexity}`) },
            { key: "initiator", label: t("matter:fields.initiator"), value: `${matter.initiator.fullName} · ${matter.branch.name}` },
            { key: "lawyer", label: t("matter:fields.lawyer"), value: matter.lawyer?.fullName ?? t("common:notAssigned") },
            { key: "createdAt", label: t("matter:fields.createdAt"), value: formatDateTime(matter.createdAt) },
            {
              key: "dueDate",
              label: t("matter:fields.dueDate"),
              value: <MatterDeadline dueDate={matter.dueDate} isOverdue={matter.isOverdue} isPaused={matter.isDeadlinePaused} isClosed={isClosed} />,
            },
            ...(matter.pausedDays > 0
              ? [{ key: "paused", label: t("matter:fields.pausedDays"), value: t("common:daysCount", { count: matter.pausedDays }) }]
              : []),
            ...(matter.completedAt ? [{ key: "completedAt", label: t("matter:fields.completedAt"), value: formatDate(matter.completedAt) }] : []),
            ...(matter.counterparty ? [{ key: "counterparty", label: t("matter:fields.counterparty"), value: matter.counterparty }] : []),
            ...(matter.contractAmount
              ? [{ key: "amount", label: t("matter:fields.contractAmount"), value: formatMoney(matter.contractAmount) }]
              : []),
            { key: "version", label: t("matter:fields.currentVersion"), value: matter.currentVersion ? `v${matter.currentVersion}` : "—" },
          ]}
        />
      </SectionCard>
    </div>
  );
};
