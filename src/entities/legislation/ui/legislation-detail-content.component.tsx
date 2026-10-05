import type { ReactNode } from "react";

import { Checkbox } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { InfoList } from "@/shared/components/info-list/info-list.entry";
import { formatDate } from "@/shared/utils/format-date";

import type { LegislationDetailDTO } from "../model/legislation.types";
import { ImpactLevelTag, LegislationStatusTag } from "./legislation-tags.component";

interface ILegislationDetailContentProps {
  data: LegislationDetailDTO;
  taskForm?: ReactNode;
  onToggleTask(taskId: string): void;
}

export const LegislationDetailContent = (props: ILegislationDetailContentProps) => {
  const { data, taskForm, onToggleTask } = props;
  const { t } = useTranslation("legislation");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <LegislationStatusTag status={data.status} />
        <ImpactLevelTag level={data.impactLevel} />
      </div>
      <InfoList
        items={[
          { key: "docNumber", label: t("fields.docNumber"), value: data.docNumber },
          { key: "source", label: t("fields.source"), value: t(`source.${data.source}`) },
          { key: "publishedAt", label: t("fields.publishedAt"), value: formatDate(data.publishedAt) },
          { key: "effectiveAt", label: t("fields.effectiveAt"), value: formatDate(data.effectiveAt) },
          { key: "responsible", label: t("fields.responsible"), value: data.responsible.fullName },
          { key: "summary", label: t("fields.summary"), value: data.summary, isWide: true },
        ]}
      />
      <section>
        <h3 className="mb-3 text-h6 text-greyscale-900">{t("section.affectedDocuments")}</h3>
        <ul className="flex flex-col gap-2">
          {data.affectedDocuments.map((document) => (
            <li key={document.id} className="flex items-center justify-between gap-3 rounded-xl bg-greyscale-100 px-4 py-3 text-sm">
              <span className="text-greyscale-800">{document.name}</span>
              <span className="shrink-0 text-xs text-greyscale-500">{document.department}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="mb-3 text-h6 text-greyscale-900">{`${t("section.tasks")} (${data.tasksDone}/${data.tasksTotal})`}</h3>
        <ul className="flex flex-col gap-2">
          {data.tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-3 rounded-xl border border-greyscale-300 px-4 py-3">
              <Checkbox checked={task.isDone} onChange={() => onToggleTask(task.id)} colorType="MainGreen" />
              <span className="min-w-0 flex-1">
                <span className={twMerge("block text-sm text-greyscale-800", task.isDone && "text-greyscale-500 line-through")}>{task.title}</span>
                <span className="text-xs text-greyscale-500">{task.assignee.fullName}</span>
              </span>
              <span className="text-xs text-greyscale-600">{formatDate(task.dueDate)}</span>
            </li>
          ))}
        </ul>
        {taskForm}
      </section>
    </div>
  );
};
