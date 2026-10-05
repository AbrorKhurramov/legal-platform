import type { ReactNode } from "react";

import { useTranslation } from "react-i18next";

import type { MatterDetailDTO } from "../../model/matter.types";
import { ConfidentialBadge, MatterPriorityTag, MatterStatusTag } from "../matter-tags/matter-tags.component";

interface IMatterHeaderProps {
  matter: MatterDetailDTO;
  actions?: ReactNode;
}

export const MatterHeader = (props: IMatterHeaderProps) => {
  const { matter, actions } = props;
  const { t } = useTranslation("matter");

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-greyscale-300 bg-white p-5 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm text-greyscale-500">{matter.number}</span>
          <MatterStatusTag status={matter.status} />
          <MatterPriorityTag priority={matter.priority} />
          {matter.confidential && <ConfidentialBadge />}
        </div>
        <h2 className="mt-2 text-h4 text-greyscale-900">{matter.title}</h2>
        <p className="mt-1 text-sm text-greyscale-600">{t(`type.${matter.type}`)}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
};
