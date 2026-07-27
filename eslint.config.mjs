import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Standalone CommonJS utility/maintenance scripts (not part of the Next.js app).
    // These run directly with `node <script>` and rely on CommonJS semantics (__dirname, require).
    "check-chapters.js",
    "fix-flashcards.js",
    "scripts/**",
  ]),
]);

export default eslintConfig;
