import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Drawer, type IDrawerProps, Input, Select, TextArea } from "local-agro-ui";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { findOption } from "@/shared/lib/select-lib";
import { toIsoDate } from "@/shared/utils/format-date";

import { CourtCaseCategory, courtCaseApi, courtCaseApiQueryKeys, getCourtCaseCategoryOptions } from "@/entities/court-case/court-case.entry";

const BANK_NAME = "“Agrobank” ATB";
const FORM_ID = "court-case-create-form";

interface ICourtCaseCreateFormValues {
  category: CourtCaseCategory;
  plaintiff: string;
  defendant: string;
  court: string;
  subject: string;
  claimAmount: string;
  nextHearingDate: Date | null;
}

interface ICourtCaseCreateDrawerProps extends Omit<IDrawerProps, "title" | "className" | "children" | "footer"> {
  onCreated?(id: string): void;
}

export const CourtCaseCreateDrawer = (props: ICourtCaseCreateDrawerProps) => {
  const { isOpen, onClose, onCreated } = props;
  const { t } = useTranslation(["court", "common"]);
  const queryClient = useQueryClient();
  const categoryOptions = getCourtCaseCategoryOptions();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { isValid, isDirty },
  } = useForm<ICourtCaseCreateFormValues>({
    mode: "onChange",
    defaultValues: {
      category: CourtCaseCategory.BANK_CLAIM,
      plaintiff: BANK_NAME,
      defendant: "",
      court: "",
      subject: "",
      claimAmount: "",
      nextHearingDate: null,
    },
  });

  const { mutate: createCase, isPending } = useMutation({
    mutationFn: courtCaseApi.createCourtCase,
    mutationKey: courtCaseApiQueryKeys.getKey("createCourtCase"),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: courtCaseApiQueryKeys.getRootKey() });
      onClose();
      onCreated?.(response.id);
    },
  });

  const onSubmit = (values: ICourtCaseCreateFormValues) =>
    createCase({
      category: values.category,
      plaintiff: values.plaintiff.trim(),
      defendant: values.defendant.trim(),
      court: values.court.trim(),
      subject: values.subject.trim(),
      claimAmount: Number(values.claimAmount.replace(/\s/g, "")),
      nextHearingDate: toIsoDate(values.nextHearingDate),
    });

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={t("court:create.title")}
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
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select
              label={t("court:fields.category")}
              options={categoryOptions}
              value={findOption(categoryOptions, field.value)}
              onChange={(option) => {
                if (!option) return;
                field.onChange(option.value);
                const isAgainstBank = option.value === CourtCaseCategory.CLAIM_AGAINST_BANK;
                setValue("plaintiff", isAgainstBank ? "" : BANK_NAME, { shouldValidate: true });
                setValue("defendant", isAgainstBank ? BANK_NAME : "", { shouldValidate: true });
              }}
            />
          )}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label={t("court:fields.plaintiff")} {...register("plaintiff", { required: true })} />
          <Input label={t("court:fields.defendant")} {...register("defendant", { required: true })} />
        </div>
        <Input label={t("court:fields.court")} placeholder={t("court:create.courtPlaceholder")} {...register("court", { required: true })} />
        <TextArea label={t("court:fields.subject")} {...register("subject", { required: true })} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={t("court:fields.claimAmount")}
            inputMode="numeric"
            placeholder="0"
            {...register("claimAmount", { required: true, pattern: /^[\d\s]+$/ })}
          />
          <Controller
            control={control}
            name="nextHearingDate"
            render={({ field }) => (
              <DatePicker label={t("court:fields.nextHearingDate")} date={field.value} setDate={field.onChange} minDate={new Date()} isClearable />
            )}
          />
        </div>
      </form>
    </Drawer>
  );
};
