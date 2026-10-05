import { hasAccess } from "../common/role-access.config";
import { useCurrentUser } from "./use-current-user";
import type { UserRole } from "./user.const";

export const useAccess = (allowed: readonly UserRole[]) => {
  const user = useCurrentUser();
  return hasAccess(user?.role, allowed);
};
