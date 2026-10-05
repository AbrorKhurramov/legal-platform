import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Drawer, type IDrawerProps, Input, Select, TextArea, Toggle } from "local-agro-ui";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { buildMatterDetailRoute } from "@/shared/const/route-const";
import { dayjs } from "@/shared/lib/dayjs-lib";
import { findOption } from "@/shared/lib/select-lib";
import { Icon } from "@/shared/ui/icon/icon.entry";
import { toIsoDate } from "@/shared/utils/format-date";

import {
  MatterPriority,
  MatterType,
  getMatterPriorityOptions,
  getMatterTypeOptions,
  matterApi,
  matterApiQueryKeys,
} from "@/entities/matter/matter.entry";

import { MATTER_SLA_DAYS, TYPES_WITH_COUNTERPARTY } from "../common/matter-create.const";

interface IMatterCreateFormValues {
  type: MatterType | null;
  title: string;
  description: string;
  priority: MatterPriority;
  dueDate: Date | null;
  confidential: boolean;
  counterparty: string;
  contractAmount: string;
  fileName: string;
}

interface IMatterCreateDrawerProps extends Omit<IDrawerProps, "title" | "className" | "children" | "footer"> {
  defaultType?: MatterType;
}

const FORM_ID = "matter-create-form";

export const MatterCreateDrawer = (props: IMatterCreateDrawerProps) => {
  const { isOpen, onClose, defaultType } = props;
  const { t } = useTranslation(["matter", "common"]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<IMatterCreateFormValues>({
    mode: "onChange",
    defaultValues: {
      type: defaultType ?? null,
      title: "",
      description: "",
      priority: MatterPriority.MEDIUM,
      dueDate: dayjs().add(MATTER_SLA_DAYS[MatterPriority.MEDIUM], "day").toDate(),
      confidential: false,
      counterparty: "",
      contractAmount: "",
      fileName: "",
    },
  });

  const selectedType = watch("type");
  const fileName = watch("fileName");
  const typeOptions = getMatterTypeOptions();
  const priorityOptions = getMatterPriorityOptions();

  const { mutate: createMatter, isPending } = useMutation({
    mutationFn: matterApi.createMatter,
    mutationKey: matterApiQueryKeys.getKey("createMatter"),
    onSuccess: (matter) => {
      queryClient.invalidateQueries({ queryKey: matterApiQueryKeys.getRootKey() });
      onClose();
      navigate(buildMatterDetailRoute(matter.id));
    },
  });

  const onSubmit = (values: IMatterCreateFormValues) => {
    createMatter({
      type: values.type!,
      title: values.title.trim(),
      description: values.description.trim(),
      priority: values.priority,
      dueDate: toIsoDate(values.dueDate)!,
      confidential: values.confidential,
      counterparty: values.counterparty.trim() || undefined,
      contractAmount: values.contractAmount ? Number(values.contractAmount.replace(/\s/g, "")) : undefined,
      fileName: values.fileName || undefined,
    });
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={t("matter:create.title")}
      className="w-full max-w-xl"
      footer={
        <div className="flex w-full justify-end gap-3">
          <Button variantType="Outlined" colorType="Gray" onClick={onClose}>
            {t("common:cancel")}
          </Button>
          <Button type="submit" form={FORM_ID} loading={isPending} disabled={!isValid || !isDirty}>
            {t("matter:create.submit")}
          </Button>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          control={control}
          name="type"
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              label={t("matter:fields.type")}
              required
              placeholder={t("common:select")}
              options={typeOptions}
              value={findOption(typeOptions, field.value)}
              onChange={(option) => field.onChange(option?.value ?? null)}
            />
          )}
        />
        <Input
          label={t("matter:fields.title")}
          placeholder={t("matter:create.titlePlaceholder")}
          errorMessage={errors.title && t("common:validation.minLength", { count: 5 })}
          {...register("title", { required: true, minLength: 5 })}
        />
        <TextArea
          label={t("matter:fields.description")}
          placeholder={t("matter:create.descriptionPlaceholder")}

          errorMessage={errors.description && t("common:validation.minLength", { count: 10 })}
          {...register("description", { required: true, minLength: 10 })}
        />
        {selectedType && TYPES_WITH_COUNTERPARTY.includes(selectedType) && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label={t("matter:fields.counterparty")} placeholder="“...” MChJ" {...register("counterparty")} />
            <Input
              label={t("matter:fields.contractAmount")}
              inputMode="numeric"
              placeholder="0"
              {...register("contractAmount", { pattern: /^[\d\s]*$/ })}
            />
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select
                label={t("matter:fields.priority")}
                options={priorityOptions}
                value={findOption(priorityOptions, field.value)}
                onChange={(option) => {
                  if (!option) return;
                  field.onChange(option.value);
                  setValue("dueDate", dayjs().add(MATTER_SLA_DAYS[option.value], "day").toDate(), { shouldValidate: true });
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="dueDate"
            rules={{ required: true }}
            render={({ field }) => <DatePicker label={t("matter:fields.dueDate")} date={field.value} setDate={field.onChange} minDate={new Date()} />}
          />
        </div>
        <p className="-mt-3 text-xs text-greyscale-500">{t("matter:create.slaHint")}</p>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-greyscale-400 p-4 transition hover:border-main-green-400 hover:bg-main-green-50">
          <span className="flex size-10 items-center justify-center rounded-lg bg-main-green-50 text-main-green-700">
            <Icon name="upload" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-greyscale-900">{fileName || t("matter:create.attachFile")}</span>
            <span className="block text-xs text-greyscale-500">{t("matter:create.attachHint")}</span>
          </span>
          <input
            type="file"
            className="hidden"
            accept=".doc,.docx,.pdf"
            onChange={(event) => setValue("fileName", event.target.files?.[0]?.name ?? "", { shouldDirty: true })}
          />
        </label>
        <Controller
          control={control}
          name="confidential"
          render={({ field }) => (
            <div className="flex items-start gap-3 rounded-xl bg-greyscale-100 p-4">
              <Toggle checked={field.value} onChange={(event) => field.onChange(event.target.checked)} />
              <span>
                <span className="block text-sm font-medium text-greyscale-900">{t("matter:create.confidential")}</span>
                <span className="block text-xs text-greyscale-500">{t("matter:create.confidentialHint")}</span>
              </span>
            </div>
          )}
        />
      </form>
    </Drawer>
  );
};
