import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router";

import { QueryProvider } from "./providers/query/query.entry";
import { StoreProvider } from "./providers/store/store.entry";
import { router } from "./router/route";

export const App = () => {
  return (
    <StoreProvider>
      <QueryProvider>
        <Toaster position="top-right" toastOptions={{ className: "text-sm" }} />
        <RouterProvider router={router} />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />}
      </QueryProvider>
    </StoreProvider>
  );
};
