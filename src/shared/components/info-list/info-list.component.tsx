import type { ReactNode } from "react";

import { twMerge } from "tailwind-merge";

export interface InfoListItem {
  key: string;
  label: string;
  value: ReactNode;
  isWide?: boolean;
}

interface IInfoListProps {
  items: InfoListItem[];
  className?: string;
}

export const InfoList = (props: IInfoListProps) => {
  const { items, className } = props;

  return (
    <dl className={twMerge("grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2", className)}>
      {items.map((item) => (
        <div key={item.key} className={twMerge("flex min-w-0 flex-col gap-1", item.isWide && "sm:col-span-2")}>
          <dt className="text-xs font-medium tracking-wide text-greyscale-500 uppercase">{item.label}</dt>
          <dd className="text-sm break-words text-greyscale-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
};
