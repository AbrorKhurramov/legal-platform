import i18next from "i18next";
import type { SelectOptionType } from "local-agro-ui";

export const enum CourtCaseCategory {
  BANK_CLAIM = "BANK_CLAIM",
  CLAIM_AGAINST_BANK = "CLAIM_AGAINST_BANK",
  ENFORCEMENT = "ENFORCEMENT",
}

export const enum CourtCaseStage {
  PRE_TRIAL = "PRE_TRIAL",
  FIRST_INSTANCE = "FIRST_INSTANCE",
  APPEAL = "APPEAL",
  CASSATION = "CASSATION",
  ENFORCEMENT = "ENFORCEMENT",
  CLOSED = "CLOSED",
}

export const enum CourtCaseResult {
  PENDING = "PENDING",
  WON = "WON",
  PARTIAL = "PARTIAL",
  LOST = "LOST",
  SETTLED = "SETTLED",
}

export const COURT_CASE_CATEGORIES: CourtCaseCategory[] = [
  CourtCaseCategory.BANK_CLAIM,
  CourtCaseCategory.CLAIM_AGAINST_BANK,
  CourtCaseCategory.ENFORCEMENT,
];

export const COURT_CASE_STAGES: CourtCaseStage[] = [
  CourtCaseStage.PRE_TRIAL,
  CourtCaseStage.FIRST_INSTANCE,
  CourtCaseStage.APPEAL,
  CourtCaseStage.CASSATION,
  CourtCaseStage.ENFORCEMENT,
  CourtCaseStage.CLOSED,
];

export const COURT_CASE_RESULTS: CourtCaseResult[] = [
  CourtCaseResult.PENDING,
  CourtCaseResult.WON,
  CourtCaseResult.PARTIAL,
  CourtCaseResult.LOST,
  CourtCaseResult.SETTLED,
];

export const getCourtCaseCategoryOptions = (): SelectOptionType<CourtCaseCategory>[] =>
  COURT_CASE_CATEGORIES.map((value) => ({ label: i18next.t(`category.${value}`, { ns: "court" }), value }));

export const getCourtCaseStageOptions = (): SelectOptionType<CourtCaseStage>[] =>
  COURT_CASE_STAGES.map((value) => ({ label: i18next.t(`stage.${value}`, { ns: "court" }), value }));

export const getCourtCaseResultOptions = (): SelectOptionType<CourtCaseResult>[] =>
  COURT_CASE_RESULTS.map((value) => ({ label: i18next.t(`result.${value}`, { ns: "court" }), value }));
