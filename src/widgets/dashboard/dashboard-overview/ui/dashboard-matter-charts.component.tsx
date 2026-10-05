import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { BarList, ColumnChart, DonutChart } from "@/shared/components/charts/charts.entry";
import { SectionCard } from "@/shared/components/section-card/section-card.entry";
import { dayjs } from "@/shared/lib/dayjs-lib";

import { MatterStatusChartColor, matterApi, matterApiQueryKeys } from "@/entities/matter/matter.entry";

export const DashboardMatterCharts = () => {
  const { t } = useTranslation(["dashboard", "matter"]);

  const { data } = useQuery({
    queryFn: matterApi.getMatterStatistics,
    queryKey: matterApiQueryKeys.getKey("getMatterStatistics"),
  });

  if (!data) return <Skeleton className="h-80 rounded-2xl" />;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
      <SectionCard title={t("dashboard:charts.byStatus")}>
        <DonutChart
          centerLabel={t("dashboard:charts.matters")}
          data={data.byStatus.map((item) => ({
            key: item.status,
            label: t(`matter:status.${item.status}`),
            value: item.count,
            colorClass: MatterStatusChartColor[item.status],
          }))}
        />
      </SectionCard>
      <SectionCard title={t("dashboard:charts.trend")} subtitle={t("dashboard:charts.trendHint")}>
        <ColumnChart
          categories={data.monthlyTrend.map((item) => dayjs(`${item.month}-01`).format("MMM"))}
          series={[
            { key: "created", label: t("dashboard:charts.created"), colorClass: "fill-neon-blue-300", legendClass: "bg-neon-blue-300" },
            { key: "completed", label: t("dashboard:charts.completed"), colorClass: "fill-main-green-500", legendClass: "bg-main-green-500" },
          ]}
          values={{
            created: data.monthlyTrend.map((item) => item.created),
            completed: data.monthlyTrend.map((item) => item.completed),
          }}
        />
      </SectionCard>
      <SectionCard title={t("dashboard:charts.byType")}>
        <BarList
          data={[...data.byType]
            .sort((a, b) => b.count - a.count)
            .map((item) => ({ key: item.type, label: t(`matter:type.${item.type}`), value: item.count, colorClass: "fill-main-green-500" }))}
        />
      </SectionCard>
    </div>
  );
};
