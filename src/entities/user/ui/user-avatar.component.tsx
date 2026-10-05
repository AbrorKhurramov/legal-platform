import { twMerge } from "tailwind-merge";

import { getInitials } from "../model/user.mapper";

interface IUserAvatarProps {
  fullName: string;
  className?: string;
}

export const UserAvatar = (props: IUserAvatarProps) => {
  const { fullName, className } = props;

  return (
    <span
      className={twMerge(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-main-green-100 text-xs font-bold text-main-green-800",
        className,
      )}
    >
      {getInitials(fullName)}
    </span>
  );
};
