import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import noInlineStyles from "eslint-plugin-no-inline-styles";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react: reactPlugin,
      import: importPlugin,
      "no-inline-styles": noInlineStyles,
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      // Formatting
      "array-bracket-spacing": ["error", "never"],
      "array-callback-return": "error",
      "arrow-spacing": "error",
      "comma-dangle": ["error", "always-multiline"],
      "comma-spacing": "error",
      "comma-style": ["error", "last"],
      curly: ["error", "all"],
      "eol-last": "error",
      "jsx-quotes": ["error", "prefer-double"],
      "func-call-spacing": ["error", "never"],
      indent: ["error", 2, { SwitchCase: 1 }],
      "key-spacing": ["error", { beforeColon: false, afterColon: true }],
      "keyword-spacing": "error",
      "linebreak-style": ["error", "unix"],
      "lines-between-class-members": ["error", "always"],
      "max-depth": ["error", 4],
      "no-else-return": "error",
      "no-multi-spaces": "error",
      "no-param-reassign": "error",
      "no-prototype-builtins": "error",
      radix: ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],
      semi: ["error", "always"],
      "no-lonely-if": "error",
      "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],
      "no-tabs": "error",
      "no-trailing-spaces": ["error", { skipBlankLines: true }],
      "no-whitespace-before-property": "error",
      "object-curly-spacing": ["error", "always"],
      "semi-spacing": "error",
      "space-before-blocks": "error",
      "space-before-function-paren": [
        "error",
        { anonymous: "never", named: "never", asyncArrow: "always" },
      ],
      "space-in-parens": ["error", "never"],
      "space-infix-ops": "error",
      "prefer-const": "error",
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      "template-curly-spacing": ["error", "never"],
      "sort-imports": ["error", { ignoreCase: true, ignoreDeclarationSort: true }],

      // Import rules
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-useless-path-segments": "error",
      "import/order": [
        "error",
        {
          alphabetize: { order: "asc", caseInsensitive: true },
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
          "newlines-between": "always",
        },
      ],

      // TypeScript rules
      "@typescript-eslint/array-type": "error",
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: ["variable", "parameter", "classProperty"],
          custom: { regex: "[A-Za-z_]*(?<!_)", match: true },
          format: null,
          trailingUnderscore: "forbid",
        },
        {
          selector: "variable",
          types: ["boolean"],
          format: ["PascalCase"],
          prefix: ["is", "should", "can", "has"],
        },
        {
          selector: ["function", "method"],
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "forbid",
          trailingUnderscore: "forbid",
        },
        {
          selector: ["typeLike"],
          format: ["PascalCase"],
          leadingUnderscore: "forbid",
          trailingUnderscore: "forbid",
        },
        {
          selector: ["typeProperty", "objectLiteralProperty"],
          format: null,
        },
        {
          selector: ["default"],
          format: ["camelCase"],
          leadingUnderscore: "forbid",
          trailingUnderscore: "forbid",
        },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-base-to-string": "error",
      "@typescript-eslint/no-confusing-non-null-assertion": "error",
      "@typescript-eslint/no-dynamic-delete": "error",
      "@typescript-eslint/no-invalid-void-type": "error",
      "@typescript-eslint/no-meaningless-void-operator": "error",
      "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
      "@typescript-eslint/no-use-before-define": "error",
      "@typescript-eslint/prefer-for-of": "error",
      "@typescript-eslint/prefer-includes": "error",
      "@typescript-eslint/prefer-literal-enum-member": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/prefer-reduce-type-parameter": "error",
      "@typescript-eslint/prefer-string-starts-ends-with": "error",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/no-unsafe-argument": "error",

      // No inline styles
      "no-inline-styles/no-inline-styles": "error",

      // React rules
      "react/jsx-curly-brace-presence": "error",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/self-closing-comp": ["error", { component: true, html: true }],
      "react/void-dom-elements-no-children": "error",
      "react/jsx-boolean-value": ["error", "always"],
      "react/jsx-curly-spacing": ["error", "never"],
      "react/jsx-equals-spacing": ["error", "never"],
      "react/jsx-indent": ["error", 2],
      "react/jsx-indent-props": ["error", { indentMode: 2, ignoreTernaryOperator: true }],
      "react/jsx-pascal-case": "error",
      "react/jsx-tag-spacing": [
        "error",
        { closingSlash: "never", beforeSelfClosing: "always", afterOpening: "never" },
      ],
      "react/jsx-wrap-multilines": [
        "error",
        { declaration: true, assignment: true, return: true, arrow: true },
      ],
      "react-hooks/exhaustive-deps": "error",
    },
  },
  prettier,
]);

export default eslintConfig;
