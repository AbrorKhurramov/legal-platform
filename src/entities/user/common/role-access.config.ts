import { UserRole } from "../model/user.const";

const ALL_ROLES: UserRole[] = [UserRole.BRANCH, UserRole.HEAD_OFFICE, UserRole.LAWYER, UserRole.HEAD];
const LEGAL_TEAM: UserRole[] = [UserRole.LAWYER, UserRole.HEAD];

export const RoleBasedGuard = {
  dashboard: { "display:route": LEGAL_TEAM },
  matters: { "display:route": ALL_ROLES, "action:create": ALL_ROLES },
  opinions: { "display:route": [UserRole.HEAD_OFFICE, ...LEGAL_TEAM] },
  courtCases: { "display:route": LEGAL_TEAM, "action:create": LEGAL_TEAM },
  legislation: { "display:route": [UserRole.HEAD_OFFICE, ...LEGAL_TEAM], "action:create": LEGAL_TEAM },
  risks: { "display:route": LEGAL_TEAM, "action:create": LEGAL_TEAM },
  knowledge: { "display:route": ALL_ROLES },
  audit: { "display:route": [UserRole.HEAD] },
} as const satisfies Record<string, Record<string, readonly UserRole[]>>;

export const hasAccess = (role: UserRole | undefined, allowed: readonly UserRole[]) => !!role && allowed.includes(role);
