import { useState } from "react";

import { Button } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui/icon/icon.entry";

import { KnowledgeList } from "@/features/knowledge/knowledge-list/knowledge-list.entry";
import { MatterCreateDrawer } from "@/features/matter/matter-create-drawer/matter-create-drawer.entry";

import { MatterType } from "@/entities/matter/matter.entry";

export const KnowledgeBase = () => {
  const { t } = useTranslation("knowledge");
  const [isAskOpen, setIsAskOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-main-green-200 bg-main-green-50 p-5 sm:flex-row sm:items-center">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-main-green-600 text-white">
          <Icon name="message" />
        </span>
        <div className="flex-1">
          <div className="text-h6 text-greyscale-900">{t("ask.title")}</div>
          <p className="text-sm text-greyscale-600">{t("ask.description")}</p>
        </div>
        <Button leftIcon={<Icon name="send" className="size-4" />} onClick={() => setIsAskOpen(true)}>
          {t("ask.button")}
        </Button>
      </div>
      <KnowledgeList />
      {isAskOpen && <MatterCreateDrawer isOpen={isAskOpen} onClose={() => setIsAskOpen(false)} defaultType={MatterType.LEGAL_CONSULTATION} />}
    </div>
  );
};
