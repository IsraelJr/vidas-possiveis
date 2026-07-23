import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTypescript from "eslint-config-next/typescript.js";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    "**/.next/**",
    "**/coverage/**",
    "**/dist/**",
    "**/playwright-report/**",
    "**/test-results/**",
    "**/next-env.d.ts"
  ])
]);
