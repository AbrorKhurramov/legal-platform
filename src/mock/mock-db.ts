import type { MockDatabase } from "./mock-db.types";
import { MOCK_DB_VERSION, createSeedDatabase } from "./seed/seed-db";

const STORAGE_KEY = "legal-platform:mock-db";

const load = (): MockDatabase => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MockDatabase;
      if (parsed.version === MOCK_DB_VERSION) return parsed;
    }
  } catch {
    //* повреждённые данные — пересоздаём
  }
  return createSeedDatabase();
};

let database = load();

export const getDb = () => database;

export const persistDb = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
  } catch {
    //* localStorage недоступен — работаем в памяти
  }
};

export const resetDb = () => {
  database = createSeedDatabase();
  persistDb();
};
