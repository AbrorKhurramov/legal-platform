import type { TReferenceDTO } from "@/shared/api/api-types";

import type { UserRole } from "./user.const";

export interface UserShortDTO {
  id: string;
  fullName: string;
}

export interface UserDTO extends UserShortDTO {
  username: string;
  position: string;
  role: UserRole;
  branch: TReferenceDTO;
}

export interface UsersRequestParams {
  role?: UserRole;
}
