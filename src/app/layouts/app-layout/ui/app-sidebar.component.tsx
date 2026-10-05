import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import { twMerge } from "tailwind-merge";

import { ROUTES } from "@/shared/const/route-const";
import { Icon } from "@/shared/ui/icon/icon.entry";

import { hasAccess, useCurrentUser } from "@/entities/user/user.entry";

import { NAVIGATION } from "../common/navigation.const";

interface IAppSidebarProps {
  isOpen: boolean;
  onNavigate(): void;
}

export const AppSidebar = (props: IAppSidebarProps) => {
  const { isOpen, onNavigate } = props;
  const { t } = useTranslation("common");
  const user = useCurrentUser();

  return (
    <aside
      className={twMerge(
        "fixed inset-y-0 left-0 z-[6] flex w-68 -translate-x-full flex-col border-r border-greyscale-300 bg-white transition-transform lg:translate-x-0",
        isOpen && "translate-x-0",
      )}
    >
      <div className="flex h-16 items-center gap-3 px-5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-main-green-700 text-white">
          <Icon name="scale" className="size-5" />
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-bold text-greyscale-900">{t("app.name")}</span>
          <span className="block text-xs text-greyscale-500">{t("app.bank")}</span>
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAVIGATION.map((group) => {
          const items = group.items.filter((item) => hasAccess(user?.role, item.guard));
          if (!items.length) return null;
          return (
            <div key={group.key} className="mb-5">
              <div className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-greyscale-500 uppercase">{t(group.label)}</div>
              <ul className="flex flex-col gap-0.5">
                {items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === ROUTES.dashboard}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        twMerge(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-greyscale-700 transition hover:bg-greyscale-100",
                          isActive && "bg-main-green-50 text-main-green-800 hover:bg-main-green-50",
                        )
                      }
                    >
                      <Icon name={item.icon} className="size-4.5" />
                      {t(item.label)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
      <div className="m-3 rounded-xl border border-dashed border-greyscale-300 p-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-greyscale-700">
          <Icon name="lock" className="size-3.5" />
          {t("app.securityTitle")}
        </div>
        <p className="mt-1 text-[11px] leading-4 text-greyscale-500">{t("app.securityNote")}</p>
      </div>
    </aside>
  );
};
