import { Tag } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { OpinionRegistryResultColor } from "../common/opinion-status.config";
import type { OpinionRegistryResult } from "../model/opinion.const";

interface IOpinionResultTagProps {
  result: OpinionRegistryResult;
}

export const OpinionResultTag = (props: IOpinionResultTagProps) => {
  const { t } = useTranslation("opinion");

  return (
    <Tag colorType={OpinionRegistryResultColor[props.result]} sizeType="sm" rounded dotted>
      {t(`result.${props.result}`)}
    </Tag>
  );
};
