export const cleanParams = <T extends object>(params: T) =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")) as Partial<T>;
