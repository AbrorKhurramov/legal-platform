import { useEffect, useRef, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui/icon/icon.entry";

import { type UserImportDTO, userAdminApi, userAdminApiQueryKeys } from "@/entities/user/user.entry";

const TEMPLATE_HEADER = "username;full_name;position;role;branch";
const TEMPLATE_EXAMPLE = "a.karimov;Karimov Aziz;Yurist;LAWYER;Bosh ofis";

const csvCell = (value: string) => (/[;"\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

/** The one-time passwords as a file the administrator can hand out; built in the browser, never sent anywhere. */
const saveCredentials = (result: UserImportDTO) => {
  const lines = [
    "username;full_name;temporary_password",
    ...result.created.map((item) => [item.user.username, item.user.fullName, item.temporaryPassword].map(csvCell).join(";")),
  ];
  const href = URL.createObjectURL(new Blob([`﻿${lines.join("\n")}`], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = href;
  link.download = "temporary-passwords.csv";
  link.click();
  URL.revokeObjectURL(href);
};

interface IUserImportModalProps {
  isOpen: boolean;
  onClose(): void;
}

export const UserImportModal = (props: IUserImportModalProps) => {
  const { isOpen, onClose } = props;
  const { t } = useTranslation(["admin", "common"]);
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<UserImportDTO | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setFile(null);
    setResult(null);
  }, [isOpen]);

  const { mutate: importUsers, isPending } = useMutation({
    mutationFn: userAdminApi.createImport,
    mutationKey: userAdminApiQueryKeys.getKey("createImport"),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: userAdminApiQueryKeys.getRootKey() });
      setResult(response);
    },
  });

  const footer = result ? (
    <div className="flex w-full justify-end gap-3">
      {result.createdCount > 0 && (
        <Button
          variantType="Outlined"
          colorType="Gray"
          leftIcon={<Icon name="download" className="size-4" />}
          onClick={() => saveCredentials(result)}
        >
          {t("admin:import.savePasswords")}
        </Button>
      )}
      <Button onClick={onClose}>{t("common:close")}</Button>
    </div>
  ) : (
    <div className="flex w-full justify-end gap-3">
      <Button variantType="Outlined" colorType="Gray" onClick={onClose}>
        {t("common:cancel")}
      </Button>
      <Button loading={isPending} disabled={!file} onClick={() => file && importUsers(file)}>
        {t("admin:import.submit")}
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("admin:import.title")} className="w-full max-w-2xl" footer={footer}>
      {result ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-main-green-50 p-4">
              <span className="block text-h4 text-main-green-800">{result.createdCount}</span>
              <span className="text-sm text-main-green-800">{t("admin:import.created")}</span>
            </div>
            <div className="rounded-xl bg-error-50 p-4">
              <span className="block text-h4 text-error-600">{result.rejectedCount}</span>
              <span className="text-sm text-error-600">{t("admin:import.rejected")}</span>
            </div>
          </div>
          {result.createdCount > 0 && (
            <p className="rounded-lg bg-warning-50 px-3 py-2 text-sm text-warning-800">{t("admin:import.passwordsHint")}</p>
          )}
          {result.rejected.length > 0 && (
            <ul className="flex max-h-64 flex-col divide-y divide-greyscale-200 overflow-y-auto rounded-xl border border-greyscale-300 text-sm">
              {result.rejected.map((row) => (
                <li key={row.line} className="flex gap-3 px-4 py-2">
                  <span className="shrink-0 text-greyscale-500">{t("admin:import.line", { line: row.line })}</span>
                  <span className="shrink-0 font-medium text-greyscale-900">{row.username || "—"}</span>
                  <span className="text-error-600">{row.reason}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-greyscale-700">{t("admin:import.hint")}</p>
          <pre className="overflow-x-auto rounded-lg bg-greyscale-100 px-3 py-2 font-mono text-xs text-greyscale-800">
            {TEMPLATE_HEADER}
            {"\n"}
            {TEMPLATE_EXAMPLE}
          </pre>
          <p className="text-xs text-greyscale-500">{t("admin:import.rules")}</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-3 rounded-xl border-2 border-dashed border-greyscale-400 px-4 py-4 text-left transition hover:border-main-green-400 hover:bg-main-green-50"
          >
            <Icon name="upload" className="text-main-green-700" />
            <span className="flex-1 truncate text-sm text-greyscale-800">{file ? file.name : t("admin:import.choose")}</span>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null);
                event.target.value = "";
              }}
            />
          </button>
        </div>
      )}
    </Modal>
  );
};
