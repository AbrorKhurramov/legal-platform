import { Input } from "local-agro-ui";

import { Icon } from "@/shared/ui/icon/icon.entry";

interface ISearchInputProps {
  value: string;
  placeholder: string;
  className?: string;
  onChange(value: string): void;
}

export const SearchInput = (props: ISearchInputProps) => {
  const { value, placeholder, className, onChange } = props;

  return (
    <Input
      value={value}
      placeholder={placeholder}
      sizeType="lg"
      wrapperClassName={className}
      leftIcon={<Icon name="search" className="size-4.5 text-greyscale-500" />}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};
