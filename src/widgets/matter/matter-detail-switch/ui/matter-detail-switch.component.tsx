import { useQuery } from "@tanstack/react-query";
import { ActivityCondition, EmptyData, TabsSwitcher } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router";

import { ROUTES } from "@/shared/const/route-const";
import { Icon } from "@/shared/ui/icon/icon.entry";

import { MatterActions } from "@/features/matter/matter-actions/matter-actions.entry";

import { MatterDetailSkeleton, MatterHeader, matterApi, matterApiQueryKeys } from "@/entities/matter/matter.entry";

import { MATTER_DETAIL_COMPONENTS, MATTER_DETAIL_TABS, getMatterDetailTabItems } from "../common/matter-detail-switch.const";
import { MatterDetailTab } from "../common/matter-detail-switch.types";

const TAB_QUERY = "tab";

interface IMatterDetailSwitchProps {
  matterId: string;
}

export const MatterDetailSwitch = (props: IMatterDetailSwitchProps) => {
  const { matterId } = props;
  const { t } = useTranslation("matter");
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get(TAB_QUERY) as MatterDetailTab | null;
  const activeTab = tabParam && MATTER_DETAIL_TABS.includes(tabParam) ? tabParam : MatterDetailTab.Overview;

  const { data, isFetching, isError } = useQuery({
    queryFn: () => matterApi.getMatterDetail(matterId),
    queryKey: matterApiQueryKeys.getKey("getMatterDetail", matterId),
    enabled: !!matterId,
  });

  const handleTabChange = (tab: MatterDetailTab) => {
    setSearchParams((prevState) => {
      prevState.set(TAB_QUERY, tab);
      return prevState;
    });
  };

  if (isError && !data) {
    return (
      <EmptyData
        title={t("detail.notAvailable")}
        className="rounded-2xl bg-white py-16"
        extraContent={
          <Link to={ROUTES.matters} className="text-sm font-medium text-main-green-700">
            {t("detail.backToList")}
          </Link>
        }
      />
    );
  }

  const ActiveComponent = MATTER_DETAIL_COMPONENTS[activeTab];

  return (
    <ActivityCondition condition={isFetching && !data} fallback={<MatterDetailSkeleton />}>
      {data && (
        <div className="flex flex-col gap-5">
          <Link to={ROUTES.matters} className="flex w-fit items-center gap-1 text-sm text-greyscale-600 hover:text-main-green-700">
            <Icon name="arrow-left" className="size-4" />
            {t("detail.backToList")}
          </Link>
          <MatterHeader matter={data} actions={<MatterActions matter={data} />} />
          <div className="overflow-x-auto">
            <TabsSwitcher items={getMatterDetailTabItems(data)} activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
          {activeTab === MatterDetailTab.Overview ? (
            <ActiveComponent matter={data} />
          ) : (
            <div className="rounded-2xl border border-greyscale-300 bg-white p-5">
              <ActiveComponent matter={data} />
            </div>
          )}
        </div>
      )}
    </ActivityCondition>
  );
};
