import type { TagColorType } from "local-agro-ui";

import { CourtCaseCategory, CourtCaseResult, CourtCaseStage } from "../model/court-case.const";

export const CourtCaseResultColor: Record<CourtCaseResult, TagColorType> = {
  [CourtCaseResult.PENDING]: "SkyBlue",
  [CourtCaseResult.WON]: "Green",
  [CourtCaseResult.PARTIAL]: "Amber",
  [CourtCaseResult.LOST]: "Red",
  [CourtCaseResult.SETTLED]: "Turquoise",
};

export const CourtCaseResultChartColor: Record<CourtCaseResult, string> = {
  [CourtCaseResult.PENDING]: "fill-neon-blue-400",
  [CourtCaseResult.WON]: "fill-success-600",
  [CourtCaseResult.PARTIAL]: "fill-warning-400",
  [CourtCaseResult.LOST]: "fill-error-400",
  [CourtCaseResult.SETTLED]: "fill-electro-300",
};

export const CourtCaseStageColor: Record<CourtCaseStage, TagColorType> = {
  [CourtCaseStage.PRE_TRIAL]: "Gray",
  [CourtCaseStage.FIRST_INSTANCE]: "Blue",
  [CourtCaseStage.APPEAL]: "Magenta",
  [CourtCaseStage.CASSATION]: "Pink",
  [CourtCaseStage.ENFORCEMENT]: "Orange",
  [CourtCaseStage.CLOSED]: "GrassGreen",
};

export const CourtCaseCategoryColor: Record<CourtCaseCategory, TagColorType> = {
  [CourtCaseCategory.BANK_CLAIM]: "Green",
  [CourtCaseCategory.CLAIM_AGAINST_BANK]: "Coral",
  [CourtCaseCategory.ENFORCEMENT]: "Blue",
};
