import { formatNumber } from "@/shared/utils/format-number";

import type { ChartDatum } from "./charts.types";

interface IDonutChartProps {
  data: ChartDatum[];
  centerLabel: string;
}

const SIZE = 120;
const OUTER = 58;
const INNER = 40;
const FULL_CIRCLE = Math.PI * 2;

const polar = (radius: number, angle: number) => [SIZE / 2 + radius * Math.sin(angle), SIZE / 2 - radius * Math.cos(angle)];

const buildArc = (start: number, end: number) => {
  const sweep = Math.min(end - start, FULL_CIRCLE - 0.0001);
  const finish = start + sweep;
  const large = sweep > Math.PI ? 1 : 0;
  const [x1, y1] = polar(OUTER, start);
  const [x2, y2] = polar(OUTER, finish);
  const [x3, y3] = polar(INNER, finish);
  const [x4, y4] = polar(INNER, start);
  return `M${x1} ${y1} A${OUTER} ${OUTER} 0 ${large} 1 ${x2} ${y2} L${x3} ${y3} A${INNER} ${INNER} 0 ${large} 0 ${x4} ${y4} Z`;
};

export const DonutChart = (props: IDonutChartProps) => {
  const { data, centerLabel } = props;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const segments = data
    .filter((item) => item.value > 0)
    .reduce<Array<ChartDatum & { start: number; end: number }>>((acc, item) => {
      const start = acc.length ? acc[acc.length - 1].end : 0;
      return [...acc, { ...item, start, end: start + (item.value / total) * FULL_CIRCLE }];
    }, []);

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="size-36 shrink-0" role="img" aria-label={centerLabel}>
        {total === 0 && <circle cx={SIZE / 2} cy={SIZE / 2} r={(OUTER + INNER) / 2} className="fill-none stroke-greyscale-200" strokeWidth={18} />}
        {segments.map((segment) => (
          <path key={segment.key} d={buildArc(segment.start, segment.end)} className={segment.colorClass}>
            <title>{`${segment.label}: ${formatNumber(segment.value)}`}</title>
          </path>
        ))}
        <text x="50%" y="47%" textAnchor="middle" className="fill-greyscale-900 text-[20px] font-bold">
          {formatNumber(total)}
        </text>
        <text x="50%" y="62%" textAnchor="middle" className="fill-greyscale-500 text-[9px]">
          {centerLabel}
        </text>
      </svg>
      <ul className="flex min-w-40 flex-1 flex-col gap-2">
        {data.map((item) => (
          <li key={item.key} className="flex items-center gap-2 text-sm">
            <svg viewBox="0 0 10 10" className="size-2.5 shrink-0" aria-hidden>
              <circle cx="5" cy="5" r="5" className={item.colorClass} />
            </svg>
            <span className="flex-1 truncate text-greyscale-700">{item.label}</span>
            <span className="font-semibold text-greyscale-900 tabular-nums">{formatNumber(item.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
