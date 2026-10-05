export const enum AppLanguage {
  UZ = "uz",
  RU = "ru",
}

export const DEFAULT_LANGUAGE = AppLanguage.UZ;

export const I18N_NAMESPACES = ["common", "login", "dashboard", "matter", "opinion", "court", "legislation", "risk", "knowledge", "audit"] as const;
