import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@next/next/no-page-custom-font": "off",
      // Existing calculator shells use a mounted-state guard for client-only charts.
      // Refactor those flows separately instead of changing their hydration behavior
      // as part of an ESLint migration.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "dist/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);
