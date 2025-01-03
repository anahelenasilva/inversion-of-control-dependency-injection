import config from "eslint-config-standard";


/** @type {import('eslint').Linter.Config[]} */
export default [
  ...[].concat(config),
  {
    rules: {
      semi: "error",
      "prefer-const": "error",
      "no-var": "error",
      "no-unused-vars": "error",
    }
  }
];
