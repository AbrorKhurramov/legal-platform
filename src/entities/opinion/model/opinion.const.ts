import i18next from "i18next";
import type { SelectOptionType } from "local-agro-ui";

export const enum OpinionRegistryResult {
  POSITIVE = "POSITIVE",
  WITH_REMARKS = "WITH_REMARKS",
  NEGATIVE = "NEGATIVE",
}

export const enum OpinionRegistryStatus {
  ON_APPROVAL = "ON_APPROVAL",
  APPROVED = "APPROVED",
}

export const getOpinionRegistryResultOptions = (): SelectOptionType<OpinionRegistryResult>[] =>
  [OpinionRegistryResult.POSITIVE, OpinionRegistryResult.WITH_REMARKS, OpinionRegistryResult.NEGATIVE].map((result) => ({
    label: i18next.t(`result.${result}`, { ns: "opinion" }),
    value: result,
  }));
