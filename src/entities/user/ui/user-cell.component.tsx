import { useTranslation } from "react-i18next";

import type { UserShortDTO } from "../model/user.types";
import { UserAvatar } from "./user-avatar.component";

interface IUserCellProps {
  user: UserShortDTO | null;
}

export const UserCell = (props: IUserCellProps) => {
  const { user } = props;
  const { t } = useTranslation("common");

  if (!user) return <span className="text-sm text-greyscale-500">{t("notAssigned")}</span>;

  return (
    <span className="flex items-center gap-2">
      <UserAvatar fullName={user.fullName} className="size-7 text-[10px]" />
      <span className="truncate text-sm text-greyscale-800">{user.fullName}</span>
    </span>
  );
};
