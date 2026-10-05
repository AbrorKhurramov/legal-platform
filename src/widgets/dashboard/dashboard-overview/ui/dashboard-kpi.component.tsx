import { useQuery } from "@tanstack/react-query";
import { SkeletonWrapper } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { StatCard, StatCardSkeleton } from "@/shared/components/stat-card/stat-card.entry";
import { ROUTES } from "@/shared/const/route-const";
import { formatNumber } from "@/shared/utils/format-number";

import { MatterStatus, matterApi, matterApiQueryKeys } from "@/entities/matter/matter.entry";

export const DashboardKpi = () => {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();

  const { data } = useQuery({
    queryFn: matterApi.getMatterStatistics,
    queryKey: matterApiQueryKeys.getKey("getMatterStatistics"),
  });

  if (!data) {
    return (
      <SkeletonWrapper count={6} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCardSkeleton />
      </SkeletonWrapper>
    );
  }

  const { kpi } = data;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      <StatCard
        icon="briefcase"
        tone="blue"
        label={t("kpi.active")}
        value={formatNumber(kpi.active)}
        hint={t("kpi.totalHint", { count: kpi.total })}
        onClick={() => navigate(ROUTES.matters)}
      />
      <StatCard
        icon="alert"
        tone="red"
        label={t("kpi.overdue")}
        value={formatNumber(kpi.overdue)}
        hint={t("kpi.overdueHint")}
        onClick={() => navigate(`${ROUTES.matters}?overdueOnly=true`)}
      />
      <StatCard
        icon="pause"
        tone="amber"
        label={t("kpi.incompleteDocs")}
        value={formatNumber(kpi.incompleteDocs)}
        hint={t("kpi.incompleteDocsHint")}
        onClick={() => navigate(`${ROUTES.matters}?status=${MatterStatus.INCOMPLETE_DOCS}`)}
      />
      <StatCard
        icon="stamp"
        tone="violet"
        label={t("kpi.onApproval")}
        value={formatNumber(kpi.onApproval)}
        hint={t("kpi.onApprovalHint")}
        onClick={() => navigate(`${ROUTES.matters}?status=${MatterStatus.ON_APPROVAL}`)}
      />
      <StatCard
        icon="check-circle"
        tone="green"
        label={t("kpi.completedThisMonth")}
        value={formatNumber(kpi.completedThisMonth)}
        hint={t("kpi.completedHint")}
      />
      <StatCard
        icon="clock"
        tone="gray"
        label={t("kpi.avgResolution")}
        value={t("kpi.days", { count: kpi.avgResolutionDays })}
        hint={t("kpi.avgResolutionHint")}
      />
    </div>
  );
};
