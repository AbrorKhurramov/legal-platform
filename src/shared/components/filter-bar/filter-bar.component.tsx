import type { ReactNode } from "react";

import { Button } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui/icon/icon.entry";

interface IFilterBarProps {
  children: ReactNode;
  actions?: ReactNode;
  hasActiveFilters: boolean;
  onReset(): void;
}

export const FilterBar = (props: IFilterBarProps) => {
  const { children, actions, hasActiveFilters, onReset } = props;
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col gap-3 px-5 pt-5 lg:flex-row lg:items-center">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{children}</div>
      <div className="flex shrink-0 items-center gap-2">
        {hasActiveFilters && (
          <Button variantType="Plain" colorType="Gray" sizeType="md" leftIcon={<Icon name="close" className="size-4" />} onClick={onReset}>
            {t("resetFilters")}
          </Button>
        )}
        {actions}
      </div>
    </div>
  );
};
