import type { ReactNode } from "react";

import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router";

import { ROUTES } from "@/shared/const/route-const";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

import { setUser, useCurrentUser, userApi, userApiQueryKeys } from "@/entities/user/user.entry";

interface IAuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = (props: IAuthGuardProps) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const user = useCurrentUser();

  const { isError } = useQuery({
    queryFn: async () => {
      const me = await userApi.getMe();
      dispatch(setUser(me));
      return me;
    },
    queryKey: userApiQueryKeys.getKey("getMe", accessToken),
    enabled: !!accessToken && !user,
    retry: false,
  });

  if (!accessToken || isError) return <Navigate to={ROUTES.login} replace />;

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="size-10 animate-spin rounded-full border-4 border-main-green-500 border-t-transparent" />
      </div>
    );
  }

  return props.children;
};
