import type { SelectOptionType } from "local-agro-ui";

import type { BranchDTO } from "./branch.types";

export const mapBranchesToOptions = (branches: BranchDTO[] = []): SelectOptionType<string>[] =>
  branches.map((branch) => ({ label: branch.name, value: branch.id }));
