import { useQuery } from "@tanstack/react-query";
import { EmptyData, Skeleton } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { SectionCard } from "@/shared/components/section-card/section-card.entry";
import { ROUTES, buildMatterDetailRoute } from "@/shared/const/route-const";
import { Icon } from "@/shared/ui/icon/icon.entry";
import { formatDateTime } from "@/shared/utils/format-date";

import { courtCaseApi, courtCaseApiQueryKeys } from "@/entities/court-case/court-case.entry";
import { MatterDeadline, matterApi, matterApiQueryKeys } from "@/entities/matter/matter.entry";

export const DashboardDeadlines = () => {
  const { t } = useTranslation(["dashboard", "common"]);

  const { data: matters } = useQuery({
    queryFn: matterApi.getMatterStatistics,
    queryKey: matterApiQueryKeys.getKey("getMatterStatistics"),
  });

  const { data: court } = useQuery({
    queryFn: courtCaseApi.getCourtCaseStatistics,
    queryKey: courtCaseApiQueryKeys.getKey("getCourtCaseStatistics"),
  });

  if (!matters || !court) return <Skeleton className="h-80 rounded-2xl" />;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <SectionCard
        title={t("dashboard:deadlines.overdueTitle")}
        extra={
          <Link to={`${ROUTES.matters}?overdueOnly=true`} className="text-sm font-medium text-main-green-700 hover:underline">
            {t("common:viewAll")}
          </Link>
        }
        bodyClassName="p-2"
      >
        {!matters.overdueMatters.length && <EmptyData title={t("dashboard:deadlines.noOverdue")} />}
        <ul>
          {matters.overdueMatters.map((matter) => (
            <li key={matter.id}>
              <Link to={buildMatterDetailRoute(matter.id)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-greyscale-100">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-error-50 text-error-500">
                  <Icon name="alert" className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-greyscale-900">{matter.title}</span>
                  <span className="block truncate text-xs text-greyscale-500">{`${matter.number} · ${matter.lawyer?.fullName ?? t("common:notAssigned")}`}</span>
                </span>
                <MatterDeadline dueDate={matter.dueDate} isOverdue={matter.isOverdue} isPaused={matter.isDeadlinePaused} />
              </Link>
            </li>
          ))}
        </ul>
      </SectionCard>
      <SectionCard
        title={t("dashboard:deadlines.hearingsTitle")}
        extra={
          <Link to={ROUTES.courtCases} className="text-sm font-medium text-main-green-700 hover:underline">
            {t("common:viewAll")}
          </Link>
        }
        bodyClassName="p-2"
      >
        {!court.upcomingHearings.length && <EmptyData title={t("dashboard:deadlines.noHearings")} />}
        <ul>
          {court.upcomingHearings.map((hearing) => (
            <li key={hearing.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                <Icon name="gavel" className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-greyscale-900">{hearing.defendant}</span>
                <span className="block truncate text-xs text-greyscale-500">{`${hearing.caseNumber} · ${hearing.court}`}</span>
              </span>
              <span className="shrink-0 text-xs font-medium text-greyscale-800">{formatDateTime(hearing.date)}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
};
