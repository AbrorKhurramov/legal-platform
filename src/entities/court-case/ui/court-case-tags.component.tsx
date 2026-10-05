import { Tag } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { CourtCaseCategoryColor, CourtCaseResultColor, CourtCaseStageColor } from "../common/court-case-status.config";
import type { CourtCaseCategory, CourtCaseResult, CourtCaseStage } from "../model/court-case.const";

interface ICourtCaseResultTagProps {
  result: CourtCaseResult;
}

export const CourtCaseResultTag = (props: ICourtCaseResultTagProps) => {
  const { t } = useTranslation("court");

  return (
    <Tag colorType={CourtCaseResultColor[props.result]} sizeType="sm" rounded dotted>
      {t(`result.${props.result}`)}
    </Tag>
  );
};

interface ICourtCaseStageTagProps {
  stage: CourtCaseStage;
}

export const CourtCaseStageTag = (props: ICourtCaseStageTagProps) => {
  const { t } = useTranslation("court");

  return (
    <Tag colorType={CourtCaseStageColor[props.stage]} sizeType="sm" variantType="Outlined" rounded>
      {t(`stage.${props.stage}`)}
    </Tag>
  );
};

interface ICourtCaseCategoryTagProps {
  category: CourtCaseCategory;
}

export const CourtCaseCategoryTag = (props: ICourtCaseCategoryTagProps) => {
  const { t } = useTranslation("court");

  return (
    <Tag colorType={CourtCaseCategoryColor[props.category]} sizeType="sm" rounded>
      {t(`category.${props.category}`)}
    </Tag>
  );
};
