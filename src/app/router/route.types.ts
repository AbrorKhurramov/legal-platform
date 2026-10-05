import type { UserRole } from "@/entities/user/user.entry";

export interface RouteHandle {
  crumb?: string;
  guard?: readonly UserRole[];
}
