import { type ReactNode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "../common/query.config";

interface IQueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = (props: IQueryProviderProps) => {
  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
};
