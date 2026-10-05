import { formatNumber } from "@/shared/utils/format-number";

import type { ColumnSeries } from "./charts.types";

interface IColumnChartProps {
  categories: string[];
  series: ColumnSeries[];
  values: Record<string, number[]>;
}

const HEIGHT = 160;

export const ColumnChart = (props: IColumnChartProps) => {
  const { categories, series, values } = props;
  const max = Math.max(1, ...series.flatMap((item) => values[item.key] ?? []));
  const groupWidth = 100 / Math.max(1, categories.length);
  const barWidth = (groupWidth * 0.7) / series.length;

  return (
    <div className="flex flex-col gap-3">
      <svg viewBox={`0 0 100 ${HEIGHT}`} preserveAspectRatio="none" className="h-44 w-full" aria-hidden>
        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1="0"
            x2="100"
            y1={HEIGHT - HEIGHT * ratio}
            y2={HEIGHT - HEIGHT * ratio}
            className="stroke-greyscale-300"
            strokeWidth={0.3}
          />
        ))}
        {categories.map((category, categoryIndex) =>
          series.map((item, seriesIndex) => {
            const value = values[item.key]?.[categoryIndex] ?? 0;
            const height = (value / max) * (HEIGHT - 8);
            const x = categoryIndex * groupWidth + groupWidth * 0.15 + seriesIndex * barWidth;
            return (
              <rect
                key={`${category}-${item.key}`}
                x={x}
                y={HEIGHT - height}
                width={barWidth * 0.9}
                height={height}
                rx={0.8}
                className={item.colorClass}
              >
                <title>{`${category} · ${item.label}: ${formatNumber(value)}`}</title>
              </rect>
            );
          }),
        )}
      </svg>
      <div className="-mt-1 flex text-center text-xs text-greyscale-600">
        {categories.map((category) => (
          <span key={category} className="flex-1 truncate">
            {category}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 text-xs">
        {series.map((item) => (
          <span key={item.key} className="flex items-center gap-1.5 text-greyscale-700">
            <span className={`size-2.5 rounded-full ${item.legendClass}`} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};
