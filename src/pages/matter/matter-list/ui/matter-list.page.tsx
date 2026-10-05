import { useTranslation } from "react-i18next";

import { PageHeading } from "@/shared/components/page-heading/page-heading.entry";

import { MatterRegistry } from "@/widgets/matter/matter-registry/matter-registry.entry";

export const MatterListPage = () => {
  const { t } = useTranslation("matter");

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title={t("page.title")} description={t("page.description")} />
      <MatterRegistry />
    </div>
  );
};
