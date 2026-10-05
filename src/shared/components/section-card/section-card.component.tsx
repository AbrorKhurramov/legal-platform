import type { ReactNode } from "react";

import { twMerge } from "tailwind-merge";

interface ISectionCardProps {
  title?: string;
  subtitle?: string;
  extra?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}

export const SectionCard = (props: ISectionCardProps) => {
  const { title, subtitle, extra, className, bodyClassName, children } = props;

  return (
    <section className={twMerge("flex flex-col rounded-2xl border border-greyscale-300 bg-white", className)}>
      {(title || extra) && (
        <header className="flex items-center justify-between gap-3 border-b border-greyscale-300 px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="truncate text-h6 text-greyscale-900">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-greyscale-600">{subtitle}</p>}
          </div>
          {extra}
        </header>
      )}
      <div className={twMerge("flex-1 p-5", bodyClassName)}>{children}</div>
    </section>
  );
};
