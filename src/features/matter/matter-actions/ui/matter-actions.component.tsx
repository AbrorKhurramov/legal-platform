import { useRef, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Select, TextArea } from "local-agro-ui";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { findOption } from "@/shared/lib/select-lib";
import { type BaseModalHandlers, ConfirmModal } from "@/shared/ui/confirm-modal/confirm-modal.entry";
import { Icon } from "@/shared/ui/icon/icon.entry";

import {
  MatterAction,
  MatterActionConfig,
  type MatterDetailDTO,
  type OpinionResult,
  getOpinionResultOptions,
  matterApi,
  matterApiQueryKeys,
} from "@/entities/matter/matter.entry";
import { opinionApiQueryKeys } from "@/entities/opinion/opinion.entry";
import { UserRole, mapUsersToOptions, userApi, userApiQueryKeys } from "@/entities/user/user.entry";

import { ACTIONS_WITH_REQUIRED_COMMENT, AI_DRAFT_TEMPLATE, DESTRUCTIVE_ACTIONS } from "../common/matter-actions.const";

interface IMatterActionFormValues {
  comment: string;
  lawyerId: string | null;
  opinionResult: OpinionResult | null;
  opinionText: string;
  fileName: string;
}

const EMPTY_FORM: IMatterActionFormValues = { comment: "", lawyerId: null, opinionResult: null, opinionText: "", fileName: "" };

interface IMatterActionsProps {
  matter: MatterDetailDTO;
}

