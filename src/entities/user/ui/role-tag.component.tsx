import { Tag } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { UserRoleColor, UserRoleTranslation } from "../common/role.config";
import type { UserRole } from "../model/user.const";

interface IRoleTagProps {
  role: UserRole;
}

export const RoleTag = (props: IRoleTagProps) => {
  const { t } = useTranslation("common");

  return (
    <Tag colorType={UserRoleColor[props.role]} sizeType="sm" rounded>
      {t(UserRoleTranslation[props.role])}
    </Tag>
  );
};
