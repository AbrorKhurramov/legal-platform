import type { TagColorType } from "local-agro-ui";

import { UserRole } from "../model/user.const";

export const UserRoleColor: Record<UserRole, TagColorType> = {
  [UserRole.BRANCH]: "SkyBlue",
  [UserRole.HEAD_OFFICE]: "Turquoise",
  [UserRole.LAWYER]: "GrassGreen",
  [UserRole.HEAD]: "Magenta",
  [UserRole.ADMIN]: "Gray",
};

export const UserRoleTranslation: Record<UserRole, string> = {
  [UserRole.BRANCH]: "common:role.BRANCH",
  [UserRole.HEAD_OFFICE]: "common:role.HEAD_OFFICE",
  [UserRole.LAWYER]: "common:role.LAWYER",
  [UserRole.HEAD]: "common:role.HEAD",
  [UserRole.ADMIN]: "common:role.ADMIN",
};

export const USER_ROLES: UserRole[] = [UserRole.BRANCH, UserRole.HEAD_OFFICE, UserRole.LAWYER, UserRole.HEAD, UserRole.ADMIN];
