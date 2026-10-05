import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Drawer, type IDrawerProps, Input, Select, TextArea } from "local-agro-ui";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { findOption } from "@/shared/lib/select-lib";
import { toIsoDate } from "@/shared/utils/format-date";

import {
  ImpactLevel,
  type LegislationSource,
  getImpactLevelOptions,
  getLegislationSourceOptions,
  legislationApi,
  legislationApiQueryKeys,
} from "@/entities/legislation/legislation.entry";
import { UserRole, mapUsersToOptions, userApi, userApiQueryKeys } from "@/entities/user/user.entry";

const FORM_ID = "legislation-create-form";

interface ILegislationCreateFormValues {
  title: string;
  docNumber: string;
  source: LegislationSource | null;
  publishedAt: Date | null;
  effectiveAt: Date | null;
  impactLevel: ImpactLevel;
  summary: string;
  responsibleId: string | null;
}

interface ILegislationCreateDrawerProps extends Omit<IDrawerProps, "title" | "className" | "children" | "footer"> {
  onCreated?(id: string): void;
}

export const LegislationCreateDrawer = (props: ILegislationCreateDrawerProps) => {
  const { isOpen, onClose, onCreated } = props;
  const { t } = useTranslation(["legislation", "common"]);
  const queryClient = useQueryClient();
  const sourceOptions = getLegislationSourceOptions();
  const impactOptions = getImpactLevelOptions();

  const {
    control,
    register,
    handleSubmit,
    formState: { isValid, isDirty },
  } = useForm<ILegislationCreateFormValues>({
    mode: "onChange",
    defaultValues: {
      title: "",
      docNumber: "",
      source: null,
      publishedAt: new Date(),
      effectiveAt: null,
      impactLevel: ImpactLevel.MEDIUM,
      summary: "",
      responsibleId: null,
    },
  });

  const { data: lawyers } = useQuery({
    queryFn: () => userApi.getUsers({ role: UserRole.LAWYER }),
    queryKey: userApiQueryKeys.getKey("getUsers", { role: UserRole.LAWYER }),
    enabled: isOpen,
  });
  const lawyerOptions = mapUsersToOptions(lawyers);

  const { mutate: createChange, isPending } = useMutation({
    mutationFn: legislationApi.createLegislationChange,
    mutationKey: legislationApiQueryKeys.getKey("createLegislationChange"),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: legislationApiQueryKeys.getRootKey() });
      onClose();
      onCreated?.(response.id);
    },
  });

  const onSubmit = (values: ILegislationCreateFormValues) =>
    createChange({
      title: values.title.trim(),
      docNumber: values.docNumber.trim(),
      source: values.source!,
      publishedAt: toIsoDate(values.publishedAt)!,
      effectiveAt: toIsoDate(values.effectiveAt)!,
      impactLevel: values.impactLevel,
      summary: values.summary.trim(),
      responsibleId: values.responsibleId!,
    });

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={t("legislation:create.title")}
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
        <TextArea label={t("legislation:fields.title")} {...register("title", { required: true })} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label={t("legislation:fields.docNumber")} placeholder="O'RQ-000" {...register("docNumber", { required: true })} />
          <Controller
            control={control}
            name="source"
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                label={t("legislation:fields.source")}
                placeholder={t("common:select")}
                options={sourceOptions}
                value={findOption(sourceOptions, field.value)}
                onChange={(option) => field.onChange(option?.value ?? null)}
              />
            )}
          />
          <Controller
            control={control}
            name="publishedAt"
            rules={{ required: true }}
            render={({ field }) => <DatePicker label={t("legislation:fields.publishedAt")} date={field.value} setDate={field.onChange} />}
          />
          <Controller
            control={control}
            name="effectiveAt"
            rules={{ required: true }}
            render={({ field }) => <DatePicker label={t("legislation:fields.effectiveAt")} date={field.value} setDate={field.onChange} />}
          />
          <Controller
            control={control}
            name="impactLevel"
            render={({ field }) => (
              <Select
                label={t("legislation:fields.impactLevel")}
                options={impactOptions}
                value={findOption(impactOptions, field.value)}
                onChange={(option) => option && field.onChange(option.value)}
              />
            )}
          />
          <Controller
            control={control}
            name="responsibleId"
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                label={t("legislation:fields.responsible")}
                placeholder={t("common:select")}
                options={lawyerOptions}
                value={findOption(lawyerOptions, field.value)}
                onChange={(option) => field.onChange(option?.value ?? null)}
              />
            )}
          />
        </div>
        <TextArea label={t("legislation:fields.summary")} {...register("summary", { required: true })} />
      </form>
    </Drawer>
  );
};
