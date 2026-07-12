import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js, jest },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
      globlas: globals.jest,
    } },
  { files: ["**/*.js"], languageOptions: {
      globals: globals.jest,
  } },
  tseslint.configs.recommended,
]);
