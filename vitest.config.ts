import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["tests/unit/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
    env: {
      DATABASE_URL: "file:./prisma/dev.db",
      APP_PASSWORD: "changeme1234",
      SESSION_SECRET: "1234567890abcdef",
      NODE_ENV: "test",
    },
  },
});
