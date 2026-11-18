/**
 * Copyright (c) 2026 Myia. Licensed under the MIT License.
 */
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import headers from "eslint-plugin-headers";
import tseslint from "typescript-eslint";

export default defineConfig(
  { ignores: ["dist/", "coverage/", "node_modules/"] },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: { allowDefaultProject: ["eslint.config.js"] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { headers },
    rules: {
      // Every source file says who holds the copyright and under which licence.
      "headers/header-format": [
        "error",
        {
          source: "string",
          content: "Copyright (c) {year} Myia. Licensed under the MIT License.",
          variables: { year: "2026" },
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // The config file itself is plain JavaScript: lint it without type information.
  { files: ["eslint.config.js"], extends: [tseslint.configs.disableTypeChecked] },
);
