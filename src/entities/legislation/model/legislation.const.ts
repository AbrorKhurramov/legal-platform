import i18next from "i18next";
import type { SelectOptionType } from "local-agro-ui";

export const enum LegislationSource {
  LAW = "LAW",
  PRESIDENT_DECREE = "PRESIDENT_DECREE",
  PRESIDENT_RESOLUTION = "PRESIDENT_RESOLUTION",
  CABINET_RESOLUTION = "CABINET_RESOLUTION",
  CENTRAL_BANK = "CENTRAL_BANK",
}

export const enum LegislationStatus {
  NEW = "NEW",
  ANALYSIS = "ANALYSIS",
  TASKS_ASSIGNED = "TASKS_ASSIGNED",
  IMPLEMENTED = "IMPLEMENTED",
}

export const enum ImpactLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export const LEGISLATION_SOURCES: LegislationSource[] = [
  LegislationSource.LAW,
  LegislationSource.PRESIDENT_DECREE,
  LegislationSource.PRESIDENT_RESOLUTION,
  LegislationSource.CABINET_RESOLUTION,
  LegislationSource.CENTRAL_BANK,
];

export const LEGISLATION_STATUSES: LegislationStatus[] = [
  LegislationStatus.NEW,
  LegislationStatus.ANALYSIS,
  LegislationStatus.TASKS_ASSIGNED,
  LegislationStatus.IMPLEMENTED,
];

export const IMPACT_LEVELS: ImpactLevel[] = [ImpactLevel.LOW, ImpactLevel.MEDIUM, ImpactLevel.HIGH];

export const getLegislationSourceOptions = (): SelectOptionType<LegislationSource>[] =>
  LEGISLATION_SOURCES.map((value) => ({ label: i18next.t(`source.${value}`, { ns: "legislation" }), value }));

export const getLegislationStatusOptions = (): SelectOptionType<LegislationStatus>[] =>
  LEGISLATION_STATUSES.map((value) => ({ label: i18next.t(`status.${value}`, { ns: "legislation" }), value }));

export const getImpactLevelOptions = (): SelectOptionType<ImpactLevel>[] =>
  IMPACT_LEVELS.map((value) => ({ label: i18next.t(`impact.${value}`, { ns: "legislation" }), value }));
