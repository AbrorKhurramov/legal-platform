import type { TagColorType } from "local-agro-ui";

import { ImpactLevel, LegislationStatus } from "../model/legislation.const";

export const LegislationStatusColor: Record<LegislationStatus, TagColorType> = {
  [LegislationStatus.NEW]: "Blue",
  [LegislationStatus.ANALYSIS]: "Amber",
  [LegislationStatus.TASKS_ASSIGNED]: "Magenta",
  [LegislationStatus.IMPLEMENTED]: "Green",
};

export const ImpactLevelColor: Record<ImpactLevel, TagColorType> = {
  [ImpactLevel.LOW]: "Gray",
  [ImpactLevel.MEDIUM]: "Orange",
  [ImpactLevel.HIGH]: "Red",
};
