import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import babelParser from "@babel/eslint-parser";

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
      "packages/ui/src/**/*.{js,jsx}",
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
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },

  // Frontend + backend test files - add Jest globals
  {
    files: [
      "apps/admin-frontend/src/**/__tests__/**/*.test.js",
      "apps/admin-frontend/src/**/__tests___/**/*.test.js",
      "apps/cocina-frontend/src/**/__tests__/**/*.test.js",
      "apps/cocina-frontend/src/**/*.test.js",
      "apps/mesas-frontend/src/**/*.test.{js,jsx}",
    ],
    languageOptions: {
      globals: globals.jest,
      ecmaVersion: 2021,
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
    },
  },
];
