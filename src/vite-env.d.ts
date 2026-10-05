/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_HOST: string;
  readonly VITE_RUNNING_PORT: string;
  readonly VITE_USE_MOCK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.svg" {
  import type { FC, SVGProps } from "react";

  export const ReactComponent: FC<SVGProps<SVGSVGElement>>;
}
