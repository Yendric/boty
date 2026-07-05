import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
    globalIgnores(["dist/", "node_modules/", ".pnpm-store/"]),
    {
        files: ["**/*.ts"],
        extends: [js.configs.recommended, tseslint.configs.recommended, prettier],
    },
    {
        files: ["**/*.mjs"],
        extends: [js.configs.recommended, prettier],
    },
);
