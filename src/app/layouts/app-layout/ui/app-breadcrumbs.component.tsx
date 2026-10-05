import { useTranslation } from "react-i18next";
import { Link, useMatches } from "react-router";

import { Icon } from "@/shared/ui/icon/icon.entry";

import type { RouteHandle } from "../../../router/route.types";

export const AppBreadcrumbs = () => {
  const { t } = useTranslation("common");
  const crumbs = useMatches().filter((match) => (match.handle as RouteHandle | undefined)?.crumb);

  return (
    <nav className="flex min-w-0 items-center gap-1.5 text-sm">
      {crumbs.map((match, index) => {
        const label = t((match.handle as RouteHandle).crumb!);
        const isLast = index === crumbs.length - 1;
        return (
          <span key={match.id} className="flex min-w-0 items-center gap-1.5">
            {index > 0 && <Icon name="chevron-right" className="size-4 text-greyscale-400" />}
            {isLast ? (
              <span className="truncate font-medium text-greyscale-900">{label}</span>
            ) : (
              <Link to={match.pathname} className="truncate text-greyscale-500 hover:text-main-green-700">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};
