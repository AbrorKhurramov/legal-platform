import { useTranslation } from "react-i18next";

import { PageHeading } from "@/shared/components/page-heading/page-heading.entry";

import { FileManager } from "@/widgets/document/file-manager/file-manager.entry";

export const FileManagerPage = () => {
  const { t } = useTranslation("document");

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title={t("fileManager.title")} description={t("fileManager.description")} />
      <FileManager />
    </div>
  );
};
