import { Tag } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { OpinionRegistryStatusColor } from "../common/opinion-status.config";
import type { OpinionRegistryStatus } from "../model/opinion.const";

interface IOpinionStatusTagProps {
  status: OpinionRegistryStatus;
}

export const OpinionStatusTag = (props: IOpinionStatusTagProps) => {
  const { t } = useTranslation("opinion");

  return (
    <Tag colorType={OpinionRegistryStatusColor[props.status]} sizeType="sm" variantType="Outlined" rounded>
      {t(`status.${props.status}`)}
    </Tag>
  );
};
