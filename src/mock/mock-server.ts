import axios, { type AxiosAdapter, AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

import { UserRole } from "@/entities/user/user.entry";

import { registerAuditHandlers } from "./handlers/audit.handlers";
import { registerAuthHandlers } from "./handlers/auth.handlers";
import { registerCourtHandlers } from "./handlers/court.handlers";
import { registerDictionaryHandlers } from "./handlers/dictionary.handlers";
import { registerKnowledgeHandlers } from "./handlers/knowledge.handlers";
import { registerLegislationHandlers } from "./handlers/legislation.handlers";
import { registerMatterHandlers } from "./handlers/matter.handlers";
import { registerOpinionHandlers } from "./handlers/opinion.handlers";
import { registerRiskHandlers } from "./handlers/risk.handlers";
import { getDb, persistDb } from "./mock-db";
import { type MockRequest, matchRoute } from "./mock-router";
import { TOKEN_PREFIX, fail } from "./mock-utils";

const MIN_DELAY = 200;
const MAX_DELAY = 550;

//* Aralash rejim: shu prefiksdagi so'rovlar haqiqiy backend'ga ketadi
const REAL_BACKEND_PREFIX = "/api/v1/";

//* Haqiqiy JWT egasining roli bo'yicha mock tablar uchun demo foydalanuvchi
const DEMO_USER_BY_ROLE: Partial<Record<UserRole, string>> = {
  [UserRole.HEAD]: "u-head-1",
  [UserRole.LAWYER]: "u-law-1",
  [UserRole.HEAD_OFFICE]: "u-ho-1",
  [UserRole.BRANCH]: "u-br-1",
};

const decodeJwtRole = (token: string): UserRole | null => {
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as { role?: UserRole };
    return json.role ?? null;
  } catch {
    return null;
  }
};

const resolveUser = (config: InternalAxiosRequestConfig) => {
  const header = String(config.headers?.Authorization ?? "");
  const token = header.replace("Bearer ", "");
  const users = getDb().users;
  if (token.startsWith(TOKEN_PREFIX)) return users.find((user) => user.id === token.slice(TOKEN_PREFIX.length)) ?? null;
  const role = decodeJwtRole(token);
  const demoId = role ? DEMO_USER_BY_ROLE[role] : undefined;
  return demoId ? (users.find((user) => user.id === demoId) ?? null) : null;
};

const parseBody = (data: unknown): Record<string, unknown> => {
  if (!data) return {};
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return data as Record<string, unknown>;
};

const toQuery = (params: unknown) =>
  Object.fromEntries(
    Object.entries((params ?? {}) as Record<string, unknown>).map(([key, value]) => [
      key,
      value === undefined || value === null ? undefined : String(value),
    ]),
  );

const wait = () => new Promise((resolve) => setTimeout(resolve, MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY)));

let realAdapter: AxiosAdapter | null = null;

const mockAdapter: AxiosAdapter = async (config) => {
  const path = (config.url ?? "").split("?")[0];
  if (realAdapter && path.startsWith(REAL_BACKEND_PREFIX)) return realAdapter(config);

  await wait();
  const method = (config.method ?? "get").toLowerCase();
  const matched = matchRoute(method, path);
  const request: MockRequest = {
    params: matched?.params ?? {},
    query: toQuery(config.params),
    body: parseBody(config.data),
    user: resolveUser(config),
    language: String(config.headers?.["Accept-Language"] ?? "uz").startsWith("ru") ? "ru" : "uz",
    config,
  };

  const result = !matched
    ? { status: 404, message: `Mock route not found: ${method.toUpperCase()} ${path}` }
    : !matched.route.isPublic && !request.user
      ? fail(request, 401, "unauthorized")
      : matched.route.handler(request);

  const status = result.status ?? 200;
  const response: AxiosResponse = {
    data: { success: status < 400, message: result.message ?? "", data: result.data ?? null },
    status,
    statusText: String(status),
    headers: {},
    config,
  };

  persistDb();
  if (status >= 400) throw new AxiosError(result.message, String(status), config, null, response);
  return response;
};

let isInstalled = false;

export const installMockServer = (instance: AxiosInstance) => {
  if (isInstalled) return;
  registerAuthHandlers();
  registerDictionaryHandlers();
  registerMatterHandlers();
  registerOpinionHandlers();
  registerCourtHandlers();
  registerLegislationHandlers();
  registerRiskHandlers();
  registerKnowledgeHandlers();
  registerAuditHandlers();
  realAdapter = axios.getAdapter(instance.defaults.adapter);
  instance.defaults.adapter = mockAdapter;
  isInstalled = true;
};
