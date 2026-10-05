import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { App } from "@/app/app.component";
import "@/app/i18n/i18n";
import "@/app/styles/app.css";

import { axiosInstance } from "@/shared/api/api-instance";

const bootstrap = async () => {
  if (import.meta.env.VITE_USE_MOCK === "true") {
    const { installMockServer } = await import("./mock/mock-server");
    installMockServer(axiosInstance);
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

void bootstrap();
