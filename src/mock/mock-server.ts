import axios, { type AxiosAdapter, AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

import { UserRole } from "@/entities/user/user.entry";

import { registerAuditHandlers } from "./handlers/audit.handlers";
import { registerAuthHandlers } from "./handlers/auth.handlers";
import { registerCourtHandlers } from "./handlers/court.handlers";
import { registerDemoAdminHandlers } from "./handlers/demo-admin.handlers";
import { isDemoLogin, registerDemoAuthHandlers } from "./handlers/demo-auth.handlers";
import { registerDemoDocumentHandlers } from "./handlers/demo-document.handlers";
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

//* Aralash rejim: shu prefiksdagi so'rovlar haqiqiy backend'ga ketadi — demo akkaunt sessiyasidan tashqari.
//* Demo login-parol bilan kirilsa mock token beriladi va /api/v1/* ham shu yerda, brauzerda javob oladi:
//* backend ishlamaydigan joyda (Vercel) ham butun tizim ko'rsatiladi.
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

const tokenOf = (config: InternalAxiosRequestConfig) => String(config.headers?.Authorization ?? "").replace("Bearer ", "");

const isDemoRequest = (config: InternalAxiosRequestConfig, path: string) =>
  tokenOf(config).startsWith(TOKEN_PREFIX) || (path === `${REAL_BACKEND_PREFIX}auth/login` && isDemoLogin(parseBody(config.data)));

const resolveUser = (config: InternalAxiosRequestConfig) => {
  const token = tokenOf(config);
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

const fileResponse = async (config: InternalAxiosRequestConfig, file: { body: Blob; name: string }): Promise<AxiosResponse> => ({
  data: config.responseType === "arraybuffer" ? await file.body.arrayBuffer() : file.body,
  status: 200,
  statusText: "200",
  headers: {
    "content-type": file.body.type,
    "content-disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,
  },
  config,
});

const mockAdapter: AxiosAdapter = async (config) => {
  const path = (config.url ?? "").split("?")[0];
  if (realAdapter && path.startsWith(REAL_BACKEND_PREFIX) && !isDemoRequest(config, path)) return realAdapter(config);

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
      : await matched.route.handler(request);

  persistDb();
  if (result.file) return fileResponse(config, result.file);

  const status = result.status ?? 200;
  const response: AxiosResponse = {
    data: { success: status < 400, message: result.message ?? "", data: result.data ?? null },
    status,
    statusText: String(status),
    headers: {},
    config,
  };

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
  registerDemoAuthHandlers();
  registerDemoDocumentHandlers();
  registerDemoAdminHandlers();
  realAdapter = axios.getAdapter(instance.defaults.adapter);
  instance.defaults.adapter = mockAdapter;
  isInstalled = true;
};
