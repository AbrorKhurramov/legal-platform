import { twMerge } from "tailwind-merge";

import { Icon, type IconNameTypes } from "@/shared/ui/icon/icon.entry";

export type StatCardTone = "green" | "blue" | "amber" | "red" | "violet" | "gray";

const TONE_CLASSES: Record<StatCardTone, string> = {
  green: "bg-main-green-50 text-main-green-700",
  blue: "bg-blue-50 text-blue-500",
  amber: "bg-warning-50 text-warning-600",
  red: "bg-error-50 text-error-500",
  violet: "bg-electro-50 text-electro-500",
  gray: "bg-greyscale-200 text-greyscale-700",
};

interface IStatCardProps {
  label: string;
  value: string | number;
  icon: IconNameTypes;
  tone?: StatCardTone;
  hint?: string;
  isActive?: boolean;
  onClick?(): void;
}

export const StatCard = (props: IStatCardProps) => {
  const { label, value, icon, tone = "green", hint, isActive, onClick } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={twMerge(
        "flex items-start gap-4 rounded-2xl border border-greyscale-300 bg-white p-5 text-left transition",
        onClick && "cursor-pointer hover:border-main-green-400 hover:shadow-sm",
        isActive && "border-main-green-500 ring-4 ring-main-green-100",
      )}
    >
      <span className={twMerge("flex size-11 shrink-0 items-center justify-center rounded-xl", TONE_CLASSES[tone])}>
        <Icon name={icon} className="size-5.5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm text-greyscale-600">{label}</span>
        <span className="block text-h3 text-greyscale-900">{value}</span>
        {hint && <span className="mt-0.5 block text-xs text-greyscale-500">{hint}</span>}
      </span>
    </button>
  );
};
