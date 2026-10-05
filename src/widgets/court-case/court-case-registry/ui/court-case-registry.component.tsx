import { useState } from "react";

import { Button } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui/icon/icon.entry";

import { CourtCaseCreateDrawer } from "@/features/court-case/court-case-create-drawer/court-case-create-drawer.entry";
import { CourtCaseDrawer } from "@/features/court-case/court-case-drawer/court-case-drawer.entry";
import { CourtCaseTable } from "@/features/court-case/court-case-table/court-case-table.entry";

import { RoleBasedGuard, useAccess } from "@/entities/user/user.entry";

export const CourtCaseRegistry = () => {
  const { t } = useTranslation("court");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const canCreate = useAccess(RoleBasedGuard.courtCases["action:create"]);

  return (
    <div className="flex flex-col gap-4">
      {canCreate && (
        <div className="flex justify-end">
          <Button leftIcon={<Icon name="plus" className="size-4" />} onClick={() => setIsCreateOpen(true)}>
            {t("create.button")}
          </Button>
        </div>
      )}
      <CourtCaseTable onOpen={setSelectedId} />
      {selectedId && <CourtCaseDrawer courtCaseId={selectedId} isOpen={!!selectedId} onClose={() => setSelectedId(null)} />}
      {isCreateOpen && <CourtCaseCreateDrawer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreated={setSelectedId} />}
    </div>
  );
};
