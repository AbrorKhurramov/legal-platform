import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { getRiskMatrixCellClass } from "../common/risk-status.config";
import { RISK_SCALE } from "../model/risk.const";
import type { RiskStatisticsDTO } from "../model/risk.types";

interface IRiskMatrixProps {
  matrix: RiskStatisticsDTO["matrix"];
}

export const RiskMatrix = (props: IRiskMatrixProps) => {
  const { matrix } = props;
  const { t } = useTranslation("risk");

  const getCount = (probability: number, impact: number) =>
    matrix.find((cell) => cell.probability === probability && cell.impact === impact)?.count ?? 0;

  return (
    <div className="flex gap-2">
      <div className="flex rotate-180 items-center text-xs text-greyscale-600 [writing-mode:vertical-rl]">{t("fields.probability")}</div>
      <div className="flex flex-1 flex-col gap-1">
        {[...RISK_SCALE].reverse().map((probability) => (
          <div key={probability} className="grid grid-cols-5 gap-1">
            {RISK_SCALE.map((impact) => {
              const count = getCount(probability, impact);
              return (
                <div
                  key={impact}
                  className={twMerge(
                    "flex h-9 items-center justify-center rounded-md text-sm font-semibold",
                    getRiskMatrixCellClass(probability * impact),
                    count === 0 && "opacity-45",
                  )}
                >
                  {count || ""}
                </div>
              );
            })}
          </div>
        ))}
        <div className="mt-1 text-center text-xs text-greyscale-600">{t("fields.impact")}</div>
      </div>
    </div>
  );
};
