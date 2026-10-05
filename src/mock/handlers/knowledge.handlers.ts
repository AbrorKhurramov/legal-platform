import { getDb } from "../mock-db";
import type { KnowledgeRecord, MockDatabase } from "../mock-db.types";
import { mockRoute } from "../mock-router";
import { toShortUser } from "../mock-rules";
import { fail, matchesSearch, ok, paginate } from "../mock-utils";

const toDTO = (db: MockDatabase, { authorId, ...item }: KnowledgeRecord) => ({ ...item, author: toShortUser(db, authorId) });

export const registerKnowledgeHandlers = () => {
  mockRoute("get", "/knowledge-service/articles", (request) => {
    const db = getDb();
    const { search, category } = request.query;
    const items = [...db.knowledge]
      .sort((a, b) => b.usageCount - a.usageCount)
      .filter((item) => !category || item.category === category)
      .filter((item) => matchesSearch(search, item.question, item.answer, ...item.tags))
      .map((item) => toDTO(db, item));
    return ok(paginate(items, request.query));
  });

  mockRoute("post", "/knowledge-service/articles/:id/use", (request) => {
    const db = getDb();
    const item = db.knowledge.find((record) => record.id === request.params.id);
    if (!item) return fail(request, 404, "notFound");
    item.usageCount += 1;
    return ok(toDTO(db, item));
  });
};
