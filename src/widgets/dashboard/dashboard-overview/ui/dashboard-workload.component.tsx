import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { SectionCard } from "@/shared/components/section-card/section-card.entry";

import { matterApi, matterApiQueryKeys } from "@/entities/matter/matter.entry";
import { UserAvatar } from "@/entities/user/user.entry";

export const DashboardWorkload = () => {
  const { t } = useTranslation("dashboard");

  const { data } = useQuery({
    queryFn: matterApi.getMatterStatistics,
    queryKey: matterApiQueryKeys.getKey("getMatterStatistics"),
  });

  if (!data) return <Skeleton className="h-96 rounded-2xl" />;

  const maxBranch = Math.max(1, ...data.byBranch.map((item) => item.total));

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <SectionCard title={t("workload.title")} subtitle={t("workload.subtitle")} bodyClassName="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-greyscale-300 text-left text-xs text-greyscale-500 uppercase">
              <th className="px-5 py-3 font-medium">{t("workload.lawyer")}</th>
              <th className="px-3 py-3 text-right font-medium">{t("workload.active")}</th>
              <th className="px-3 py-3 text-right font-medium">{t("workload.overdue")}</th>
              <th className="px-3 py-3 text-right font-medium">{t("workload.completed")}</th>
              <th className="px-5 py-3 text-right font-medium">{t("workload.score")}</th>
            </tr>
          </thead>
          <tbody>
            {data.lawyerWorkload.map((item) => (
              <tr key={item.lawyer.id} className="border-b border-greyscale-200 last:border-b-0">
                <td className="px-5 py-3">
                  <span className="flex items-center gap-2">
                    <UserAvatar fullName={item.lawyer.fullName} className="size-7 text-[10px]" />
                    <span className="text-greyscale-900">{item.lawyer.fullName}</span>
                  </span>
                </td>
                <td className="px-3 py-3 text-right tabular-nums">{item.active}</td>
                <td className={twMerge("px-3 py-3 text-right tabular-nums", item.overdue > 0 && "font-semibold text-error-500")}>{item.overdue}</td>
                <td className="px-3 py-3 text-right tabular-nums">{item.completed}</td>
                <td className="px-5 py-3 text-right font-semibold text-main-green-700 tabular-nums">{item.weightedScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-greyscale-300 px-5 py-3 text-xs text-greyscale-500">{t("workload.scoreHint")}</p>
      </SectionCard>
      <SectionCard title={t("branches.title")} subtitle={t("branches.subtitle")}>
        <ul className="flex flex-col gap-3">
          {data.byBranch.slice(0, 9).map((item) => (
            <li key={item.branch.id} className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-greyscale-800">{item.branch.name}</span>
                <span className="shrink-0 text-xs text-greyscale-600 tabular-nums">
                  {`${item.total} · `}
                  <span className="text-success-700">{item.completed}</span>
                  {item.overdue > 0 && <span className="text-error-500">{` · ${t("branches.overdue", { count: item.overdue })}`}</span>}
                </span>
              </div>
              <svg viewBox="0 0 100 6" preserveAspectRatio="none" className="h-2 w-full overflow-hidden rounded-full" aria-hidden>
                <rect width="100" height="6" className="fill-greyscale-200" />
                <rect width={(item.completed / maxBranch) * 100} height="6" className="fill-main-green-500" />
                <rect x={(item.completed / maxBranch) * 100} width={(item.overdue / maxBranch) * 100} height="6" className="fill-error-400" />
                <rect
                  x={((item.completed + item.overdue) / maxBranch) * 100}
                  width={((item.total - item.completed - item.overdue) / maxBranch) * 100}
                  height="6"
                  className="fill-neon-blue-300"
                />
              </svg>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
};
