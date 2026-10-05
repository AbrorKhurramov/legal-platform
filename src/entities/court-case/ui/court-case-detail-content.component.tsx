import type { ReactNode } from "react";

import { Checkbox } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { InfoList } from "@/shared/components/info-list/info-list.entry";
import { Timeline } from "@/shared/components/timeline/timeline.entry";
import { daysUntil, formatDate } from "@/shared/utils/format-date";
import { formatMoney } from "@/shared/utils/format-number";

import type { CourtCaseDetailDTO } from "../model/court-case.types";
import { CourtCaseCategoryTag, CourtCaseResultTag, CourtCaseStageTag } from "./court-case-tags.component";

interface ICourtCaseDetailContentProps {
  data: CourtCaseDetailDTO;
  footer?: ReactNode;
  onToggleDeadline(deadlineId: string): void;
}

export const CourtCaseDetailContent = (props: ICourtCaseDetailContentProps) => {
  const { data, footer, onToggleDeadline } = props;
  const { t } = useTranslation("court");
  const recoveryRate = data.claimAmount ? Math.round((data.recoveredAmount / data.claimAmount) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <CourtCaseCategoryTag category={data.category} />
        <CourtCaseStageTag stage={data.stage} />
        <CourtCaseResultTag result={data.result} />
      </div>
      <InfoList
        items={[
          { key: "plaintiff", label: t("fields.plaintiff"), value: data.plaintiff },
          { key: "defendant", label: t("fields.defendant"), value: data.defendant },
          { key: "court", label: t("fields.court"), value: data.court },
          { key: "lawyer", label: t("fields.lawyer"), value: data.lawyer.fullName },
          { key: "claim", label: t("fields.claimAmount"), value: formatMoney(data.claimAmount) },
          { key: "recovered", label: t("fields.recoveredAmount"), value: `${formatMoney(data.recoveredAmount)} (${recoveryRate}%)` },
          { key: "filedAt", label: t("fields.filedAt"), value: formatDate(data.filedAt) },
          { key: "hearing", label: t("fields.nextHearingDate"), value: formatDate(data.nextHearingDate) },
          { key: "subject", label: t("fields.subject"), value: data.subject, isWide: true },
        ]}
      />
      {footer}
      <section>
        <h3 className="mb-3 text-h6 text-greyscale-900">{t("section.deadlines")}</h3>
        <ul className="flex flex-col gap-2">
          {data.deadlines.map((deadline) => {
            const isLate = !deadline.isDone && daysUntil(deadline.date) < 0;
            return (
              <li key={deadline.id} className="flex items-center gap-3 rounded-xl border border-greyscale-300 px-4 py-3">
                <Checkbox checked={deadline.isDone} onChange={() => onToggleDeadline(deadline.id)} colorType="MainGreen" />
                <span className={twMerge("flex-1 text-sm text-greyscale-800", deadline.isDone && "text-greyscale-500 line-through")}>
                  {deadline.title}
                </span>
                <span className={twMerge("text-xs text-greyscale-600", isLate && "font-semibold text-error-500")}>{formatDate(deadline.date)}</span>
              </li>
            );
          })}
        </ul>
      </section>
      <section>
        <h3 className="mb-3 text-h6 text-greyscale-900">{t("section.events")}</h3>
        <Timeline
          items={data.events.map((event) => ({
            id: event.id,
            icon: "gavel",
            iconClassName: "bg-blue-50 text-blue-500",
            title: <span className="font-semibold">{event.title}</span>,
            meta: formatDate(event.date),
            body: event.description,
          }))}
        />
      </section>
      <section>
        <h3 className="mb-3 text-h6 text-greyscale-900">{t("section.documents")}</h3>
        <ul className="flex flex-col gap-2">
          {data.documents.map((document) => (
            <li key={document.id} className="flex items-center justify-between text-sm text-greyscale-800">
              <span className="truncate">{document.name}</span>
              <span className="text-xs text-greyscale-500">{formatDate(document.uploadedAt)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
