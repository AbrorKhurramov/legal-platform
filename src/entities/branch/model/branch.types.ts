import type { BranchType } from "./branch.const";

export interface BranchDTO {
  id: string;
  name: string;
  type: BranchType;
}
