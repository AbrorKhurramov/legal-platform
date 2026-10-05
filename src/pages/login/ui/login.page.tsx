import { useTranslation } from "react-i18next";

import { LoginForm } from "@/features/auth/login-form/login-form.entry";

export const LoginPage = () => {
  const { t } = useTranslation("login");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-h3 text-greyscale-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-greyscale-600">{t("subtitle")}</p>
      </div>
      <LoginForm />
    </div>
  );
};
