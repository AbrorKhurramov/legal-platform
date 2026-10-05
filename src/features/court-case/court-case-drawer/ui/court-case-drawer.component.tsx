import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActivityCondition, Button, DatePicker, Drawer, type IDrawerProps, Input, Select } from "local-agro-ui";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { findOption } from "@/shared/lib/select-lib";
import { toIsoDate } from "@/shared/utils/format-date";

import {
  CourtCaseDetailContent,
  type CourtCaseDetailDTO,
  CourtCaseDetailSkeleton,
  type CourtCaseResult,
  type CourtCaseStage,
  courtCaseApi,
  courtCaseApiQueryKeys,
  getCourtCaseResultOptions,
  getCourtCaseStageOptions,
} from "@/entities/court-case/court-case.entry";

interface ICourtCaseUpdateFormValues {
  stage: CourtCaseStage;
  result: CourtCaseResult;
  recoveredAmount: string;
  nextHearingDate: Date | null;
}

interface ICourtCaseUpdateFormProps {
  data: CourtCaseDetailDTO;
}

const CourtCaseUpdateForm = (props: ICourtCaseUpdateFormProps) => {
  const { data } = props;
  const { t } = useTranslation(["court", "common"]);
  const queryClient = useQueryClient();
  const stageOptions = getCourtCaseStageOptions();
  const resultOptions = getCourtCaseResultOptions();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ICourtCaseUpdateFormValues>({
    defaultValues: {
      stage: data.stage,
      result: data.result,
      recoveredAmount: String(data.recoveredAmount),
      nextHearingDate: data.nextHearingDate ? new Date(data.nextHearingDate) : null,
    },
  });

  const { mutate: updateCase, isPending } = useMutation({
    mutationFn: (values: ICourtCaseUpdateFormValues) =>
      courtCaseApi.actionCourtCaseUpdate(data.id, {
        stage: values.stage,
        result: values.result,
        recoveredAmount: Number(values.recoveredAmount.replace(/\s/g, "")) || 0,
        nextHearingDate: toIsoDate(values.nextHearingDate) ?? null,
      }),
    mutationKey: courtCaseApiQueryKeys.getKey("actionCourtCaseUpdate"),
    onSuccess: (response, values) => {
      queryClient.invalidateQueries({ queryKey: courtCaseApiQueryKeys.getRootKey() });
      reset({ ...values, recoveredAmount: String(response.recoveredAmount) });
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => updateCase(values))} className="grid grid-cols-1 gap-4 rounded-2xl bg-greyscale-100 p-4 sm:grid-cols-2">
      <Controller
        control={control}
        name="stage"
        render={({ field }) => (
          <Select
            label={t("court:fields.stage")}
            options={stageOptions}
            value={findOption(stageOptions, field.value)}
            onChange={(option) => option && field.onChange(option.value)}
          />
        )}
      />
      <Controller
        control={control}
        name="result"
        render={({ field }) => (
          <Select
            label={t("court:fields.result")}
            options={resultOptions}
            value={findOption(resultOptions, field.value)}
            onChange={(option) => option && field.onChange(option.value)}
          />
        )}
      />
      <Input label={t("court:fields.recoveredAmount")} inputMode="numeric" {...register("recoveredAmount", { pattern: /^[\d\s]*$/ })} />
      <Controller
        control={control}
        name="nextHearingDate"
        render={({ field }) => <DatePicker label={t("court:fields.nextHearingDate")} date={field.value} setDate={field.onChange} isClearable />}
      />
      <div className="flex justify-end sm:col-span-2">
        <Button type="submit" sizeType="md" loading={isPending} disabled={!isDirty}>
          {t("common:save")}
        </Button>
      </div>
    </form>
  );
};

interface ICourtCaseDrawerProps extends Omit<IDrawerProps, "title" | "className" | "children" | "footer"> {
  courtCaseId: string;
}

export const CourtCaseDrawer = (props: ICourtCaseDrawerProps) => {
  const { courtCaseId, isOpen, onClose } = props;
  const { t } = useTranslation("court");
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryFn: () => courtCaseApi.getCourtCaseDetail(courtCaseId),
    queryKey: courtCaseApiQueryKeys.getKey("getCourtCaseDetail", courtCaseId),
    enabled: !!courtCaseId,
  });

  const { mutate: toggleDeadline } = useMutation({
    mutationFn: (deadlineId: string) => courtCaseApi.actionCourtDeadlineToggle(courtCaseId, deadlineId),
    mutationKey: courtCaseApiQueryKeys.getKey("actionCourtDeadlineToggle"),
    onSuccess: (response) => {
      queryClient.setQueryData(courtCaseApiQueryKeys.getKey("getCourtCaseDetail", courtCaseId), response);
    },
  });

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={data?.caseNumber ?? t("drawerTitle")} className="w-full max-w-2xl">
      <ActivityCondition condition={isFetching && !data} fallback={<CourtCaseDetailSkeleton />}>
        {data && <CourtCaseDetailContent data={data} footer={<CourtCaseUpdateForm key={data.id} data={data} />} onToggleDeadline={toggleDeadline} />}
      </ActivityCondition>
    </Drawer>
  );
};
