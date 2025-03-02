const js = require('@eslint/js');
const prettier = require('eslint-plugin-prettier');
const security = require('eslint-plugin-security');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    plugins: {
      prettier,
      security,
    },
    rules: {
      'no-console': 'error',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto',
        },
      ],
      'security/detect-object-injection': 'off',
    },
  },
];