export const MatterActions = (props: IMatterActionsProps) => {
  const { matter } = props;
  const { t } = useTranslation(["matter", "common"]);
  const queryClient = useQueryClient();
  const [pendingAction, setPendingAction] = useState<MatterAction | null>(null);
  const [isAiDraft, setIsAiDraft] = useState(false);
  const modalRef = useRef<BaseModalHandlers>(null);

  const { control, register, handleSubmit, reset, setValue, watch } = useForm<IMatterActionFormValues>({ defaultValues: EMPTY_FORM });
  const values = watch();
  const opinionOptions = getOpinionResultOptions();

  const { data: lawyers } = useQuery({
    queryFn: () => userApi.getUsers({ role: UserRole.LAWYER }),
    queryKey: userApiQueryKeys.getKey("getUsers", { role: UserRole.LAWYER }),
    enabled: pendingAction === MatterAction.ASSIGN,
  });
  const lawyerOptions = mapUsersToOptions(lawyers);

  const { mutate: sendAction, isPending } = useMutation({
    mutationFn: (body: IMatterActionFormValues & { action: MatterAction }) =>
      matterApi.actionMatter(matter.id, {
        action: body.action,
        comment: body.comment.trim() || undefined,
        lawyerId: body.lawyerId ?? undefined,
        opinionResult: body.opinionResult ?? undefined,
        opinionText: body.opinionText.trim() || undefined,
        fileName: body.fileName || undefined,
      }),
    mutationKey: matterApiQueryKeys.getKey("actionMatter"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matterApiQueryKeys.getRootKey() });
      queryClient.invalidateQueries({ queryKey: opinionApiQueryKeys.getRootKey() });
      modalRef.current?.closeModal();
      setPendingAction(null);
    },
  });

  const openAction = (action: MatterAction) => {
    reset({ ...EMPTY_FORM, lawyerId: matter.lawyer?.id ?? null });
    setIsAiDraft(false);
    setPendingAction(action);
    modalRef.current?.openModal();
  };

  const fillAiDraft = () => {
    setValue("opinionText", AI_DRAFT_TEMPLATE(matter.title));
    setIsAiDraft(true);
  };

  const isSubmitDisabled = (() => {
    if (!pendingAction) return true;
    if (ACTIONS_WITH_REQUIRED_COMMENT.includes(pendingAction) && values.comment.trim().length < 3) return true;
    if (pendingAction === MatterAction.ASSIGN) return !values.lawyerId;
    if (pendingAction === MatterAction.SUBMIT_OPINION) return !values.opinionResult || values.opinionText.trim().length < 20;
    if (pendingAction === MatterAction.PROVIDE_DOCS) return !values.fileName;
    return false;
  })();

  if (!matter.availableActions.length) return null;

  return (
    <>
      {matter.availableActions.map((action) => (
        <Button
          key={action}
          sizeType="md"
          colorType={MatterActionConfig[action].colorType}
          variantType={MatterActionConfig[action].variantType}
          leftIcon={<Icon name={MatterActionConfig[action].icon} className="size-4" />}
          onClick={() => openAction(action)}
        >
          {t(`matter:action.${action}`)}
        </Button>
      ))}

      <ConfirmModal
        ref={modalRef}
        title={pendingAction ? t(`matter:action.${pendingAction}`) : ""}
        submitLabel={pendingAction ? t(`matter:actionSubmit.${pendingAction}`) : undefined}
        submitColor={pendingAction && DESTRUCTIVE_ACTIONS.includes(pendingAction) ? "Error" : "MainGreen"}
        isLoading={isPending}
        isSubmitDisabled={isSubmitDisabled}
        onClose={() => setPendingAction(null)}
        onSubmit={handleSubmit((formValues) => pendingAction && sendAction({ ...formValues, action: pendingAction }))}
      >
        {pendingAction && <p className="text-sm text-greyscale-600">{t(`matter:actionHint.${pendingAction}`)}</p>}

        {pendingAction === MatterAction.ASSIGN && (
          <Controller
            control={control}
            name="lawyerId"
            render={({ field }) => (
              <Select
                label={t("matter:fields.lawyer")}
                placeholder={t("common:select")}
                options={lawyerOptions}
                value={findOption(lawyerOptions, field.value)}
                onChange={(option) => field.onChange(option?.value ?? null)}
              />
            )}
          />
        )}

        {pendingAction === MatterAction.SUBMIT_OPINION && (
          <>
            <Controller
              control={control}
              name="opinionResult"
              render={({ field }) => (
                <Select
                  label={t("matter:fields.opinionResult")}
                  placeholder={t("common:select")}
                  options={opinionOptions}
                  value={findOption(opinionOptions, field.value)}
                  onChange={(option) => field.onChange(option?.value ?? null)}
                />
              )}
            />
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-greyscale-700">{t("matter:fields.opinionText")}</span>
                <Button
                  type="button"
                  sizeType="xs"
                  variantType="Plain"
                  colorType="Electro"
                  leftIcon={<Icon name="lightbulb" className="size-4" />}
                  onClick={fillAiDraft}
                >
                  {t("matter:opinion.aiFill")}
                </Button>
              </div>
              <TextArea placeholder={t("matter:opinion.textPlaceholder")} {...register("opinionText")} />
              {isAiDraft && (
                <p className="flex gap-2 rounded-lg bg-electro-50 px-3 py-2 text-xs text-electro-700">
                  <Icon name="alert" className="size-4" />
                  {t("matter:opinion.aiWarning")}
                </p>
              )}
            </div>
          </>
        )}

        {pendingAction === MatterAction.PROVIDE_DOCS && (
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-greyscale-400 p-4 hover:border-main-green-400">
            <Icon name="upload" className="text-main-green-700" />
            <span className="flex-1 truncate text-sm text-greyscale-800">{values.fileName || t("matter:create.attachFile")}</span>
            <input type="file" className="hidden" onChange={(event) => setValue("fileName", event.target.files?.[0]?.name ?? "")} />
          </label>
        )}

        {pendingAction === MatterAction.APPROVE && (
          <p className="rounded-lg border border-neon-blue-200 bg-neon-blue-50 px-3 py-2 text-xs text-neon-blue-800">
            {t("matter:approvals.signatureNotice")}
          </p>
        )}

        {pendingAction && pendingAction !== MatterAction.START_REVIEW && (
          <TextArea
            label={ACTIONS_WITH_REQUIRED_COMMENT.includes(pendingAction) ? t("matter:fields.commentRequired") : t("matter:fields.comment")}

            {...register("comment")}
          />
        )}
      </ConfirmModal>
    </>
  );
};
