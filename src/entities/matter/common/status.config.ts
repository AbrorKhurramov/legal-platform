import type { TagColorType } from "local-agro-ui";

import type { IconNameTypes } from "@/shared/ui/icon/icon.entry";

import { ApprovalDecision, MatterAction, MatterPriority, MatterStatus, OpinionResult } from "../model/matter.const";

export const MatterStatusColor: Record<MatterStatus, TagColorType> = {
  [MatterStatus.NEW]: "Blue",
  [MatterStatus.ASSIGNED]: "SkyBlue",
  [MatterStatus.IN_REVIEW]: "Turquoise",
  [MatterStatus.INCOMPLETE_DOCS]: "Amber",
  [MatterStatus.ON_APPROVAL]: "Magenta",
  [MatterStatus.COMPLETED]: "Green",
  [MatterStatus.REJECTED]: "Gray",
};

export const MatterStatusChartColor: Record<MatterStatus, string> = {
  [MatterStatus.NEW]: "fill-blue-400",
  [MatterStatus.ASSIGNED]: "fill-neon-blue-400",
  [MatterStatus.IN_REVIEW]: "fill-main-green-400",
  [MatterStatus.INCOMPLETE_DOCS]: "fill-warning-400",
  [MatterStatus.ON_APPROVAL]: "fill-electro-400",
  [MatterStatus.COMPLETED]: "fill-success-600",
  [MatterStatus.REJECTED]: "fill-greyscale-500",
};

export const MatterPriorityColor: Record<MatterPriority, TagColorType> = {
  [MatterPriority.LOW]: "Gray",
  [MatterPriority.MEDIUM]: "SkyBlue",
  [MatterPriority.HIGH]: "Orange",
  [MatterPriority.CRITICAL]: "Red",
};

export const OpinionResultColor: Record<OpinionResult, TagColorType> = {
  [OpinionResult.POSITIVE]: "Green",
  [OpinionResult.WITH_REMARKS]: "Amber",
  [OpinionResult.NEGATIVE]: "Red",
};

export const ApprovalDecisionConfig: Record<ApprovalDecision, { icon: IconNameTypes; className: string }> = {
  [ApprovalDecision.PENDING]: { icon: "clock", className: "bg-greyscale-200 text-greyscale-600" },
  [ApprovalDecision.APPROVED]: { icon: "check", className: "bg-success-100 text-success-700" },
  [ApprovalDecision.RETURNED]: { icon: "undo", className: "bg-warning-100 text-warning-700" },
};

export const MatterActionConfig: Record<
  MatterAction,
  { icon: IconNameTypes; colorType: "MainGreen" | "Blue" | "Error" | "Gray" | "Warning"; variantType: "Filled" | "Outlined" }
> = {
  [MatterAction.ASSIGN]: { icon: "user", colorType: "MainGreen", variantType: "Filled" },
  [MatterAction.START_REVIEW]: { icon: "eye", colorType: "MainGreen", variantType: "Filled" },
  [MatterAction.REQUEST_DOCS]: { icon: "pause", colorType: "Warning", variantType: "Outlined" },
  [MatterAction.PROVIDE_DOCS]: { icon: "upload", colorType: "MainGreen", variantType: "Filled" },
  [MatterAction.SUBMIT_OPINION]: { icon: "send", colorType: "MainGreen", variantType: "Filled" },
  [MatterAction.APPROVE]: { icon: "stamp", colorType: "MainGreen", variantType: "Filled" },
  [MatterAction.RETURN]: { icon: "undo", colorType: "Warning", variantType: "Outlined" },
  [MatterAction.REJECT]: { icon: "x-circle", colorType: "Error", variantType: "Outlined" },
};
