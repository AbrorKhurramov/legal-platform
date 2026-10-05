import type { ReactNode } from "react";

import { useTranslation } from "react-i18next";

import { InfoList } from "@/shared/components/info-list/info-list.entry";
import { Timeline } from "@/shared/components/timeline/timeline.entry";
import { formatDate, formatDateTime } from "@/shared/utils/format-date";

import type { RiskDetailDTO } from "../model/risk.types";
import { RiskLevelTag, RiskStatusTag } from "./risk-tags.component";

interface IRiskDetailContentProps {
  data: RiskDetailDTO;
  actionForm?: ReactNode;
}

export const RiskDetailContent = (props: IRiskDetailContentProps) => {
  const { data, actionForm } = props;
  const { t } = useTranslation("risk");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm text-greyscale-500">{data.code}</span>
        <RiskLevelTag level={data.level} />
        <RiskStatusTag status={data.status} />
      </div>
      <InfoList
        items={[
          { key: "category", label: t("fields.category"), value: t(`category.${data.category}`) },
          { key: "score", label: t("fields.score"), value: `${data.probability} × ${data.impact} = ${data.probability * data.impact}` },
          { key: "owner", label: t("fields.owner"), value: data.owner.fullName },
          { key: "branch", label: t("fields.branch"), value: data.branch.name },
          { key: "dueDate", label: t("fields.dueDate"), value: formatDate(data.dueDate) },
          { key: "matter", label: t("fields.relatedMatter"), value: data.relatedMatterNumber ?? "—" },
          { key: "description", label: t("fields.description"), value: data.description, isWide: true },
          { key: "mitigation", label: t("fields.mitigation"), value: data.mitigation, isWide: true },
        ]}
      />
      {actionForm}
      <section>
        <h3 className="mb-3 text-h6 text-greyscale-900">{t("section.notes")}</h3>
        <Timeline
          items={data.notes.map((note) => ({
            id: note.id,
            icon: "message",
            iconClassName: "bg-electro-50 text-electro-500",
            title: <span className="font-semibold">{note.author.fullName}</span>,
            meta: formatDateTime(note.createdAt),
            body: note.text,
          }))}
        />
      </section>
    </div>
  );
};
