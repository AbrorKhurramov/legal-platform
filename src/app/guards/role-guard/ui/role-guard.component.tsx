import type { ReactNode } from "react";

import { Navigate, useLocation, useMatches } from "react-router";

import { ForbiddenPage } from "@/pages/system/forbidden/forbidden.entry";

import { ROUTES } from "@/shared/const/route-const";

import { hasAccess, useCurrentUser } from "@/entities/user/user.entry";

import type { RouteHandle } from "../../../router/route.types";

interface IRoleGuardProps {
  children: ReactNode;
}

export const RoleGuard = (props: IRoleGuardProps) => {
  const user = useCurrentUser();
  const matches = useMatches();
  const { pathname } = useLocation();
  const guard = [...matches].reverse().find((match) => (match.handle as RouteHandle | undefined)?.guard)?.handle as RouteHandle | undefined;

  if (guard?.guard && !hasAccess(user?.role, guard.guard)) {
    if (pathname === ROUTES.dashboard) return <Navigate to={ROUTES.matters} replace />;
    return <ForbiddenPage />;
  }

  return props.children;
};
