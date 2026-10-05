import { Tag } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { ImpactLevelColor, LegislationStatusColor } from "../common/legislation-status.config";
import type { ImpactLevel, LegislationStatus } from "../model/legislation.const";

interface ILegislationStatusTagProps {
  status: LegislationStatus;
}

export const LegislationStatusTag = (props: ILegislationStatusTagProps) => {
  const { t } = useTranslation("legislation");

  return (
    <Tag colorType={LegislationStatusColor[props.status]} sizeType="sm" rounded dotted>
      {t(`status.${props.status}`)}
    </Tag>
  );
};

interface IImpactLevelTagProps {
  level: ImpactLevel;
}

export const ImpactLevelTag = (props: IImpactLevelTagProps) => {
  const { t } = useTranslation("legislation");

  return (
    <Tag colorType={ImpactLevelColor[props.level]} sizeType="sm" variantType="Outlined" rounded>
      {t(`impact.${props.level}`)}
    </Tag>
  );
};
