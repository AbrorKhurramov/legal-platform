import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActivityCondition, Button, Drawer, type IDrawerProps, Select, TextArea } from "local-agro-ui";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { findOption } from "@/shared/lib/select-lib";

import {
  RiskDetailContent,
  type RiskDetailDTO,
  RiskDetailSkeleton,
  type RiskStatus,
  getRiskStatusOptions,
  riskApi,
  riskApiQueryKeys,
} from "@/entities/risk/risk.entry";

interface IRiskActionFormValues {
  status: RiskStatus;
  note: string;
}

interface IRiskActionFormProps {
  data: RiskDetailDTO;
}

const RiskActionForm = (props: IRiskActionFormProps) => {
  const { data } = props;
  const { t } = useTranslation(["risk", "common"]);
  const queryClient = useQueryClient();
  const statusOptions = getRiskStatusOptions();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<IRiskActionFormValues>({ defaultValues: { status: data.status, note: "" } });

  const { mutate: sendAction, isPending } = useMutation({
    mutationFn: (values: IRiskActionFormValues) => riskApi.actionRisk(data.id, { status: values.status, note: values.note.trim() || undefined }),
    mutationKey: riskApiQueryKeys.getKey("actionRisk"),
    onSuccess: (_, values) => {
      queryClient.invalidateQueries({ queryKey: riskApiQueryKeys.getRootKey() });
      reset({ status: values.status, note: "" });
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => sendAction(values))} className="flex flex-col gap-3 rounded-2xl bg-greyscale-100 p-4">
      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <Select
            label={t("risk:fields.status")}
            options={statusOptions}
            value={findOption(statusOptions, field.value)}
            onChange={(option) => option && field.onChange(option.value)}
          />
        )}
      />
      <TextArea label={t("risk:fields.note")} placeholder={t("risk:notePlaceholder")} {...register("note")} />
      <div className="flex justify-end">
        <Button type="submit" sizeType="md" loading={isPending} disabled={!isDirty}>
          {t("common:save")}
        </Button>
      </div>
    </form>
  );
};

interface IRiskDrawerProps extends Omit<IDrawerProps, "title" | "className" | "children" | "footer"> {
  riskId: string;
}

export const RiskDrawer = (props: IRiskDrawerProps) => {
  const { riskId, isOpen, onClose } = props;
  const { t } = useTranslation("risk");

  const { data, isFetching } = useQuery({
    queryFn: () => riskApi.getRiskDetail(riskId),
    queryKey: riskApiQueryKeys.getKey("getRiskDetail", riskId),
    enabled: !!riskId,
  });

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={data?.title ?? t("drawerTitle")} className="w-full max-w-2xl">
      <ActivityCondition condition={isFetching && !data} fallback={<RiskDetailSkeleton />}>
        {data && <RiskDetailContent data={data} actionForm={<RiskActionForm key={data.id} data={data} />} />}
      </ActivityCondition>
    </Drawer>
  );
};
