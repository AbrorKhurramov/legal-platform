import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { loadEnv } from "vite";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      tailwindcss(),
      svgr({
        include: "**/*.svg",
        svgrOptions: { exportType: "named", namedExport: "ReactComponent", svgo: false },
      }),
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"],
      alias: { "@": path.resolve(import.meta.dirname, "src") },
    },
    server: {
      port: Number(env.VITE_RUNNING_PORT) || 3000,
    },
    test: {
      passWithNoTests: true,
    },
  };
});
