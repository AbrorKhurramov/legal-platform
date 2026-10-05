import type { ReactNode } from "react";

import { Navigate } from "react-router";

import { ROUTES } from "@/shared/const/route-const";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

interface IGuestGuardProps {
  children: ReactNode;
}

export const GuestGuard = (props: IGuestGuardProps) => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  if (accessToken) return <Navigate to={ROUTES.dashboard} replace />;

  return props.children;
};
