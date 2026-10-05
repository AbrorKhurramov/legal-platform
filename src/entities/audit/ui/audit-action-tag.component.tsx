import { Tag } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { AuditActionColor } from "../common/audit.config";
import type { AuditAction } from "../model/audit.const";

interface IAuditActionTagProps {
  action: AuditAction;
}

export const AuditActionTag = (props: IAuditActionTagProps) => {
  const { t } = useTranslation("audit");

  return (
    <Tag colorType={AuditActionColor[props.action]} sizeType="sm" rounded>
      {t(`action.${props.action}`)}
    </Tag>
  );
};
