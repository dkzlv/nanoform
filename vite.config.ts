import { resolve } from "path";
import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";
import strip from "@rollup/plugin-strip";

export default defineConfig({
  test: {
    globals: true,
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
