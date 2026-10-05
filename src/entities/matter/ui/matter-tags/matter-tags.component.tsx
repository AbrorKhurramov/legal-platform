import { Tag } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui/icon/icon.entry";

import { MatterPriorityColor, MatterStatusColor, OpinionResultColor } from "../../common/status.config";
import type { MatterPriority, MatterStatus, OpinionResult } from "../../model/matter.const";

interface IMatterStatusTagProps {
  status: MatterStatus;
}

export const MatterStatusTag = (props: IMatterStatusTagProps) => {
  const { t } = useTranslation("matter");

  return (
    <Tag colorType={MatterStatusColor[props.status]} sizeType="sm" rounded dotted>
      {t(`status.${props.status}`)}
    </Tag>
  );
};

interface IMatterPriorityTagProps {
  priority: MatterPriority;
}

export const MatterPriorityTag = (props: IMatterPriorityTagProps) => {
  const { t } = useTranslation("matter");

  return (
    <Tag colorType={MatterPriorityColor[props.priority]} sizeType="sm" variantType="Outlined" rounded>
      {t(`priority.${props.priority}`)}
    </Tag>
  );
};

interface IOpinionResultBadgeProps {
  result: OpinionResult;
}

export const OpinionResultBadge = (props: IOpinionResultBadgeProps) => {
  const { t } = useTranslation("matter");

  return (
    <Tag colorType={OpinionResultColor[props.result]} sizeType="sm" rounded>
      {t(`opinionResult.${props.result}`)}
    </Tag>
  );
};

export const ConfidentialBadge = () => {
  const { t } = useTranslation("common");

  return (
    <Tag colorType="Amaranth" sizeType="sm" rounded leftIcon={<Icon name="lock" className="size-3" />}>
      {t("confidential")}
    </Tag>
  );
};
