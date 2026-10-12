import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input } from "local-agro-ui";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";

import { type ChangePasswordRequestBody, authApi, authApiQueryKeys, setAccessToken } from "@/entities/auth/auth.entry";
import { setUser } from "@/entities/user/user.entry";

const MIN_LENGTH = 10;

interface IChangePasswordFormValues extends ChangePasswordRequestBody {
  confirmPassword: string;
}

export const ChangePasswordForm = () => {
  const { t } = useTranslation(["login", "common"]);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<IChangePasswordFormValues>({ mode: "onChange", defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" } });

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: (values: IChangePasswordFormValues) =>
      authApi.actionChangePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword }),
    mutationKey: authApiQueryKeys.getKey("actionChangePassword"),
    onSuccess: (response) => {
      dispatch(setAccessToken(response.accessToken));
      dispatch(setUser(response.user));
      queryClient.clear();
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => changePassword(values))} className="space-y-5">
      <Input
        type="password"
        label={t("login:changePassword.current")}
        autoComplete="current-password"
        errorMessage={errors.currentPassword && t("common:validation.required")}
        {...register("currentPassword", { required: true })}
      />
      <Input
        type="password"
        label={t("login:changePassword.new")}
        autoComplete="new-password"
        errorMessage={errors.newPassword && t("login:changePassword.policy", { count: MIN_LENGTH })}
        {...register("newPassword", {
          required: true,
          minLength: MIN_LENGTH,
          validate: (value) => /\p{L}/u.test(value) && /\d/.test(value),
        })}
      />
      <Input
        type="password"
        label={t("login:changePassword.confirm")}
        autoComplete="new-password"
        errorMessage={errors.confirmPassword && t("login:changePassword.mismatch")}
        {...register("confirmPassword", { validate: (value) => value === watch("newPassword") })}
      />
      <p className="text-xs text-greyscale-500">{t("login:changePassword.policy", { count: MIN_LENGTH })}</p>
      <Button type="submit" className="w-full" sizeType="lg" loading={isPending} disabled={!isValid}>
        {t("login:changePassword.submit")}
      </Button>
    </form>
  );
};
