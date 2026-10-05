import { getDb } from "../mock-db";
import { mockRoute } from "../mock-router";
import { toUserDTO } from "../mock-rules";
import { ok } from "../mock-utils";

export const registerDictionaryHandlers = () => {
  mockRoute("get", "/user-service/users/me", (request) => ok(toUserDTO(getDb(), request.user!)));

  mockRoute("get", "/user-service/users", (request) => {
    const db = getDb();
    const users = db.users.filter((user) => !request.query.role || user.role === request.query.role);
    return ok(users.map((user) => toUserDTO(db, user)));
  });

  mockRoute("get", "/branch-service/branches", () => ok(getDb().branches));
};
