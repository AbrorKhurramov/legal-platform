import { useState } from "react";

import { Button } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui/icon/icon.entry";

import { LegislationCreateDrawer } from "@/features/legislation/legislation-create-drawer/legislation-create-drawer.entry";
import { LegislationDrawer } from "@/features/legislation/legislation-drawer/legislation-drawer.entry";
import { LegislationTable } from "@/features/legislation/legislation-table/legislation-table.entry";

import { RoleBasedGuard, useAccess } from "@/entities/user/user.entry";

export const LegislationRegistry = () => {
  const { t } = useTranslation("legislation");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const canCreate = useAccess(RoleBasedGuard.legislation["action:create"]);

  return (
    <div className="flex flex-col gap-4">
      {canCreate && (
        <div className="flex justify-end">
          <Button leftIcon={<Icon name="plus" className="size-4" />} onClick={() => setIsCreateOpen(true)}>
            {t("create.button")}
          </Button>
        </div>
      )}
      <LegislationTable onOpen={setSelectedId} />
      {selectedId && <LegislationDrawer legislationId={selectedId} isOpen={!!selectedId} onClose={() => setSelectedId(null)} />}
      {isCreateOpen && <LegislationCreateDrawer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreated={setSelectedId} />}
    </div>
  );
};
