import { getDb } from "../mock-db";
import type { UserRecord } from "../mock-db.types";
import { mockRoute } from "../mock-router";
import { toUserDTO } from "../mock-rules";
import { createMockToken, fail, nowIso, ok } from "../mock-utils";
import { DEMO_PASSWORD } from "../seed/seed-dictionary";

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

const findByUsername = (username: unknown) => {
  const normalized = String(username ?? "")
    .trim()
    .toLowerCase();
  return getDb().users.find((user) => user.username === normalized);
};

const passwordOf = (user: UserRecord) => user.password ?? DEMO_PASSWORD;

/**
 * Only an exact demo username and password pair stays in the browser; anything else goes to the real backend,
 * so a real employee whose login happens to match a demo one is never answered by the mock.
 */
export const isDemoLogin = (body: Record<string, unknown>) => {
  const user = findByUsername(body.username);
  return !!user && body.password === passwordOf(user);
};

const loginResponse = (user: UserRecord) => ({
  accessToken: createMockToken(user.id),
  expiresAt: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
  mustChangePassword: user.mustChangePassword,
  user: toUserDTO(getDb(), user),
});

export const registerDemoAuthHandlers = () => {
  mockRoute(
    "post",
    "/api/v1/auth/login",
    (request) => {
      const user = findByUsername(request.body.username);
      if (!user || request.body.password !== passwordOf(user) || !user.active) return fail(request, 401, "badCredentials");
      user.lastLoginAt = nowIso();
      return ok(loginResponse(user));
    },
    true,
  );

  mockRoute("post", "/api/v1/auth/logout", () => ok(null));

  mockRoute("post", "/api/v1/auth/change-password", (request) => {
    const user = request.user!;
    if (request.body.currentPassword !== passwordOf(user)) return fail(request, 400, "badCredentials");
    user.password = String(request.body.newPassword ?? "");
    user.mustChangePassword = false;
    return ok(loginResponse(user));
  });

  mockRoute("get", "/api/v1/users/me", (request) => ok(toUserDTO(getDb(), request.user!)));

  mockRoute("get", "/api/v1/branches", () => ok(getDb().branches.map(({ id, name, type }) => ({ id, name, type }))));
};
