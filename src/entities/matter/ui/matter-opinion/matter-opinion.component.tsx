import { EmptyData } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui/icon/icon.entry";
import { formatDateTime } from "@/shared/utils/format-date";

import type { MatterOpinionDTO } from "../../model/matter.types";
import { OpinionResultBadge } from "../matter-tags/matter-tags.component";

interface IMatterOpinionProps {
  opinion: MatterOpinionDTO | null;
}

export const MatterOpinion = (props: IMatterOpinionProps) => {
  const { opinion } = props;
  const { t } = useTranslation("matter");

  if (!opinion) return <EmptyData title={t("opinion.empty")} />;

  return (
    <article className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-sm text-greyscale-500">{opinion.number}</span>
        <OpinionResultBadge result={opinion.result} />
        {opinion.isAiDraft && (
          <span className="flex items-center gap-1 rounded-full bg-electro-50 px-2.5 py-0.5 text-xs font-medium text-electro-600">
            <Icon name="lightbulb" className="size-3.5" />
            {t("opinion.aiDraft")}
          </span>
        )}
      </div>
      <p className="text-sm leading-6 whitespace-pre-line text-greyscale-800">{opinion.text}</p>
      <div className="border-t border-greyscale-300 pt-3 text-xs text-greyscale-500">{`${opinion.lawyer.fullName} · ${formatDateTime(opinion.createdAt)}`}</div>
    </article>
  );
};
