import { EmptyData } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { ROUTES } from "@/shared/const/route-const";

export const NotFoundPage = () => {
  const { t } = useTranslation("common");

  return (
    <EmptyData
      title={t("system.notFound")}
      className="rounded-2xl bg-white py-20"
      extraContent={
        <Link to={ROUTES.dashboard} className="text-sm font-medium text-main-green-700">
          {t("system.toHome")}
        </Link>
      }
    />
  );
};
