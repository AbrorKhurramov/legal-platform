import { Select } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui/icon/icon.entry";

import { mapFoldersToOptions } from "../model/folder.mapper";
import { useFolderTree } from "../model/use-folder-tree";

interface IFolderSelectProps {
  value: string | null;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  errorMessage?: string;
  onChange(folderId: string | null): void;
}

export const FolderSelect = (props: IFolderSelectProps) => {
  const { value, label, placeholder, disabled, errorMessage, onChange } = props;
  const { t } = useTranslation("document");
  const { tree, isFetching } = useFolderTree();
  const options = mapFoldersToOptions(tree);

  return (
    <Select
      label={label}
      placeholder={placeholder ?? t("folders.select")}
      options={options}
      value={options.find((option) => option.value === value) ?? null}
      isLoading={isFetching}
      isClearable
      disabled={disabled}
      errorMessage={errorMessage}
      noOptionsMessage={t("folders.empty")}
      onChange={(option) => onChange(option?.value ?? null)}
      formatOptionLabel={(option, meta) =>
        meta.context === "menu" ? (
          <span className="flex items-center gap-2" style={{ paddingLeft: `${(option.depth ?? 0) * 16}px` }}>
            <Icon name="folder" className="size-4 shrink-0 text-warning-500" />
            <span className="truncate">{option.name}</span>
          </span>
        ) : (
          <span className="truncate">{option.label}</span>
        )
      }
    />
  );
};
