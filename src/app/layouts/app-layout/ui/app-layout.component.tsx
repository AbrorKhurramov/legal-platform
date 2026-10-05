import { useState } from "react";

import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";

import { LanguageSwitcher } from "@/shared/components/language-switcher/language-switcher.entry";
import { Icon } from "@/shared/ui/icon/icon.entry";

import { UserMenu } from "@/features/auth/user-menu/user-menu.entry";

import { AuthGuard } from "../../../guards/auth-guard/auth-guard.entry";
import { RoleGuard } from "../../../guards/role-guard/role-guard.entry";
import { AppBreadcrumbs } from "./app-breadcrumbs.component";
import { AppSidebar } from "./app-sidebar.component";

//* App Layout
export const AppLayout = () => {
  const { t } = useTranslation("common");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-full">
        <AppSidebar isOpen={isSidebarOpen} onNavigate={() => setIsSidebarOpen(false)} />
        {isSidebarOpen && (
          <button
            type="button"
            aria-label={t("close")}
            className="fixed inset-0 z-[5] bg-black/30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <div className="flex min-h-full flex-col lg:pl-68">
          <header className="sticky top-0 z-[4] flex h-16 items-center gap-3 border-b border-greyscale-300 bg-white/90 px-4 backdrop-blur md:px-8">
            <button
              type="button"
              aria-label={t("header.menu")}
              className="rounded-lg p-2 text-greyscale-700 hover:bg-greyscale-100 lg:hidden"
              onClick={() => setIsSidebarOpen((prevState) => !prevState)}
            >
              <Icon name="menu" />
            </button>
            <div className="min-w-0 flex-1">
              <AppBreadcrumbs />
            </div>
            <LanguageSwitcher />
            <UserMenu />
          </header>
          <main className="flex-1 px-4 py-6 md:px-8">
            <RoleGuard>
              <Outlet />
            </RoleGuard>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};
