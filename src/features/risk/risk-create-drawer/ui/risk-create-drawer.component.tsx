import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Drawer, type IDrawerProps, Input, Select, TextArea } from "local-agro-ui";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { findOption } from "@/shared/lib/select-lib";
import { toIsoDate } from "@/shared/utils/format-date";

import { type RiskCategory, getRiskCategoryOptions, getRiskScaleOptions, riskApi, riskApiQueryKeys } from "@/entities/risk/risk.entry";
import { mapUsersToOptions, userApi, userApiQueryKeys } from "@/entities/user/user.entry";

const FORM_ID = "risk-create-form";
const DEFAULT_SCALE = 3;

interface IRiskCreateFormValues {
  title: string;
  category: RiskCategory | null;
  probability: number;
  impact: number;
  description: string;
  mitigation: string;
  dueDate: Date | null;
  ownerId: string | null;
}

interface IRiskCreateDrawerProps extends Omit<IDrawerProps, "title" | "className" | "children" | "footer"> {
  onCreated?(id: string): void;
}

export const RiskCreateDrawer = (props: IRiskCreateDrawerProps) => {
  const { isOpen, onClose, onCreated } = props;
  const { t } = useTranslation(["risk", "common"]);
  const queryClient = useQueryClient();
  const categoryOptions = getRiskCategoryOptions();
  const scaleOptions = getRiskScaleOptions();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { isValid, isDirty },
  } = useForm<IRiskCreateFormValues>({
    mode: "onChange",
    defaultValues: {
      title: "",
      category: null,
      probability: DEFAULT_SCALE,
      impact: DEFAULT_SCALE,
      description: "",
      mitigation: "",
      dueDate: null,
      ownerId: null,
    },
  });
  const score = watch("probability") * watch("impact");

  const { data: users } = useQuery({
    queryFn: () => userApi.getUsers({}),
    queryKey: userApiQueryKeys.getKey("getUsers", {}),
    enabled: isOpen,
  });
  const ownerOptions = mapUsersToOptions(users);

  const { mutate: createRisk, isPending } = useMutation({
    mutationFn: riskApi.createRisk,
    mutationKey: riskApiQueryKeys.getKey("createRisk"),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: riskApiQueryKeys.getRootKey() });
      onClose();
      onCreated?.(response.id);
    },
  });

  const onSubmit = (values: IRiskCreateFormValues) =>
    createRisk({
      title: values.title.trim(),
      category: values.category!,
      probability: values.probability,
      impact: values.impact,
      description: values.description.trim(),
      mitigation: values.mitigation.trim(),
      dueDate: toIsoDate(values.dueDate)!,
      ownerId: values.ownerId!,
    });

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={t("risk:create.title")}
      className="w-full max-w-xl"
      footer={
        <div className="flex w-full justify-end gap-3">
          <Button variantType="Outlined" colorType="Gray" onClick={onClose}>
            {t("common:cancel")}
          </Button>
          <Button type="submit" form={FORM_ID} loading={isPending} disabled={!isValid || !isDirty}>
            {t("common:create")}
          </Button>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input label={t("risk:fields.title")} {...register("title", { required: true })} />
        <Controller
          control={control}
          name="category"
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              label={t("risk:fields.category")}
              placeholder={t("common:select")}
              options={categoryOptions}
              value={findOption(categoryOptions, field.value)}
              onChange={(option) => field.onChange(option?.value ?? null)}
            />
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={control}
            name="probability"
            render={({ field }) => (
              <Select
                label={t("risk:fields.probability")}
                options={scaleOptions}
                value={findOption(scaleOptions, field.value)}
                onChange={(option) => option && field.onChange(option.value)}
              />
            )}
          />
          <Controller
            control={control}
            name="impact"
            render={({ field }) => (
              <Select
                label={t("risk:fields.impact")}
                options={scaleOptions}
                value={findOption(scaleOptions, field.value)}
                onChange={(option) => option && field.onChange(option.value)}
              />
            )}
          />
        </div>
        <p className="rounded-lg bg-greyscale-100 px-3 py-2 text-sm text-greyscale-700">{t("risk:create.scoreHint", { score })}</p>
        <TextArea label={t("risk:fields.description")} {...register("description", { required: true })} />
        <TextArea label={t("risk:fields.mitigation")} {...register("mitigation", { required: true })} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            control={control}
            name="ownerId"
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                label={t("risk:fields.owner")}
                placeholder={t("common:select")}
                options={ownerOptions}
                value={findOption(ownerOptions, field.value)}
                onChange={(option) => field.onChange(option?.value ?? null)}
              />
            )}
          />
          <Controller
            control={control}
            name="dueDate"
            rules={{ required: true }}
            render={({ field }) => <DatePicker label={t("risk:fields.dueDate")} date={field.value} setDate={field.onChange} minDate={new Date()} />}
          />
        </div>
      </form>
    </Drawer>
  );
};
