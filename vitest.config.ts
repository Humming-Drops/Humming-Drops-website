import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    // First imports can take several seconds on a low-memory machine.
    testTimeout: 30000,
    globals: true,
    include: ["tests/**/*.{test,spec}.{ts,tsx,js,mjs}"],
    exclude: ["node_modules", ".next", "scratch"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/lib/**", "src/types/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
