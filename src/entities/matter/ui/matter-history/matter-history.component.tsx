import { useTranslation } from "react-i18next";

import { Timeline } from "@/shared/components/timeline/timeline.entry";
import { formatDateTime } from "@/shared/utils/format-date";

import { MatterHistoryConfig } from "../../common/history.config";
import type { MatterHistoryItemDTO } from "../../model/matter.types";

interface IMatterHistoryProps {
  items: MatterHistoryItemDTO[];
}

export const MatterHistory = (props: IMatterHistoryProps) => {
  const { t } = useTranslation("matter");

  return (
    <Timeline
      items={props.items.map((item) => ({
        id: item.id,
        icon: MatterHistoryConfig[item.type].icon,
        iconClassName: MatterHistoryConfig[item.type].className,
        title: (
          <>
            <span className="font-semibold">{item.user.fullName}</span>
            {` — ${t(`historyType.${item.type}`)}`}
            {item.toStatus && <span className="text-greyscale-600">{` → ${t(`status.${item.toStatus}`)}`}</span>}
          </>
        ),
        meta: formatDateTime(item.createdAt),
        body: item.comment,
      }))}
    />
  );
};
