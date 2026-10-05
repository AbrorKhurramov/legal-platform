import { useState } from "react";

import { Button } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui/icon/icon.entry";

import { RiskCreateDrawer } from "@/features/risk/risk-create-drawer/risk-create-drawer.entry";
import { RiskDrawer } from "@/features/risk/risk-drawer/risk-drawer.entry";
import { RiskTable } from "@/features/risk/risk-table/risk-table.entry";

import { RoleBasedGuard, useAccess } from "@/entities/user/user.entry";

export const RiskRegistry = () => {
  const { t } = useTranslation("risk");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const canCreate = useAccess(RoleBasedGuard.risks["action:create"]);

  return (
    <div className="flex flex-col gap-4">
      {canCreate && (
        <div className="flex justify-end">
          <Button leftIcon={<Icon name="plus" className="size-4" />} onClick={() => setIsCreateOpen(true)}>
            {t("create.button")}
          </Button>
        </div>
      )}
      <RiskTable onOpen={setSelectedId} />
      {selectedId && <RiskDrawer riskId={selectedId} isOpen={!!selectedId} onClose={() => setSelectedId(null)} />}
      {isCreateOpen && <RiskCreateDrawer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreated={setSelectedId} />}
    </div>
  );
};
