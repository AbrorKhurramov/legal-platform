import type { AuditAction, AuditEntityType } from "@/entities/audit/audit.entry";

import { getDb } from "./mock-db";
import type { MockRequest, MockResult } from "./mock-router";
import { createId } from "./seed/random";

const MESSAGES = {
  saved: { uz: "Muvaffaqiyatli saqlandi", ru: "Успешно сохранено" },
  created: { uz: "Yangi yozuv yaratildi", ru: "Запись создана" },
  notFound: { uz: "Ma'lumot topilmadi", ru: "Данные не найдены" },
  forbidden: { uz: "Ushbu ma'lumotni ko'rish uchun vakolatingiz yetarli emas", ru: "Недостаточно прав для просмотра" },
  actionForbidden: { uz: "Bu amalni bajarish uchun vakolatingiz yo'q", ru: "Нет прав на выполнение действия" },
  unauthorized: { uz: "Sessiya muddati tugadi, qayta kiring", ru: "Сессия истекла, войдите снова" },
  badCredentials: { uz: "Login yoki parol noto'g'ri", ru: "Неверный логин или пароль" },
  validation: { uz: "Majburiy maydonlar to'ldirilmagan", ru: "Не заполнены обязательные поля" },
  actionDone: { uz: "Amal bajarildi", ru: "Действие выполнено" },
} as const;

export type MockMessageKey = keyof typeof MESSAGES;

export const message = (request: MockRequest, key: MockMessageKey) => MESSAGES[key][request.language];

export const ok = (data: unknown, text = ""): MockResult => ({ status: 200, data, message: text });

export const fail = (request: MockRequest, status: number, key: MockMessageKey): MockResult => ({ status, message: message(request, key) });

export const paginate = <T>(items: T[], query: MockRequest["query"]) => {
  const page = Math.max(0, Number(query.page ?? 0));
  const size = Math.min(200, Math.max(1, Number(query.size ?? 10)));
  return { data: items.slice(page * size, page * size + size), totalCount: items.length };
};

export const matchesSearch = (search: string | undefined, ...fields: Array<string | null | undefined>) => {
  if (!search) return true;
  const needle = search.trim().toLowerCase();
  return fields.some((field) => field?.toLowerCase().includes(needle));
};

export const writeAudit = (request: MockRequest, action: AuditAction, entityType: AuditEntityType, entityRef: string | null, details: string) => {
  if (!request.user) return;
  getDb().audit.unshift({
    id: createId("au"),
    createdAt: new Date().toISOString(),
    userId: request.user.id,
    action,
    entityType,
    entityRef,
    ip: "10.12.4.21",
    details,
  });
};

export const nowIso = () => new Date().toISOString();

export const TOKEN_PREFIX = "mock-token.";

export const createMockToken = (userId: string) => `${TOKEN_PREFIX}${userId}`;
