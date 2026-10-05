import type { IconNameTypes } from "@/shared/ui/icon/icon.entry";

import { MatterHistoryType } from "../model/matter.const";

export const MatterHistoryConfig: Record<MatterHistoryType, { icon: IconNameTypes; className: string }> = {
  [MatterHistoryType.CREATED]: { icon: "plus", className: "bg-blue-50 text-blue-500" },
  [MatterHistoryType.VIEWED]: { icon: "eye", className: "bg-greyscale-200 text-greyscale-600" },
  [MatterHistoryType.ASSIGNED]: { icon: "user", className: "bg-electro-50 text-electro-500" },
  [MatterHistoryType.STATUS_CHANGED]: { icon: "refresh", className: "bg-neon-blue-50 text-neon-blue-600" },
  [MatterHistoryType.DOCUMENT_UPLOADED]: { icon: "upload", className: "bg-main-green-50 text-main-green-700" },
  [MatterHistoryType.OPINION_SUBMITTED]: { icon: "send", className: "bg-main-green-50 text-main-green-700" },
  [MatterHistoryType.APPROVED]: { icon: "check-circle", className: "bg-success-100 text-success-700" },
  [MatterHistoryType.RETURNED]: { icon: "undo", className: "bg-warning-100 text-warning-700" },
  [MatterHistoryType.REJECTED]: { icon: "x-circle", className: "bg-error-50 text-error-500" },
};
