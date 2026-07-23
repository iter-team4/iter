import { defineConfig } from "vite";
import { defineConfig as defineVitestConfig, mergeConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const viteConfig = defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("leaflet") || id.includes("react-leaflet")) {
            return "leaflet";
          }
          if (id.includes("react-dom") || id.includes("react/")) {
            return "react";
          }
        },
      },
    },
  },
});

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: false,

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",

      include: ["src/**/*.{ts,tsx}"],

      exclude: ["src/test/**", "src/main.tsx", "src/vite-env.d.ts"],
    },
  },
});

export default mergeConfig(viteConfig, vitestConfig);
