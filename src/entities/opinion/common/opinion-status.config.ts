import type { TagColorType } from "local-agro-ui";

import { OpinionRegistryResult, OpinionRegistryStatus } from "../model/opinion.const";

export const OpinionRegistryResultColor: Record<OpinionRegistryResult, TagColorType> = {
  [OpinionRegistryResult.POSITIVE]: "Green",
  [OpinionRegistryResult.WITH_REMARKS]: "Amber",
  [OpinionRegistryResult.NEGATIVE]: "Red",
};

export const OpinionRegistryStatusColor: Record<OpinionRegistryStatus, TagColorType> = {
  [OpinionRegistryStatus.ON_APPROVAL]: "Magenta",
  [OpinionRegistryStatus.APPROVED]: "GrassGreen",
};
