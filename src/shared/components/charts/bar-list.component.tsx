import { formatNumber } from "@/shared/utils/format-number";

import type { ChartDatum } from "./charts.types";

interface IBarListProps {
  data: ChartDatum[];
  valueFormatter?(value: number): string;
}

export const BarList = (props: IBarListProps) => {
  const { data, valueFormatter = formatNumber } = props;
  const max = Math.max(1, ...data.map((item) => item.value));

  return (
    <ul className="flex flex-col gap-3">
      {data.map((item) => (
        <li key={item.key} className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-greyscale-700">{item.label}</span>
            <span className="font-semibold text-greyscale-900 tabular-nums">{valueFormatter(item.value)}</span>
          </div>
          <svg viewBox="0 0 100 6" preserveAspectRatio="none" className="h-2 w-full" aria-hidden>
            <rect x="0" y="0" width="100" height="6" rx="3" className="fill-greyscale-200" />
            <rect x="0" y="0" width={(item.value / max) * 100} height="6" rx="3" className={item.colorClass} />
          </svg>
        </li>
      ))}
    </ul>
  );
};
