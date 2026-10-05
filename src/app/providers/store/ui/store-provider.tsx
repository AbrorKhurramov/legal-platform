import type { ReactNode } from "react";

import { Provider } from "react-redux";

import { store } from "../common/store.config";

interface IStoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = (props: IStoreProviderProps) => {
  return <Provider store={store}>{props.children}</Provider>;
};
