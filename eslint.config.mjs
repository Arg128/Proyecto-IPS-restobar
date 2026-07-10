import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  // Global ignores (replaces .eslintignore)
  {
    ignores: [
      "**/node_modules/**",
      "**/build/**",
      "**/dist/**",
      "**/.turbo/**",
      "**/coverage/**",
      "**/*.min.js",
      "**/public/plugins/**",
      "**/public/dist/**",
      "**/database/**",
      "**/nginx/**",
      "**/docs/**",
    ],
  },

  // Backend (resto-backend) - Node.js CommonJS
  {
    files: ["apps/resto-backend/**/*.js"],
    ...js.configs.recommended,
    languageOptions: {
      globals: globals.node,
      sourceType: "commonjs",
      ecmaVersion: 2021,
    },
  },

  // Backend test files - add Jest globals
  {
    files: ["apps/resto-backend/__tests__/**/*.js"],
    languageOptions: {
      globals: globals.jest,
    },
  },

  // Frontend apps + shared packages - React + JSX
  {
    files: [
      "apps/admin-frontend/src/**/*.{js,jsx}",
      "apps/delivery-frontend/src/**/*.{js,jsx}",
      "apps/caja-frontend/src/**/*.{js,jsx}",
      "apps/cocina-frontend/src/**/*.{js,jsx}",
      "apps/mesas-frontend/src/**/*.{js,jsx}",
      "packages/ui/src/**/*.js",
    ],
    ...js.configs.recommended,
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      globals: globals.browser,
      sourceType: "module",
      ecmaVersion: 2021,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",  // React 17+ doesn't need React import
    },
  },

  // Frontend test files - add Jest globals
  {
    files: [
      "apps/admin-frontend/src/**/__tests__/**/*.test.js",
      "apps/admin-frontend/src/**/__tests___/**/*.test.js",  // typo in folder name
      "apps/cocina-frontend/src/**/__tests__/**/*.test.js",
      "apps/cocina-frontend/src/**/*.test.js",
      "apps/mesas-frontend/src/**/*.test.{js,jsx}",
    ],
    languageOptions: {
      globals: globals.jest,
    },
  },
];
