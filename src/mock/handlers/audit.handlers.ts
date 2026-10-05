import { UserRole } from "@/entities/user/user.entry";

import { getDb } from "../mock-db";
import { mockRoute } from "../mock-router";
import { findUser, toShortUser } from "../mock-rules";
import { fail, matchesSearch, ok, paginate } from "../mock-utils";

export const registerAuditHandlers = () => {
  mockRoute("get", "/audit-service/logs", (request) => {
    if (request.user!.role !== UserRole.HEAD) return fail(request, 403, "forbidden");
    const db = getDb();
    const { search, action, entityType, dateFrom, dateTo } = request.query;
    const items = db.audit
      .filter((item) => !action || item.action === action)
      .filter((item) => !entityType || item.entityType === entityType)
      .filter((item) => !dateFrom || item.createdAt.slice(0, 10) >= dateFrom)
      .filter((item) => !dateTo || item.createdAt.slice(0, 10) <= dateTo)
      .filter((item) => matchesSearch(search, findUser(db, item.userId).fullName, item.entityRef, item.details))
      .map(({ userId, ...item }) => ({ ...item, user: toShortUser(db, userId), role: findUser(db, userId).role }));
    return ok(paginate(items, request.query));
  });
};
