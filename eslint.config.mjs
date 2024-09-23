import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin"; // Correct import
import tsParser from "@typescript-eslint/parser"; // Import the TypeScript parser
import pluginReact from "eslint-plugin-react";

// Flat config without "extends"
export default [
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser, // Use TypeScript parser for TypeScript files
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
      },
      globals: {
        ...globals.browser, // Browser environment globals
        ...globals.node, // Node.js environment globals
      },
    },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
    },
  },
  // Include recommended JS rules
  pluginJs.configs.recommended,

  // Include TypeScript recommended rules from @typescript-eslint
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser, // Make sure to use TypeScript parser for .ts/.tsx files
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: tseslint.configs.recommended.rules, // Use the recommended TypeScript rules
  },

  // Include recommended React rules
  {
    files: ["**/*.jsx", "**/*.tsx"],
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs.recommended.rules, // Use the recommended React rules
    },
  },
];
