import i18next from "i18next";
import type { SelectOptionType } from "local-agro-ui";

export const enum RiskCategory {
  CONTRACT = "CONTRACT",
  LITIGATION = "LITIGATION",
  REGULATORY = "REGULATORY",
  CORPORATE = "CORPORATE",
  DATA_PROTECTION = "DATA_PROTECTION",
  OPERATIONAL = "OPERATIONAL",
}

export const enum RiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export const enum RiskStatus {
  IDENTIFIED = "IDENTIFIED",
  MITIGATING = "MITIGATING",
  CONTROLLED = "CONTROLLED",
  CLOSED = "CLOSED",
}

export const RISK_CATEGORIES: RiskCategory[] = [
  RiskCategory.CONTRACT,
  RiskCategory.LITIGATION,
  RiskCategory.REGULATORY,
  RiskCategory.CORPORATE,
  RiskCategory.DATA_PROTECTION,
  RiskCategory.OPERATIONAL,
];

export const RISK_LEVELS: RiskLevel[] = [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL];

export const RISK_STATUSES: RiskStatus[] = [RiskStatus.IDENTIFIED, RiskStatus.MITIGATING, RiskStatus.CONTROLLED, RiskStatus.CLOSED];

export const RISK_SCALE = [1, 2, 3, 4, 5] as const;

export const getRiskCategoryOptions = (): SelectOptionType<RiskCategory>[] =>
  RISK_CATEGORIES.map((value) => ({ label: i18next.t(`category.${value}`, { ns: "risk" }), value }));

export const getRiskLevelOptions = (): SelectOptionType<RiskLevel>[] =>
  RISK_LEVELS.map((value) => ({ label: i18next.t(`level.${value}`, { ns: "risk" }), value }));

export const getRiskStatusOptions = (): SelectOptionType<RiskStatus>[] =>
  RISK_STATUSES.map((value) => ({ label: i18next.t(`status.${value}`, { ns: "risk" }), value }));

export const getRiskScaleOptions = (): SelectOptionType<number>[] => RISK_SCALE.map((value) => ({ label: String(value), value }));
