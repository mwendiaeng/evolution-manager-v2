module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ["@herowcode/eslint-config/react", "eslint:recommended"],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "prettier/prettier": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "import-helpers/order-imports": [
      "warn",
      {
        newlinesBetween: "always",
        groups: [
          "module",
          "/^@/components/",
          "/^@/contexts/",
          "/^@/layout/",
          "/^@/lib/",
          "/^@/pages/",
          "/^@/routes/",
          "/^@/services/",
          "/^@/types/",
          "/^@/utils/",
          ["parent", "sibling", "index"],
        ],
        alphabetize: { order: "asc", ignoreCase: true },
      },
    ],
  },
};
