// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: { "unused-imports": unusedImports },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^type$' },
      ],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'arrow-parens': ['error', 'always'],
      'arrow-spacing': 'error',
      'block-spacing': 'error',
      'brace-style': 'error',
      'comma-spacing': 'error',
      'func-call-spacing': 'error',
      'rest-spread-spacing': 'error',
      'object-curly-spacing': ['error', 'always'],
      indent: ['error', 2, { SwitchCase: 1 }],
      'key-spacing': 'error',
      'keyword-spacing': 'error',
      'space-before-function-paren': 'error',
      'new-parens': 'error',
      quotes: ['error', 'single'],
      'space-before-blocks': 'error',
      'space-in-parens': 'error',
      eqeqeq: ['error', 'smart'],
      '@typescript-eslint/no-unsafe-call': 'off',
      'unused-imports/no-unused-imports': 'error',
      'no-trailing-spaces': ['error', { skipBlankLines: false }],
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
);
