import type { UserDTO } from "@/entities/user/user.entry";

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface LoginResponseDTO {
  accessToken: string;
  expiresAt: string;
  mustChangePassword: boolean;
  user: UserDTO;
}

export interface ChangePasswordRequestBody {
  currentPassword: string;
  newPassword: string;
}

export interface DemoAccountDTO {
  username: string;
  fullName: string;
  position: string;
  role: UserDTO["role"];
  branchName: string;
}
