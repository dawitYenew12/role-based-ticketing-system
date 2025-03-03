import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import security from 'eslint-plugin-security';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js','**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      globals: { ...globals.node },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./auth-service/tsconfig.json', './user-service/tsconfig.json'],
      },
    },
    plugins: {
      prettier,
      security,
      '@typescript-eslint': typescript,
    },
    rules: {
      'no-console': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto',
        },
      ],
      'security/detect-object-injection': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
];
