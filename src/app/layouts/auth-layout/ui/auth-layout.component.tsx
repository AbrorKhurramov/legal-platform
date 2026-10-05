import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";

import { LanguageSwitcher } from "@/shared/components/language-switcher/language-switcher.entry";
import { Icon } from "@/shared/ui/icon/icon.entry";

import { GuestGuard } from "../../../guards/auth-guard/auth-guard.entry";

const FEATURES = ["auth.feature1", "auth.feature2", "auth.feature3", "auth.feature4"];

export const AuthLayout = () => {
  const { t } = useTranslation("common");

  return (
    <GuestGuard>
      <div className="grid min-h-full lg:grid-cols-2">
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-main-green-800 to-main-green-950 p-12 text-white lg:flex">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-white/15">
              <Icon name="scale" className="size-6" />
            </span>
            <span>
              <span className="block font-bold">{t("app.name")}</span>
              <span className="block text-sm text-white/70">{t("app.bank")}</span>
            </span>
          </div>
          <div className="max-w-lg">
            <h2 className="text-h2">{t("auth.headline")}</h2>
            <p className="mt-4 text-white/75">{t("auth.description")}</p>
            <ul className="mt-8 flex flex-col gap-3">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-white/90">
                  <span className="flex size-6 items-center justify-center rounded-full bg-white/15">
                    <Icon name="check" className="size-3.5" />
                  </span>
                  {t(feature)}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-white/50">{t("auth.footer")}</p>
        </section>
        <section className="flex flex-col bg-white">
          <div className="flex justify-end p-6">
            <LanguageSwitcher />
          </div>
          <div className="flex flex-1 items-center justify-center px-6 pb-12">
            <div className="w-full max-w-md">
              <Outlet />
            </div>
          </div>
        </section>
      </div>
    </GuestGuard>
  );
};
