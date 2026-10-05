import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Input } from "local-agro-ui";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { ROUTES } from "@/shared/const/route-const";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { Icon } from "@/shared/ui/icon/icon.entry";

import { type LoginRequestBody, authApi, authApiQueryKeys, setAccessToken } from "@/entities/auth/auth.entry";
import { RoleTag, UserAvatar, setUser } from "@/entities/user/user.entry";

const DEMO_PASSWORD = "demo";

export const LoginForm = () => {
  const { t } = useTranslation(["login", "common"]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginRequestBody>({ defaultValues: { username: "", password: "" } });

  const { data: demoAccounts } = useQuery({
    queryFn: authApi.getDemoAccounts,
    queryKey: authApiQueryKeys.getKey("getDemoAccounts"),
  });

  const {
    mutate: login,
    isPending,
    isError,
  } = useMutation({
    mutationFn: authApi.createLogin,
    mutationKey: authApiQueryKeys.getKey("createLogin"),
    onSuccess: (response) => {
      dispatch(setAccessToken(response.accessToken));
      dispatch(setUser(response.user));
      navigate(ROUTES.dashboard, { replace: true });
    },
  });

  const handleDemoLogin = (username: string) => {
    setValue("username", username);
    setValue("password", DEMO_PASSWORD);
    login({ username, password: DEMO_PASSWORD });
  };

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit((values) => login(values))} className="space-y-5">
        <Input
          label={t("login:username")}
          placeholder={t("login:usernamePlaceholder")}
          leftIcon={<Icon name="user" className="size-4.5 text-greyscale-500" />}
          errorMessage={errors.username && t("common:validation.required")}
          {...register("username", { required: true })}
        />
        <Input
          type="password"
          label={t("login:password")}
          placeholder="••••••"
          leftIcon={<Icon name="lock" className="size-4.5 text-greyscale-500" />}
          errorMessage={errors.password && t("common:validation.required")}
          {...register("password", { required: true })}
        />
        {isError && (
          <p className="flex items-center gap-2 rounded-lg bg-error-50 px-3 py-2 text-sm text-error-600">
            <Icon name="alert" className="size-4" />
            {t("login:invalidCredentials")}
          </p>
        )}
        <Button type="submit" className="w-full" sizeType="lg" loading={isPending}>
          {t("login:submit")}
        </Button>
      </form>

      <div>
        <div className="mb-3 flex items-center gap-3 text-xs font-medium tracking-wide text-greyscale-500 uppercase">
          <span className="h-px flex-1 bg-greyscale-300" />
          {t("login:demoAccounts")}
          <span className="h-px flex-1 bg-greyscale-300" />
        </div>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {demoAccounts?.map((account) => (
            <li key={account.username}>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDemoLogin(account.username)}
                className="flex w-full items-center gap-3 rounded-xl border border-greyscale-300 bg-white p-3 text-left transition hover:border-main-green-400 hover:bg-main-green-50"
              >
                <UserAvatar fullName={account.fullName} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-greyscale-900">{account.fullName}</span>
                  <span className="block truncate text-xs text-greyscale-500">{account.branchName}</span>
                  <span className="mt-1 block">
                    <RoleTag role={account.role} />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-center text-xs text-greyscale-500">{t("login:demoHint", { password: DEMO_PASSWORD })}</p>
      </div>
    </div>
  );
};
