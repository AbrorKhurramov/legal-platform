import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActivityCondition, Button, DatePicker, Drawer, type IDrawerProps, Input, Select } from "local-agro-ui";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { findOption } from "@/shared/lib/select-lib";
import { Icon } from "@/shared/ui/icon/icon.entry";
import { toIsoDate } from "@/shared/utils/format-date";

import {
  LegislationDetailContent,
  LegislationDetailSkeleton,
  legislationApi,
  legislationApiQueryKeys,
} from "@/entities/legislation/legislation.entry";
import { RoleBasedGuard, UserRole, mapUsersToOptions, useAccess, userApi, userApiQueryKeys } from "@/entities/user/user.entry";

interface ITaskFormValues {
  title: string;
  assigneeId: string | null;
  dueDate: Date | null;
}

interface ILegislationDrawerProps extends Omit<IDrawerProps, "title" | "className" | "children" | "footer"> {
  legislationId: string;
}

export const LegislationDrawer = (props: ILegislationDrawerProps) => {
  const { legislationId, isOpen, onClose } = props;
  const { t } = useTranslation(["legislation", "common"]);
  const queryClient = useQueryClient();
  const canManage = useAccess(RoleBasedGuard.legislation["action:create"]);
  const detailKey = legislationApiQueryKeys.getKey("getLegislationDetail", legislationId);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<ITaskFormValues>({ mode: "onChange", defaultValues: { title: "", assigneeId: null, dueDate: null } });

  const { data, isFetching } = useQuery({
    queryFn: () => legislationApi.getLegislationDetail(legislationId),
    queryKey: detailKey,
    enabled: !!legislationId,
  });

  const { data: lawyers } = useQuery({
    queryFn: () => userApi.getUsers({ role: UserRole.LAWYER }),
    queryKey: userApiQueryKeys.getKey("getUsers", { role: UserRole.LAWYER }),
    enabled: canManage,
  });
  const lawyerOptions = mapUsersToOptions(lawyers);

  const onDetailChanged = () => queryClient.invalidateQueries({ queryKey: legislationApiQueryKeys.getRootKey() });

  const { mutate: toggleTask } = useMutation({
    mutationFn: (taskId: string) => legislationApi.actionLegislationTaskToggle(legislationId, taskId),
    mutationKey: legislationApiQueryKeys.getKey("actionLegislationTaskToggle"),
    onSuccess: onDetailChanged,
  });

  const { mutate: addTask, isPending } = useMutation({
    mutationFn: (values: ITaskFormValues) =>
      legislationApi.addLegislationTask(legislationId, {
        title: values.title.trim(),
        assigneeId: values.assigneeId!,
        dueDate: toIsoDate(values.dueDate)!,
      }),
    mutationKey: legislationApiQueryKeys.getKey("addLegislationTask"),
    onSuccess: () => {
      onDetailChanged();
      reset();
    },
  });

  const taskForm = canManage ? (
    <form
      onSubmit={handleSubmit((values) => addTask(values))}
      className="mt-4 grid grid-cols-1 gap-3 rounded-2xl bg-greyscale-100 p-4 sm:grid-cols-2"
    >
      <Input
        wrapperClassName="sm:col-span-2"
        label={t("legislation:task.title")}
        placeholder={t("legislation:task.titlePlaceholder")}
        {...register("title", { required: true })}
      />
      <Controller
        control={control}
        name="assigneeId"
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            label={t("legislation:task.assignee")}
            placeholder={t("common:select")}
            options={lawyerOptions}
            value={findOption(lawyerOptions, field.value)}
            onChange={(option) => field.onChange(option?.value ?? null)}
          />
        )}
      />
      <Controller
        control={control}
        name="dueDate"
        rules={{ required: true }}
        render={({ field }) => <DatePicker label={t("legislation:task.dueDate")} date={field.value} setDate={field.onChange} minDate={new Date()} />}
      />
      <div className="flex justify-end sm:col-span-2">
        <Button type="submit" sizeType="md" loading={isPending} disabled={!isValid} leftIcon={<Icon name="plus" className="size-4" />}>
          {t("legislation:task.add")}
        </Button>
      </div>
    </form>
  ) : undefined;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={data?.docNumber ?? t("legislation:drawerTitle")} className="w-full max-w-2xl">
      <ActivityCondition condition={isFetching && !data} fallback={<LegislationDetailSkeleton />}>
        {data && (
          <div className="flex flex-col gap-4">
            <h3 className="text-h5 text-greyscale-900">{data.title}</h3>
            <LegislationDetailContent data={data} taskForm={taskForm} onToggleTask={(taskId) => canManage && toggleTask(taskId)} />
          </div>
        )}
      </ActivityCondition>
    </Drawer>
  );
};
