import i18next from "i18next";
import type { SelectOptionType } from "local-agro-ui";

export const enum AuditAction {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  VIEW = "VIEW",
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  ASSIGN = "ASSIGN",
  UPLOAD = "UPLOAD",
  APPROVE = "APPROVE",
  RETURN = "RETURN",
  REJECT = "REJECT",
}

export const enum AuditEntityType {
  AUTH = "AUTH",
  MATTER = "MATTER",
  COURT_CASE = "COURT_CASE",
  LEGISLATION = "LEGISLATION",
  RISK = "RISK",
  KNOWLEDGE = "KNOWLEDGE",
}

export const AUDIT_ACTIONS: AuditAction[] = [
  AuditAction.LOGIN,
  AuditAction.LOGOUT,
  AuditAction.VIEW,
  AuditAction.CREATE,
  AuditAction.UPDATE,
  AuditAction.ASSIGN,
  AuditAction.UPLOAD,
  AuditAction.APPROVE,
  AuditAction.RETURN,
  AuditAction.REJECT,
];

export const AUDIT_ENTITY_TYPES: AuditEntityType[] = [
  AuditEntityType.AUTH,
  AuditEntityType.MATTER,
  AuditEntityType.COURT_CASE,
  AuditEntityType.LEGISLATION,
  AuditEntityType.RISK,
  AuditEntityType.KNOWLEDGE,
];

export const getAuditActionOptions = (): SelectOptionType<AuditAction>[] =>
  AUDIT_ACTIONS.map((value) => ({ label: i18next.t(`action.${value}`, { ns: "audit" }), value }));

export const getAuditEntityTypeOptions = (): SelectOptionType<AuditEntityType>[] =>
  AUDIT_ENTITY_TYPES.map((value) => ({ label: i18next.t(`entityType.${value}`, { ns: "audit" }), value }));
