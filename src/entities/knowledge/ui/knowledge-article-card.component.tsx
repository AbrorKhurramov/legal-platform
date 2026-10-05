import { Button, Tag } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui/icon/icon.entry";
import { formatDate } from "@/shared/utils/format-date";

import type { KnowledgeArticleDTO } from "../model/knowledge.types";

interface IKnowledgeArticleCardProps {
  article: KnowledgeArticleDTO;
  isExpanded: boolean;
  onToggle(): void;
  onCopy(): void;
}

export const KnowledgeArticleCard = (props: IKnowledgeArticleCardProps) => {
  const { article, isExpanded, onToggle, onCopy } = props;
  const { t } = useTranslation("knowledge");

  return (
    <article className="rounded-2xl border border-greyscale-300 bg-white transition hover:border-main-green-300">
      <button type="button" onClick={onToggle} className="flex w-full items-start gap-4 p-5 text-left">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-main-green-50 text-main-green-700">
          <Icon name="lightbulb" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <Tag colorType="SkyBlue" sizeType="sm" rounded>
              {t(`category.${article.category}`)}
            </Tag>
            <span className="text-xs text-greyscale-500">{t("usedTimes", { count: article.usageCount })}</span>
          </span>
          <span className="mt-2 block text-base font-semibold text-greyscale-900">{article.question}</span>
        </span>
        <Icon name={isExpanded ? "chevron-down" : "chevron-right"} className="mt-2 text-greyscale-500" />
      </button>
      {isExpanded && (
        <div className="border-t border-greyscale-300 px-5 py-4">
          <p className="text-sm leading-6 whitespace-pre-line text-greyscale-800">{article.answer}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {article.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-greyscale-200 px-2 py-0.5 text-xs text-greyscale-700">{`#${tag}`}</span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-greyscale-500">
                {`${article.author.fullName} · ${formatDate(article.updatedAt)}`}
                {article.sourceMatterNumber && ` · ${article.sourceMatterNumber}`}
              </span>
              <Button sizeType="sm" variantType="Outlined" colorType="MainGreen" leftIcon={<Icon name="copy" className="size-4" />} onClick={onCopy}>
                {t("copyAnswer")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
