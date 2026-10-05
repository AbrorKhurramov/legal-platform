import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { AppLanguage } from "@/shared/const/i18n-const";

const LANGUAGES: Array<{ code: AppLanguage; label: string }> = [
  { code: AppLanguage.UZ, label: "UZ" },
  { code: AppLanguage.RU, label: "RU" },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex rounded-lg bg-greyscale-200 p-0.5">
      {LANGUAGES.map((language) => (
        <button
          key={language.code}
          type="button"
          onClick={() => i18n.changeLanguage(language.code)}
          className={twMerge(
            "rounded-md px-2.5 py-1 text-xs font-semibold text-greyscale-600 transition",
            i18n.resolvedLanguage === language.code && "bg-white text-greyscale-900 shadow-sm",
          )}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
};
