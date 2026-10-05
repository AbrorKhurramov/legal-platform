import { MatterPriority, MatterType } from "@/entities/matter/matter.entry";

export const MATTER_SLA_DAYS: Record<MatterPriority, number> = {
  [MatterPriority.LOW]: 10,
  [MatterPriority.MEDIUM]: 7,
  [MatterPriority.HIGH]: 5,
  [MatterPriority.CRITICAL]: 2,
};

export const TYPES_WITH_COUNTERPARTY: MatterType[] = [MatterType.CONTRACT_REVIEW, MatterType.CLAIM_PREPARATION];
