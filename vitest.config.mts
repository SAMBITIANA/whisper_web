import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const stubsDir = `${rootDir}src/test/stubs`;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": `${rootDir}src`,
      "next/link": `${stubsDir}/next-link.tsx`,
      "next-themes": `${stubsDir}/next-themes.tsx`,
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
