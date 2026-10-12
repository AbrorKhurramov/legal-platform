import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Button, Input } from "local-agro-ui";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import type { TBaseResponseDTO } from "@/shared/api/api-types";
import { ROUTES } from "@/shared/const/route-const";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { Icon } from "@/shared/ui/icon/icon.entry";

import { type LoginRequestBody, authApi, authApiQueryKeys, setAccessToken } from "@/entities/auth/auth.entry";
import { RoleTag, setUser } from "@/entities/user/user.entry";

/** The browser-side demo exists only with the mock server; a production build without it shows no demo accounts. */
const IS_DEMO_AVAILABLE = import.meta.env.VITE_USE_MOCK === "true";

export const LoginForm = () => {
  const { t } = useTranslation(["login", "common"]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequestBody>({ defaultValues: { username: "", password: "" } });

  const {
    mutate: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: authApi.createLogin,
    mutationKey: authApiQueryKeys.getKey("createLogin"),
    onSuccess: (response) => {
      dispatch(setAccessToken(response.accessToken));
      dispatch(setUser(response.user));
      navigate(ROUTES.dashboard, { replace: true });
    },
  });

  const { data: demoAccounts } = useQuery({
    queryFn: authApi.getDemoAccounts,
    queryKey: authApiQueryKeys.getKey("getDemoAccounts"),
    enabled: IS_DEMO_AVAILABLE,
    staleTime: Infinity,
  });

  const errorMessage =
    error instanceof AxiosError
      ? ((error.response?.data as Partial<TBaseResponseDTO<unknown>> | undefined)?.message ?? t("login:serverUnavailable"))
      : null;

  return (
    <form onSubmit={handleSubmit((values) => login(values))} className="space-y-5">
      <Input
        label={t("login:username")}
        placeholder={t("login:usernamePlaceholder")}
        autoComplete="username"
        leftIcon={<Icon name="user" className="size-4.5 text-greyscale-500" />}
        errorMessage={errors.username && t("common:validation.required")}
        {...register("username", { required: true })}
      />
      <Input
        type="password"
        label={t("login:password")}
        placeholder="••••••"
        autoComplete="current-password"
        leftIcon={<Icon name="lock" className="size-4.5 text-greyscale-500" />}
        errorMessage={errors.password && t("common:validation.required")}
        {...register("password", { required: true })}
      />
      {errorMessage && (
        <p className="flex items-center gap-2 rounded-lg bg-error-50 px-3 py-2 text-sm text-error-600">
          <Icon name="alert" className="size-4" />
          {errorMessage}
        </p>
      )}
      <Button type="submit" className="w-full" sizeType="lg" loading={isPending}>
        {t("login:submit")}
      </Button>
      <p className="text-center text-xs text-greyscale-500">{t("login:hint")}</p>

      {!!demoAccounts?.length && (
        <div className="flex flex-col gap-3 border-t border-greyscale-200 pt-5">
          <div>
            <span className="block text-sm font-semibold text-greyscale-900">{t("login:demoAccounts")}</span>
            <span className="block text-xs text-greyscale-500">{t("login:demoHint", { password: demoAccounts[0].password })}</span>
          </div>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {demoAccounts.map((account) => (
              <li key={account.username}>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => login({ username: account.username, password: account.password })}
                  className="flex w-full flex-col items-start gap-1 rounded-xl border border-greyscale-300 px-3 py-2 text-left transition hover:border-main-green-400 hover:bg-main-green-50 disabled:opacity-60"
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-greyscale-900">{account.fullName}</span>
                    <RoleTag role={account.role} />
                  </span>
                  <span className="truncate text-xs text-greyscale-500">
                    {account.username} · {account.branchName}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};
