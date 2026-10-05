import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { BarList } from "@/shared/components/charts/charts.entry";
import { SectionCard } from "@/shared/components/section-card/section-card.entry";
import { ROUTES } from "@/shared/const/route-const";

import { RiskLevelChartColor, RiskMatrix, riskApi, riskApiQueryKeys } from "@/entities/risk/risk.entry";

export const DashboardRisk = () => {
  const { t } = useTranslation(["dashboard", "risk", "common"]);

  const { data } = useQuery({
    queryFn: riskApi.getRiskStatistics,
    queryKey: riskApiQueryKeys.getKey("getRiskStatistics"),
  });

  if (!data) return <Skeleton className="h-80 rounded-2xl" />;

  return (
    <SectionCard
      title={t("dashboard:risk.title")}
      subtitle={t("dashboard:risk.subtitle", { count: data.open })}
      extra={
        <Link to={ROUTES.risks} className="text-sm font-medium text-main-green-700 hover:underline">
          {t("common:viewAll")}
        </Link>
      }
    >
      <div className="flex flex-col gap-5">
        <RiskMatrix matrix={data.matrix} />
        <BarList
          data={[...data.byLevel]
            .reverse()
            .map((item) => ({
              key: item.level,
              label: t(`risk:level.${item.level}`),
              value: item.count,
              colorClass: RiskLevelChartColor[item.level],
            }))}
        />
      </div>
    </SectionCard>
  );
};
