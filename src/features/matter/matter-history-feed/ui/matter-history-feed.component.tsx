import { useQuery } from "@tanstack/react-query";
import { ActivityCondition } from "local-agro-ui";

import { MatterHistory, MatterHistorySkeleton, matterApi, matterApiQueryKeys } from "@/entities/matter/matter.entry";

interface IMatterHistoryFeedProps {
  matterId: string;
}

export const MatterHistoryFeed = (props: IMatterHistoryFeedProps) => {
  const { matterId } = props;

  const { data, isFetching } = useQuery({
    queryFn: () => matterApi.getMatterHistory(matterId),
    queryKey: matterApiQueryKeys.getKey("getMatterHistory", matterId),
  });

  return (
    <ActivityCondition condition={isFetching && !data} fallback={<MatterHistorySkeleton />}>
      <MatterHistory items={data ?? []} />
    </ActivityCondition>
  );
};
