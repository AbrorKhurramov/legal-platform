//* Demo rejimida yuklangan fayllar baytlari brauzerning IndexedDB'sida saqlanadi: localStorage bir necha MB'ni ko'tarmaydi.
//* Mavjud bo'lmasa (maxfiy oyna) — sahifa yopilguncha xotirada.

const DB_NAME = "legal-platform-demo-files";
const STORE = "files";

const memory = new Map<string, Blob>();

const open = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const run = async <T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>) => {
  const db = await open();
  return new Promise<T>((resolve, reject) => {
    const request = action(db.transaction(STORE, mode).objectStore(STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  }).finally(() => db.close());
};

export const putDemoFile = async (id: string, body: Blob) => {
  memory.set(id, body);
  try {
    await run("readwrite", (store) => store.put(body, id));
  } catch {
    //* IndexedDB yo'q — xotiradagi nusxa yetadi
  }
};

export const getDemoFile = async (id: string): Promise<Blob | undefined> => {
  if (memory.has(id)) return memory.get(id);
  try {
    return (await run<Blob | undefined>("readonly", (store) => store.get(id))) ?? undefined;
  } catch {
    return undefined;
  }
};

export const clearDemoFiles = async () => {
  memory.clear();
  try {
    await run("readwrite", (store) => store.clear());
  } catch {
    //* tozalanadigan narsa yo'q
  }
};
