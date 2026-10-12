import type { TPageableRequestParams, TReferenceDTO } from "@/shared/api/api-types";

import type { UserRole } from "./user.const";

export interface UserShortDTO {
  id: string;
  fullName: string;
}

export interface UserDTO extends UserShortDTO {
  username: string;
  position: string | null;
  role: UserRole;
  branch: TReferenceDTO;
  fileManagerAccess?: boolean;
  mustChangePassword?: boolean;
}

export interface UsersRequestParams {
  role?: UserRole;
}

export interface AdminUserDTO {
  id: string;
  username: string;
  fullName: string;
  position: string | null;
  role: UserRole;
  branch: TReferenceDTO;
  active: boolean;
  mustChangePassword: boolean;
  fileManagerAccess: boolean;
  lockedUntil: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface AdminUserListRequestParams extends TPageableRequestParams {
  search?: string;
  role?: UserRole;
  branchId?: string;
  active?: boolean;
}

export interface SaveUserRequestBody {
  fullName: string;
  position: string | null;
  role: UserRole;
  branchId: string;
  fileManagerAccess: boolean;
}

export interface CreateUserRequestBody extends SaveUserRequestBody {
  username: string;
}

export interface UpdateUserRequestBody extends SaveUserRequestBody {
  id: string;
}

/** The temporary password comes back exactly once; it is stored only as a hash. */
export interface CreatedUserDTO {
  user: AdminUserDTO;
  temporaryPassword: string;
}

export interface TemporaryPasswordDTO {
  username: string;
  temporaryPassword: string;
}

export interface UserImportDTO {
  createdCount: number;
  rejectedCount: number;
  created: CreatedUserDTO[];
  rejected: { line: number; username: string | null; reason: string }[];
}
