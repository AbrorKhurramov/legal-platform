import { type AdminUserDTO, UserRole } from "@/entities/user/user.entry";

import { getDb } from "../mock-db";
import type { UserRecord } from "../mock-db.types";
import { type MockRequest, type MockResult, mockRoute } from "../mock-router";
import { toBranchRef } from "../mock-rules";
import { fail, matchesSearch, nowIso, ok, paginate } from "../mock-utils";
import { createId } from "../seed/random";

//* Demo sessiya uchun backend'ning /api/v1/admin/users endpointlari. Vaqtinchalik parollar faqat shu brauzerdagi demo bazada.

const USERNAME_PATTERN = /^[A-Za-z0-9._-]{3,50}$/;
const PASSWORD_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
const PASSWORD_LENGTH = 12;
const ROLES = new Set<string>([UserRole.BRANCH, UserRole.HEAD_OFFICE, UserRole.LAWYER, UserRole.HEAD, UserRole.ADMIN]);

const TEXTS = {
  usernameTaken: { uz: "Bunday login allaqachon bor", ru: "Такой логин уже существует" },
  usernameRule: { uz: "Login 3–50 ta lotin harfi, raqam, '.', '_' yoki '-'", ru: "Логин: 3–50 латинских букв, цифр, '.', '_' или '-'" },
  branchMissing: { uz: "Filial topilmadi", ru: "Филиал не найден" },
  roleMissing: { uz: "Rol noto'g'ri", ru: "Неверная роль" },
  selfBlock: { uz: "O'zingizni bloklay olmaysiz", ru: "Нельзя заблокировать самого себя" },
  fileMissing: { uz: "CSV fayl tanlanmagan", ru: "CSV-файл не выбран" },
  columnsMissing: { uz: "Sarlavhada ustunlar yetishmaydi: ", ru: "В заголовке не хватает столбцов: " },
} as const;

type TextKey = keyof typeof TEXTS;

const text = (request: MockRequest, key: TextKey) => TEXTS[key][request.language];

const say = (request: MockRequest, status: number, key: TextKey): MockResult => ({ status, message: text(request, key) });

const temporaryPassword = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(PASSWORD_LENGTH));
  return [...bytes].map((byte) => PASSWORD_ALPHABET[byte % PASSWORD_ALPHABET.length]).join("");
};

const toAdminUser = (user: UserRecord): AdminUserDTO => ({
  id: user.id,
  username: user.username,
  fullName: user.fullName,
  position: user.position || null,
  role: user.role,
  branch: toBranchRef(getDb(), user.branchId),
  active: user.active,
  mustChangePassword: user.mustChangePassword,
  fileManagerAccess: user.fileManagerAccess,
  lockedUntil: null,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
});

const onlyAdmin = (request: MockRequest) => (request.user?.role === UserRole.ADMIN ? null : fail(request, 403, "forbidden"));

interface IProfile {
  fullName: string;
  position: string;
  role: UserRole;
  branchId: string;
  fileManagerAccess: boolean;
}

/** Shared by create, update and the CSV import; returns the message key of the first problem. */
const validateProfile = (profile: IProfile): TextKey | null => {
  if (!ROLES.has(profile.role)) return "roleMissing";
  if (!getDb().branches.some((branch) => branch.id === profile.branchId)) return "branchMissing";
  return null;
};

const createUser = (username: string, profile: IProfile) => {
  const password = temporaryPassword();
  const user: UserRecord = {
    id: createId("u"),
    username,
    fullName: profile.fullName,
    position: profile.position,
    role: profile.role,
    branchId: profile.branchId,
    // The administrator sees no legal documents, so the permission would mean nothing there.
    fileManagerAccess: profile.fileManagerAccess && profile.role !== UserRole.ADMIN,
    active: true,
    mustChangePassword: true,
    password,
    lastLoginAt: null,
    createdAt: nowIso(),
  };
  getDb().users.push(user);
  return { user: toAdminUser(user), temporaryPassword: password };
};

const profileFrom = (body: Record<string, unknown>): IProfile => ({
  fullName: String(body.fullName ?? "").trim(),
  position: String(body.position ?? "").trim(),
  role: body.role as UserRole,
  branchId: String(body.branchId ?? ""),
  fileManagerAccess: body.fileManagerAccess === true,
});

const splitCsvLine = (line: string, delimiter: string) => {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index++) {
    const char = line[index];
    if (char === '"' && quoted && line[index + 1] === '"') {
      current += '"';
      index++;
    } else if (char === '"') quoted = !quoted;
    else if (char === delimiter && !quoted) {
      cells.push(current.trim());
      current = "";
    } else current += char;
  }
  cells.push(current.trim());
  return cells;
};

const REQUIRED_COLUMNS = ["username", "full_name", "role", "branch"];

