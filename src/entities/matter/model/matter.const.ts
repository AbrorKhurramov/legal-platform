import i18next from "i18next";
import type { SelectOptionType } from "local-agro-ui";

export const enum MatterStatus {
  NEW = "NEW",
  ASSIGNED = "ASSIGNED",
  IN_REVIEW = "IN_REVIEW",
  INCOMPLETE_DOCS = "INCOMPLETE_DOCS",
  ON_APPROVAL = "ON_APPROVAL",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export const enum MatterType {
  CONTRACT_REVIEW = "CONTRACT_REVIEW",
  INTERNAL_DOC_REVIEW = "INTERNAL_DOC_REVIEW",
  BANK_DECISION_REVIEW = "BANK_DECISION_REVIEW",
  LEGAL_CONSULTATION = "LEGAL_CONSULTATION",
  CLAIM_PREPARATION = "CLAIM_PREPARATION",
  CORPORATE_SUPPORT = "CORPORATE_SUPPORT",
  CITIZEN_APPEAL = "CITIZEN_APPEAL",
  OTHER = "OTHER",
}

export const enum MatterPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export const enum MatterComplexity {
  SIMPLE = "SIMPLE",
  MEDIUM = "MEDIUM",
  COMPLEX = "COMPLEX",
}

export const enum MatterAction {
  ASSIGN = "ASSIGN",
  START_REVIEW = "START_REVIEW",
  REQUEST_DOCS = "REQUEST_DOCS",
  PROVIDE_DOCS = "PROVIDE_DOCS",
  SUBMIT_OPINION = "SUBMIT_OPINION",
  APPROVE = "APPROVE",
  RETURN = "RETURN",
  REJECT = "REJECT",
}

export const enum OpinionResult {
  POSITIVE = "POSITIVE",
  WITH_REMARKS = "WITH_REMARKS",
  NEGATIVE = "NEGATIVE",
}

export const enum ApprovalDecision {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  RETURNED = "RETURNED",
}

export const enum MatterHistoryType {
  CREATED = "CREATED",
  VIEWED = "VIEWED",
  ASSIGNED = "ASSIGNED",
  STATUS_CHANGED = "STATUS_CHANGED",
  DOCUMENT_UPLOADED = "DOCUMENT_UPLOADED",
  OPINION_SUBMITTED = "OPINION_SUBMITTED",
  APPROVED = "APPROVED",
  RETURNED = "RETURNED",
  REJECTED = "REJECTED",
}

export const MATTER_STATUSES: MatterStatus[] = [
  MatterStatus.NEW,
  MatterStatus.ASSIGNED,
  MatterStatus.IN_REVIEW,
  MatterStatus.INCOMPLETE_DOCS,
  MatterStatus.ON_APPROVAL,
  MatterStatus.COMPLETED,
  MatterStatus.REJECTED,
];

export const MATTER_TYPES: MatterType[] = [
  MatterType.CONTRACT_REVIEW,
  MatterType.INTERNAL_DOC_REVIEW,
  MatterType.BANK_DECISION_REVIEW,
  MatterType.LEGAL_CONSULTATION,
  MatterType.CLAIM_PREPARATION,
  MatterType.CORPORATE_SUPPORT,
  MatterType.CITIZEN_APPEAL,
  MatterType.OTHER,
];

export const MATTER_PRIORITIES: MatterPriority[] = [MatterPriority.LOW, MatterPriority.MEDIUM, MatterPriority.HIGH, MatterPriority.CRITICAL];

export const OPINION_RESULTS: OpinionResult[] = [OpinionResult.POSITIVE, OpinionResult.WITH_REMARKS, OpinionResult.NEGATIVE];

export const getMatterStatusOptions = (): SelectOptionType<MatterStatus>[] =>
  MATTER_STATUSES.map((status) => ({ label: i18next.t(`status.${status}`, { ns: "matter" }), value: status }));

export const getMatterTypeOptions = (): SelectOptionType<MatterType>[] =>
  MATTER_TYPES.map((type) => ({ label: i18next.t(`type.${type}`, { ns: "matter" }), value: type }));

export const getMatterPriorityOptions = (): SelectOptionType<MatterPriority>[] =>
  MATTER_PRIORITIES.map((priority) => ({ label: i18next.t(`priority.${priority}`, { ns: "matter" }), value: priority }));

export const getOpinionResultOptions = (): SelectOptionType<OpinionResult>[] =>
  OPINION_RESULTS.map((result) => ({ label: i18next.t(`opinionResult.${result}`, { ns: "matter" }), value: result }));
