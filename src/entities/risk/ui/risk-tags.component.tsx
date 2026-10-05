import { Tag } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { RiskLevelColor, RiskStatusColor } from "../common/risk-status.config";
import type { RiskLevel, RiskStatus } from "../model/risk.const";

interface IRiskLevelTagProps {
  level: RiskLevel;
}

export const RiskLevelTag = (props: IRiskLevelTagProps) => {
  const { t } = useTranslation("risk");

  return (
    <Tag colorType={RiskLevelColor[props.level]} sizeType="sm" rounded>
      {t(`level.${props.level}`)}
    </Tag>
  );
};

interface IRiskStatusTagProps {
  status: RiskStatus;
}

export const RiskStatusTag = (props: IRiskStatusTagProps) => {
  const { t } = useTranslation("risk");

  return (
    <Tag colorType={RiskStatusColor[props.status]} sizeType="sm" variantType="Outlined" rounded dotted>
      {t(`status.${props.status}`)}
    </Tag>
  );
};
