module.exports = {
  env: {
    node: true,
    jest: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 10,
    sourceType: 'module',
    ecmaFeatures: {
      module: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
  ],
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "prettier",
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
    "comma-dangle": ["error", "always-multiline"],
    semi: ['error', 'always'],
    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
    "import/prefer-default-export": 0,
    '@typescript-eslint/no-var-requires': 2,
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true },
    ]
  },
}
