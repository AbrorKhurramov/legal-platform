import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { DonutChart } from "@/shared/components/charts/charts.entry";
import { SectionCard } from "@/shared/components/section-card/section-card.entry";
import { ROUTES } from "@/shared/const/route-const";
import { formatMoneyShort } from "@/shared/utils/format-number";

import { CourtCaseResultChartColor, courtCaseApi, courtCaseApiQueryKeys } from "@/entities/court-case/court-case.entry";

export const DashboardCourt = () => {
  const { t } = useTranslation(["dashboard", "court", "common"]);

  const { data } = useQuery({
    queryFn: courtCaseApi.getCourtCaseStatistics,
    queryKey: courtCaseApiQueryKeys.getKey("getCourtCaseStatistics"),
  });

  if (!data) return <Skeleton className="h-80 rounded-2xl" />;

  const recoveryRate = data.claimTotal ? Math.round((data.recoveredTotal / data.claimTotal) * 100) : 0;

  return (
    <SectionCard
      title={t("dashboard:court.title")}
      subtitle={t("dashboard:court.subtitle", { active: data.active, total: data.total })}
      extra={
        <Link to={ROUTES.courtCases} className="text-sm font-medium text-main-green-700 hover:underline">
          {t("common:viewAll")}
        </Link>
      }
    >
      <div className="flex flex-col gap-5">
        <DonutChart
          centerLabel={t("dashboard:court.cases")}
          data={data.byResult.map((item) => ({
            key: item.result,
            label: t(`court:result.${item.result}`),
            value: item.count,
            colorClass: CourtCaseResultChartColor[item.result],
          }))}
        />
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-greyscale-100 p-3">
            <div className="text-xs text-greyscale-500">{t("dashboard:court.claimed")}</div>
            <div className="text-h6 text-greyscale-900">{formatMoneyShort(data.claimTotal)}</div>
          </div>
          <div className="rounded-xl bg-success-50 p-3">
            <div className="text-xs text-success-700">{t("dashboard:court.recovered")}</div>
            <div className="text-h6 text-success-800">{formatMoneyShort(data.recoveredTotal)}</div>
          </div>
          <div className="rounded-xl bg-main-green-50 p-3">
            <div className="text-xs text-main-green-700">{t("dashboard:court.rate")}</div>
            <div className="text-h6 text-main-green-800">{`${recoveryRate}%`}</div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};
