import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: dirname,
});

const config = [
  {
    ignores: [
      ".next/**",
      "coverage/**",
      "dist/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
      "playwright-report/**",
      ".playwright-browsers/**",
      "test-results/**",
      "public/**",
    ],
  },
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["tests/**/*.test.ts"],
    languageOptions: {
      globals: {
        describe: "readonly",
        expect: "readonly",
        it: "readonly",
      },
    },
    rules: {
      "no-undef": "off",
    },
  },
];

export default config;
