import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LANGUAGE, I18N_NAMESPACES } from "@/shared/const/i18n-const";
import { STORAGE_KEYS } from "@/shared/const/storage-const";
import { setDayjsLocale } from "@/shared/lib/dayjs-lib";

const modules = import.meta.glob<{ default: Record<string, unknown> }>("./locales/*/*.json", { eager: true });

const toCamelCase = (value: string) => value.replace(/-(\w)/g, (_, char: string) => char.toUpperCase());

const resources = Object.entries(modules).reduce<Record<string, Record<string, Record<string, unknown>>>>((acc, [path, module]) => {
  const [, language, file] = /\.\/locales\/(\w+)\/([\w-]+)\.json$/.exec(path) ?? [];
  if (!language || !file) return acc;
  acc[language] = { ...acc[language], [toCamelCase(file)]: module.default };
  return acc;
}, {});

void i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    ns: [...I18N_NAMESPACES],
    defaultNS: "common",
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: ["uz", "ru"],
    interpolation: { escapeValue: false },
    detection: { order: ["localStorage"], lookupLocalStorage: STORAGE_KEYS.language, caches: ["localStorage"] },
  });

setDayjsLocale(i18next.language);
i18next.on("languageChanged", (language) => {
  setDayjsLocale(language);
  document.documentElement.lang = language;
});
