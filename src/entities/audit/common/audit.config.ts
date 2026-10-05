import type { TagColorType } from "local-agro-ui";

import { AuditAction } from "../model/audit.const";

export const AuditActionColor: Record<AuditAction, TagColorType> = {
  [AuditAction.LOGIN]: "Gray",
  [AuditAction.LOGOUT]: "Gray",
  [AuditAction.VIEW]: "SkyBlue",
  [AuditAction.CREATE]: "Blue",
  [AuditAction.UPDATE]: "Turquoise",
  [AuditAction.ASSIGN]: "Magenta",
  [AuditAction.UPLOAD]: "Neon",
  [AuditAction.APPROVE]: "Green",
  [AuditAction.RETURN]: "Amber",
  [AuditAction.REJECT]: "Red",
};
