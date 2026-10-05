import type { TagColorType } from "local-agro-ui";

import { RiskLevel, RiskStatus } from "../model/risk.const";

export const RiskLevelColor: Record<RiskLevel, TagColorType> = {
  [RiskLevel.LOW]: "GrassGreen",
  [RiskLevel.MEDIUM]: "Amber",
  [RiskLevel.HIGH]: "Orange",
  [RiskLevel.CRITICAL]: "Red",
};

export const RiskLevelChartColor: Record<RiskLevel, string> = {
  [RiskLevel.LOW]: "fill-success-400",
  [RiskLevel.MEDIUM]: "fill-warning-300",
  [RiskLevel.HIGH]: "fill-warning-500",
  [RiskLevel.CRITICAL]: "fill-error-500",
};

export const RiskStatusColor: Record<RiskStatus, TagColorType> = {
  [RiskStatus.IDENTIFIED]: "Blue",
  [RiskStatus.MITIGATING]: "Magenta",
  [RiskStatus.CONTROLLED]: "Turquoise",
  [RiskStatus.CLOSED]: "Gray",
};

export const getRiskMatrixCellClass = (score: number) => {
  if (score >= 16) return "bg-error-400 text-white";
  if (score >= 10) return "bg-warning-400 text-white";
  if (score >= 5) return "bg-warning-100 text-warning-800";
  return "bg-success-100 text-success-800";
};