const importCsv = async (request: MockRequest): Promise<MockResult> => {
  const form = request.config.data instanceof FormData ? request.config.data : null;
  const file = form?.get("file");
  if (!(file instanceof File)) return say(request, 400, "fileMissing");
  const lines = (await file.text()).replace(/^﻿/, "").split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => line.trim());
  if (headerIndex < 0) return say(request, 400, "fileMissing");
  const delimiter = lines[headerIndex].includes(";") ? ";" : ",";
  const header = splitCsvLine(lines[headerIndex], delimiter).map((cell) => cell.toLowerCase());
  const missing = REQUIRED_COLUMNS.filter((column) => !header.includes(column));
  if (missing.length) return { status: 400, message: text(request, "columnsMissing") + missing.join(", ") };

  const column = (cells: string[], name: string) => cells[header.indexOf(name)]?.trim() ?? "";
  const branchesByName = new Map(getDb().branches.map((branch) => [branch.name.trim().toLowerCase(), branch.id]));
  const created: ReturnType<typeof createUser>[] = [];
  const rejected: { line: number; username: string | null; reason: string }[] = [];

  lines.slice(headerIndex + 1).forEach((line, offset) => {
    if (!line.trim()) return;
    const lineNumber = headerIndex + offset + 2;
    const cells = splitCsvLine(line, delimiter);
    const username = column(cells, "username").toLowerCase();
    const reject = (key: TextKey) => rejected.push({ line: lineNumber, username: username || null, reason: text(request, key) });
    if (!USERNAME_PATTERN.test(username)) return reject("usernameRule");
    if (getDb().users.some((user) => user.username === username)) return reject("usernameTaken");
    const profile: IProfile = {
      fullName: column(cells, "full_name"),
      position: column(cells, "position"),
      role: column(cells, "role").toUpperCase() as UserRole,
      branchId: branchesByName.get(column(cells, "branch").toLowerCase()) ?? "",
      fileManagerAccess: false,
    };
    const problem = validateProfile(profile);
    if (problem) return reject(problem);
    created.push(createUser(username, profile));
  });

  return ok({ createdCount: created.length, rejectedCount: rejected.length, created, rejected });
};

export const registerDemoAdminHandlers = () => {
  mockRoute("get", "/api/v1/admin/users", (request) => {
    const denied = onlyAdmin(request);
    if (denied) return denied;
    const { search, role, branchId, active } = request.query;
    const users = getDb()
      .users.filter((user) => matchesSearch(search, user.username, user.fullName))
      .filter((user) => !role || user.role === role)
      .filter((user) => !branchId || user.branchId === branchId)
      .filter((user) => active === undefined || String(user.active) === active)
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
    const page = paginate(users, request.query);
    return ok({ data: page.data.map(toAdminUser), totalCount: page.totalCount });
  });

  mockRoute("post", "/api/v1/admin/users", (request) => {
    const denied = onlyAdmin(request);
    if (denied) return denied;
    const username = String(request.body.username ?? "")
      .trim()
      .toLowerCase();
    if (!USERNAME_PATTERN.test(username)) return say(request, 400, "usernameRule");
    if (getDb().users.some((user) => user.username === username)) return say(request, 409, "usernameTaken");
    const profile = profileFrom(request.body);
    const problem = validateProfile(profile);
    if (problem) return say(request, 400, problem);
    return { status: 201, data: createUser(username, profile) };
  });

  mockRoute("put", "/api/v1/admin/users/:id", (request) => {
    const denied = onlyAdmin(request);
    if (denied) return denied;
    const user = getDb().users.find((item) => item.id === request.params.id);
    if (!user) return fail(request, 404, "notFound");
    const profile = profileFrom(request.body);
    const problem = validateProfile(profile);
    if (problem) return say(request, 400, problem);
    Object.assign(user, profile, { fileManagerAccess: profile.fileManagerAccess && profile.role !== UserRole.ADMIN });
    return ok(toAdminUser(user));
  });

  mockRoute("post", "/api/v1/admin/users/:id/deactivate", (request) => {
    const denied = onlyAdmin(request);
    if (denied) return denied;
    const user = getDb().users.find((item) => item.id === request.params.id);
    if (!user) return fail(request, 404, "notFound");
    if (user.id === request.user!.id) return say(request, 400, "selfBlock");
    user.active = false;
    return ok(toAdminUser(user));
  });

  mockRoute("post", "/api/v1/admin/users/:id/activate", (request) => {
    const denied = onlyAdmin(request);
    if (denied) return denied;
    const user = getDb().users.find((item) => item.id === request.params.id);
    if (!user) return fail(request, 404, "notFound");
    user.active = true;
    return ok(toAdminUser(user));
  });

  mockRoute("post", "/api/v1/admin/users/:id/reset-password", (request) => {
    const denied = onlyAdmin(request);
    if (denied) return denied;
    const user = getDb().users.find((item) => item.id === request.params.id);
    if (!user) return fail(request, 404, "notFound");
    user.password = temporaryPassword();
    user.mustChangePassword = true;
    return ok({ username: user.username, temporaryPassword: user.password });
  });

  mockRoute("post", "/api/v1/admin/users/import", (request) => onlyAdmin(request) ?? importCsv(request));
};
