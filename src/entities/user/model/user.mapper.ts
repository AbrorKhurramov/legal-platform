import type { SelectOptionType } from "local-agro-ui";

import type { UserDTO } from "./user.types";

export const mapUsersToOptions = (users: UserDTO[] = []): SelectOptionType<string>[] =>
  users.map((user) => ({ label: user.fullName, value: user.id }));

export const getInitials = (fullName: string) =>
  fullName
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
