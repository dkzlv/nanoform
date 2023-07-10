import { resolve } from "path";
import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";
import strip from "@rollup/plugin-strip";
import react from "@vitejs/plugin-react";

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
  },
  build: {
    minify: false,
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      name: "nanoform",
      fileName: "nanoform",
    },
    rollupOptions: {
      external: ["nanostores"],
    },
  },
  plugins: [
    react(),
    {
      ...strip({
        include: ["**/*.(ts|js)"],
        // Intentionally leave out console.warn here
        functions: ["console.log"],
      }),
      apply: "build",
    },
    dts(),
  ],
});
