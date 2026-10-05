import type { SVGProps } from "react";

import { twMerge } from "tailwind-merge";

import { ICONS, type IconNameTypes } from "../common/icon-const";

interface IIconProps extends SVGProps<SVGSVGElement> {
  name: IconNameTypes;
}

export const Icon = (props: IIconProps) => {
  const { name, className, ...rest } = props;
  const Component = ICONS[name];

  return <Component className={twMerge("size-5 shrink-0", className)} aria-hidden {...rest} />;
};
