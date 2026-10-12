import type { ReactNode } from "react";

import { Navigate, useLocation, useMatches } from "react-router";

import { ChangePasswordPage } from "@/pages/system/change-password/change-password.entry";
import { ForbiddenPage } from "@/pages/system/forbidden/forbidden.entry";

import { ROUTES } from "@/shared/const/route-const";

import { UserRole, hasAccess, useCurrentUser } from "@/entities/user/user.entry";

import type { RouteHandle } from "../../../router/route.types";

interface IRoleGuardProps {
  children: ReactNode;
}

export const RoleGuard = (props: IRoleGuardProps) => {
  const user = useCurrentUser();
  const matches = useMatches();
  const { pathname } = useLocation();
  const guard = [...matches].reverse().find((match) => (match.handle as RouteHandle | undefined)?.guard)?.handle as RouteHandle | undefined;

  if (user?.mustChangePassword) return <ChangePasswordPage />;

  const fileManagerDenied = [...matches].some((match) => (match.handle as RouteHandle | undefined)?.requiresFileManager) && !user?.fileManagerAccess;
  if (fileManagerDenied) return <ForbiddenPage />;

  if (guard?.guard && !hasAccess(user?.role, guard.guard)) {
    // The administrator sees no legal data, so their home is the user list.
    if (pathname === ROUTES.dashboard) return <Navigate to={user?.role === UserRole.ADMIN ? ROUTES.adminUsers : ROUTES.matters} replace />;
    return <ForbiddenPage />;
  }

  return props.children;
};
