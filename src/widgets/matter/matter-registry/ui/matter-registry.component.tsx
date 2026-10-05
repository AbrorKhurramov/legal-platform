import { useState } from "react";

import { Button } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui/icon/icon.entry";

import { MatterCreateDrawer } from "@/features/matter/matter-create-drawer/matter-create-drawer.entry";
import { MatterTable } from "@/features/matter/matter-table/matter-table.entry";

import { RoleBasedGuard, useAccess } from "@/entities/user/user.entry";

export const MatterRegistry = () => {
  const { t } = useTranslation("matter");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const canCreate = useAccess(RoleBasedGuard.matters["action:create"]);

  return (
    <div className="flex flex-col gap-4">
      {canCreate && (
        <div className="flex justify-end">
          <Button leftIcon={<Icon name="plus" className="size-4" />} onClick={() => setIsCreateOpen(true)}>
            {t("create.button")}
          </Button>
        </div>
      )}
      <MatterTable />
      {isCreateOpen && <MatterCreateDrawer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />}
    </div>
  );
};
