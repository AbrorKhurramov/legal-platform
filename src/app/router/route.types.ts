import type { UserRole } from "@/entities/user/user.entry";

export interface RouteHandle {
  crumb?: string;
  guard?: readonly UserRole[];
  /** Also needs the administrator-granted file manager access. */
  requiresFileManager?: boolean;
}
