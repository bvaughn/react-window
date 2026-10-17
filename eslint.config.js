import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

const USE_LAYOUT_EFFECT_MESSAGE =
  "useLayoutEffect logs warnings during server rendering in React 18; use useIsomorphicLayoutEffect instead.";

export default tseslint.config([
  globalIgnores([
    "dist",
    "docs",
    "public/generated",
    "integrations/next/.next"
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    }
  },
  {
    files: ["lib/**/*.{ts,tsx}"],
    ignores: [
      "lib/**/*.test.{ts,tsx}",
      "lib/utils/test/**",
      "lib/hooks/useIsomorphicLayoutEffect.ts"
    ],
    rules: {
      "react-hooks/exhaustive-deps": [
        "warn",
        { additionalHooks: "useIsomorphicLayoutEffect" }
      ],
      "no-restricted-properties": [
        "error",
        {
          object: "React",
          property: "useLayoutEffect",
          message: USE_LAYOUT_EFFECT_MESSAGE
        }
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              importNames: ["useLayoutEffect"],
              message: USE_LAYOUT_EFFECT_MESSAGE
            }
          ]
        }
      ]
    }
  }
]);
