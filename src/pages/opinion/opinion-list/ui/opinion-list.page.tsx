import { useTranslation } from "react-i18next";

import { PageHeading } from "@/shared/components/page-heading/page-heading.entry";

import { OpinionRegistry } from "@/widgets/opinion/opinion-registry/opinion-registry.entry";

export const OpinionListPage = () => {
  const { t } = useTranslation("opinion");

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title={t("page.title")} description={t("page.description")} />
      <OpinionRegistry />
    </div>
  );
};
