import { AuditAction, AuditEntityType } from "@/entities/audit/audit.entry";

import { getDb, resetDb } from "../mock-db";
import { mockRoute } from "../mock-router";
import { toBranchRef, toUserDTO } from "../mock-rules";
import { createMockToken, fail, ok, writeAudit } from "../mock-utils";
import { DEMO_PASSWORD, DEMO_USERNAMES } from "../seed/seed-dictionary";

export const registerAuthHandlers = () => {
  mockRoute(
    "post",
    "/auth-service/login",
    (request) => {
      const db = getDb();
      const username = String(request.body.username ?? "")
        .trim()
        .toLowerCase();
      const user = db.users.find((item) => item.username === username);
      if (!user || request.body.password !== DEMO_PASSWORD) return fail(request, 400, "badCredentials");
      writeAudit({ ...request, user }, AuditAction.LOGIN, AuditEntityType.AUTH, null, "Tizimga kirdi");
      return ok({ accessToken: createMockToken(user.id), user: toUserDTO(db, user) });
    },
    true,
  );

  mockRoute("post", "/auth-service/logout", (request) => {
    writeAudit(request, AuditAction.LOGOUT, AuditEntityType.AUTH, null, "Tizimdan chiqdi");
    return ok(null);
  });

  mockRoute(
    "get",
    "/auth-service/demo-accounts",
    () => {
      const db = getDb();
      const demo = db.users.filter((user) => DEMO_USERNAMES.includes(user.username));
      return ok(
        demo.map((user) => ({
          username: user.username,
          fullName: user.fullName,
          position: user.position,
          role: user.role,
          branchName: toBranchRef(db, user.branchId).name,
        })),
      );
    },
    true,
  );

  mockRoute(
    "post",
    "/auth-service/demo-reset",
    () => {
      resetDb();
      return ok(null);
    },
    true,
  );
};
