module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'rules': {
    "require-jsdoc": "off",
    "no-undef": "off",
  },
};
