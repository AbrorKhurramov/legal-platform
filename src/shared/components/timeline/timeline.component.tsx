import type { ReactNode } from "react";

import { twMerge } from "tailwind-merge";

import { Icon, type IconNameTypes } from "@/shared/ui/icon/icon.entry";

export interface TimelineEntry {
  id: string;
  icon: IconNameTypes;
  iconClassName: string;
  title: ReactNode;
  meta: string;
  body?: ReactNode;
}

interface ITimelineProps {
  items: TimelineEntry[];
}

export const Timeline = (props: ITimelineProps) => {
  return (
    <ol className="relative flex flex-col gap-5">
      {props.items.map((item, index) => (
        <li key={item.id} className="relative flex gap-3">
          {index < props.items.length - 1 && <span className="absolute top-9 bottom-[-20px] left-4 w-px bg-greyscale-300" aria-hidden />}
          <span className={twMerge("flex size-8 shrink-0 items-center justify-center rounded-full", item.iconClassName)}>
            <Icon name={item.icon} className="size-4" />
          </span>
          <div className="min-w-0 flex-1 pt-1">
            <div className="text-sm text-greyscale-900">{item.title}</div>
            <div className="mt-0.5 text-xs text-greyscale-500">{item.meta}</div>
            {item.body && <div className="mt-2 rounded-lg bg-greyscale-100 px-3 py-2 text-sm text-greyscale-700">{item.body}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
};
