import type { UserDTO } from "@/entities/user/user.entry";

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface LoginResponseDTO {
  accessToken: string;
  user: UserDTO;
}

export interface DemoAccountDTO {
  username: string;
  fullName: string;
  position: string;
  role: UserDTO["role"];
  branchName: string;
}
