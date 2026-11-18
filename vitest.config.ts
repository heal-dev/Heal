/**
 * Copyright (c) 2026 Myia. Licensed under the MIT License.
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
