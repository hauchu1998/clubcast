module.exports = {
    env: {
      browser: true,
      es2021: true,
      jest: true,
    },
    extends: ["airbnb-base", "prettier", "plugin:node/recommended"],
    plugins: ["prettier"],
    overrides: [],
    globals: {
      jasmine: true,
    },
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "import/extensions": 0,
      "no-console": 0,
      quotes: 0,
      "comma-dangle": 0,
      "max-len": ["error", { code: 150 }],
      "node/no-unpublished-import": [
        "error",
        {
          allowModules: ["supertest"],
        },
      ],
      "import/no-extraneous-dependencies": 0,
      "import/prefer-default-export": 0,
    },
  };