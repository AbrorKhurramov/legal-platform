export const createRandom = (seed: number) => {
  let state = seed >>> 0;

  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const int = (min: number, max: number) => Math.floor(next() * (max - min + 1)) + min;
  const pick = <T>(items: readonly T[]): T => items[Math.floor(next() * items.length)];
  const chance = (probability: number) => next() < probability;
  const weighted = <T>(items: ReadonlyArray<readonly [T, number]>): T => {
    const total = items.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = next() * total;
    for (const [item, weight] of items) {
      roll -= weight;
      if (roll <= 0) return item;
    }
    return items[items.length - 1][0];
  };

  return { next, int, pick, chance, weighted };
};

export type Random = ReturnType<typeof createRandom>;

const DAY_MS = 86_400_000;

export const daysFromNow = (days: number, hour = 10) => {
  const date = new Date(Date.now() + days * DAY_MS);
  date.setHours(hour, 0, 0, 0);
  if (days <= 0 && date.getTime() > Date.now()) return new Date(Date.now() - ((hour % 5) + 1) * 3_600_000).toISOString();
  return date.toISOString();
};

//* Seed-sana hech qachon "hozir"dan keyin bo'lmasligi kerak
export const notInFuture = (iso: string, offsetMinutes = 5) => {
  const limit = Date.now() - offsetMinutes * 60_000;
  return new Date(iso).getTime() > limit ? new Date(limit).toISOString() : iso;
};

export const addDays = (iso: string, days: number) => new Date(new Date(iso).getTime() + days * DAY_MS).toISOString();

export const diffDays = (fromIso: string, toIso: string) => Math.round((new Date(toIso).getTime() - new Date(fromIso).getTime()) / DAY_MS);

export const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

let idCounter = 0;
export const createId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;
