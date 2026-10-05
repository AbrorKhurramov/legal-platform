import i18next from "i18next";
import type { SelectOptionType } from "local-agro-ui";

export const enum KnowledgeCategory {
  CONTRACTS = "CONTRACTS",
  CREDIT = "CREDIT",
  COLLATERAL = "COLLATERAL",
  LABOR = "LABOR",
  CORPORATE = "CORPORATE",
  BANK_SECRECY = "BANK_SECRECY",
  PERSONAL_DATA = "PERSONAL_DATA",
  PROCEDURE = "PROCEDURE",
}

export const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  KnowledgeCategory.CONTRACTS,
  KnowledgeCategory.CREDIT,
  KnowledgeCategory.COLLATERAL,
  KnowledgeCategory.LABOR,
  KnowledgeCategory.CORPORATE,
  KnowledgeCategory.BANK_SECRECY,
  KnowledgeCategory.PERSONAL_DATA,
  KnowledgeCategory.PROCEDURE,
];

export const getKnowledgeCategoryOptions = (): SelectOptionType<KnowledgeCategory>[] =>
  KNOWLEDGE_CATEGORIES.map((value) => ({ label: i18next.t(`category.${value}`, { ns: "knowledge" }), value }));
