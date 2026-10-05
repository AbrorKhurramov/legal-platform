import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { Icon } from "@/shared/ui/icon/icon.entry";
import { daysUntil, formatDate } from "@/shared/utils/format-date";

const SOON_THRESHOLD_DAYS = 2;

interface IMatterDeadlineProps {
  dueDate: string;
  isOverdue: boolean;
  isPaused: boolean;
  isClosed?: boolean;
}

export const MatterDeadline = (props: IMatterDeadlineProps) => {
  const { dueDate, isOverdue, isPaused, isClosed } = props;
  const { t } = useTranslation("common");
  const days = daysUntil(dueDate);

  const getHint = () => {
    if (isClosed) return null;
    if (isPaused) return { icon: "pause" as const, text: t("deadline.paused"), className: "text-warning-600" };
    if (isOverdue) return { icon: "alert" as const, text: t("deadline.overdue", { count: Math.abs(days) }), className: "text-error-500" };
    if (days === 0) return { icon: "clock" as const, text: t("deadline.today"), className: "text-warning-600" };
    return {
      icon: "clock" as const,
      text: t("deadline.left", { count: days }),
      className: days <= SOON_THRESHOLD_DAYS ? "text-warning-600" : "text-greyscale-500",
    };
  };

  const hint = getHint();

  return (
    <span className="flex flex-col">
      <span className={twMerge("text-sm text-greyscale-800", isOverdue && !isPaused && !isClosed && "font-semibold text-error-500")}>
        {formatDate(dueDate)}
      </span>
      {hint && (
        <span className={twMerge("flex items-center gap-1 text-xs", hint.className)}>
          <Icon name={hint.icon} className="size-3" />
          {hint.text}
        </span>
      )}
    </span>
  );
};
