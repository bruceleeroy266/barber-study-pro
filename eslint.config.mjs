import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Legacy compatibility debt: keep these findings visible in CI without
  // blocking unrelated product work. New/modified code should still avoid
  // introducing these patterns, and the warnings remain in the lint report.
  {
    rules: {
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react/no-unescaped-entities": "warn",
    },
  },

  // Historical tests intentionally use lightweight `any`-based mocks in a
  // number of places. Keep the debt visible while allowing the test suite to
  // run as the stronger behavioral gate.
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "tests/**/*.ts", "tests/**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // Narrow legacy exceptions that pre-date the current CI gate. These stay
  // warnings rather than being hidden so they can be cleaned up incrementally.
  {
    files: ["src/lib/export-utils.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    files: ["src/lib/reassessment/exclusion-engine.ts"],
    rules: {
      "prefer-const": "warn",
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Standalone utility scripts (not part of the Next.js runtime):
    "scripts/**",
    "tools/**",
    "*.js",
  ]),
]);

export default eslintConfig;
