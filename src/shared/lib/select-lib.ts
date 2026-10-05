import type { SelectOptionType } from "local-agro-ui";

export const findOption = <T>(options: SelectOptionType<T>[], value: T | undefined | null) =>
  options.find((option) => option.value === value) ?? null;
