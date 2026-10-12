import i18next from "i18next";
import type { SelectOptionType } from "local-agro-ui";

import { USER_ROLES, UserRoleTranslation } from "../common/role.config";
import type { UserRole } from "./user.const";
import type { UserDTO } from "./user.types";

export const mapUsersToOptions = (users: UserDTO[] = []): SelectOptionType<string>[] =>
  users.map((user) => ({ label: user.fullName, value: user.id }));

export const getInitials = (fullName: string) =>
  fullName
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

export const getUserRoleOptions = (): SelectOptionType<UserRole>[] =>
  USER_ROLES.map((role) => ({ label: i18next.t(UserRoleTranslation[role]), value: role }));
