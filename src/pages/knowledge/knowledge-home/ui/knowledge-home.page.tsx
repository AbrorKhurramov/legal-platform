import { useTranslation } from "react-i18next";

import { PageHeading } from "@/shared/components/page-heading/page-heading.entry";

import { KnowledgeBase } from "@/widgets/knowledge/knowledge-base/knowledge-base.entry";

export const KnowledgeHomePage = () => {
  const { t } = useTranslation("knowledge");

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title={t("page.title")} description={t("page.description")} />
      <KnowledgeBase />
    </div>
  );
};
