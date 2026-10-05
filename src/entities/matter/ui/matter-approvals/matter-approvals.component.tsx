import { EmptyData } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { Icon } from "@/shared/ui/icon/icon.entry";
import { formatDateTime } from "@/shared/utils/format-date";

import { ApprovalDecisionConfig } from "../../common/status.config";
import type { MatterApprovalDTO } from "../../model/matter.types";

interface IMatterApprovalsProps {
  approvals: MatterApprovalDTO[];
}

export const MatterApprovals = (props: IMatterApprovalsProps) => {
  const { approvals } = props;
  const { t } = useTranslation("matter");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 rounded-xl border border-neon-blue-200 bg-neon-blue-50 p-4 text-sm text-neon-blue-800">
        <Icon name="info" className="mt-0.5" />
        <span>{t("approvals.signatureNotice")}</span>
      </div>
      {!approvals.length && <EmptyData title={t("approvals.empty")} />}
      <ol className="flex flex-col gap-3">
        {approvals.map((approval, index) => {
          const config = ApprovalDecisionConfig[approval.decision];
          return (
            <li key={approval.id} className="flex items-start gap-4 rounded-xl border border-greyscale-300 p-4">
              <span className="w-5 pt-2 text-sm font-semibold text-greyscale-500">{index + 1}</span>
              <span className={twMerge("flex size-9 shrink-0 items-center justify-center rounded-full", config.className)}>
                <Icon name={config.icon} className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-greyscale-900">{approval.approver.fullName}</div>
                <div className="text-xs text-greyscale-500">{approval.position}</div>
                {approval.comment && <p className="mt-2 rounded-lg bg-greyscale-100 px-3 py-2 text-sm text-greyscale-700">{approval.comment}</p>}
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-greyscale-800">{t(`approvalDecision.${approval.decision}`)}</div>
                <div className="text-xs text-greyscale-500">{formatDateTime(approval.decidedAt)}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
