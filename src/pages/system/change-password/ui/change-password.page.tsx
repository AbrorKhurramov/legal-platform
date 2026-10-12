import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui/icon/icon.entry";

import { ChangePasswordForm } from "@/features/auth/change-password-form/change-password-form.entry";

export const ChangePasswordPage = () => {
  const { t } = useTranslation("login");

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-2xl border border-greyscale-300 bg-white p-8">
      <div className="flex flex-col gap-2">
        <span className="flex size-11 items-center justify-center rounded-xl bg-warning-50 text-warning-600">
          <Icon name="lock" />
        </span>
        <h1 className="text-h4 text-greyscale-900">{t("changePassword.title")}</h1>
        <p className="text-sm text-greyscale-600">{t("changePassword.description")}</p>
      </div>
      <ChangePasswordForm />
    </div>
  );
};
