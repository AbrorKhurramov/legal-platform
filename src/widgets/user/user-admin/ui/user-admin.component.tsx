import { useState } from "react";

import { Button } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { PageHeading } from "@/shared/components/page-heading/page-heading.entry";
import { Icon } from "@/shared/ui/icon/icon.entry";

import { UserAdminTable } from "@/features/user/user-admin-table/user-admin-table.entry";
import { UserFormDrawer } from "@/features/user/user-form-drawer/user-form-drawer.entry";
import { UserImportModal } from "@/features/user/user-import-modal/user-import-modal.entry";

import type { AdminUserDTO } from "@/entities/user/user.entry";

export const UserAdmin = () => {
  const { t } = useTranslation("admin");
  const [form, setForm] = useState<{ user: AdminUserDTO | null } | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeading title={t("users.title")} description={t("users.description")} />
        <div className="flex gap-3">
          <Button variantType="Outlined" colorType="Gray" leftIcon={<Icon name="upload" className="size-4" />} onClick={() => setIsImportOpen(true)}>
            {t("import.open")}
          </Button>
          <Button leftIcon={<Icon name="plus" className="size-4" />} onClick={() => setForm({ user: null })}>
            {t("users.create")}
          </Button>
        </div>
      </div>
      <UserAdminTable onEdit={(user) => setForm({ user })} />
      <UserFormDrawer isOpen={!!form} user={form?.user ?? null} onClose={() => setForm(null)} />
      <UserImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
    </div>
  );
};
