import { ROUTES } from "@/shared/const/route-const";
import type { IconNameTypes } from "@/shared/ui/icon/icon.entry";

import { RoleBasedGuard, type UserRole } from "@/entities/user/user.entry";

export interface NavigationItem {
  path: string;
  icon: IconNameTypes;
  label: string;
  guard: readonly UserRole[];
}

export interface NavigationGroup {
  key: string;
  label: string;
  items: NavigationItem[];
}

export const NAVIGATION: NavigationGroup[] = [
  {
    key: "main",
    label: "nav.groups.main",
    items: [
      { path: ROUTES.dashboard, icon: "dashboard", label: "nav.dashboard", guard: RoleBasedGuard.dashboard["display:route"] },
      { path: ROUTES.matters, icon: "briefcase", label: "nav.matters", guard: RoleBasedGuard.matters["display:route"] },
      { path: ROUTES.opinions, icon: "file-text", label: "nav.opinions", guard: RoleBasedGuard.opinions["display:route"] },
    ],
  },
  {
    key: "modules",
    label: "nav.groups.modules",
    items: [
      { path: ROUTES.courtCases, icon: "gavel", label: "nav.courtCases", guard: RoleBasedGuard.courtCases["display:route"] },
      { path: ROUTES.legislation, icon: "book", label: "nav.legislation", guard: RoleBasedGuard.legislation["display:route"] },
      { path: ROUTES.risks, icon: "shield-alert", label: "nav.risks", guard: RoleBasedGuard.risks["display:route"] },
      { path: ROUTES.knowledge, icon: "lightbulb", label: "nav.knowledge", guard: RoleBasedGuard.knowledge["display:route"] },
    ],
  },
  {
    key: "control",
    label: "nav.groups.control",
    items: [{ path: ROUTES.audit, icon: "history", label: "nav.audit", guard: RoleBasedGuard.audit["display:route"] }],
  },
];
