module.exports = {
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  plugins: [
    '@typescript-eslint',
    'react-hooks',
    '@stylistic',
    '@stylistic/ts',
    'import',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  ignorePatterns: [
    'third-packages/inversify/**/*',
    'dist',
  ],
  rules: {
    '@typescript-eslint/no-unsafe-declaration-merging': 'off',
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'parameter',
        format: ['camelCase', 'PascalCase'],
        trailingUnderscore: 'allowSingleOrDouble',
      },
      {
        selector: 'class',
        format: ['PascalCase'],
      },
      {
        selector: 'enum',
        format: ['PascalCase'],
      },
      {
        selector: 'enumMember',
        format: ['PascalCase'],
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
      },
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
      },
    ],
    '@typescript-eslint/triple-slash-reference': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'import/no-named-as-default-member': 'off',
    'import/default': 'off',
    'import/no-unresolved': 'off',
    'import/order': [
      'error',
      {
        'newlines-between': 'always', // 组间有空行
        alphabetize: {
          order: 'asc', // 'asc' | 'desc'
          caseInsensitive: false, // 忽略大小写
        },
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
        ],
      },
    ],
    '@stylistic/semi': 'error',
    '@stylistic/jsx-indent': ['error', 2],
    '@stylistic/max-len': [
      'error',
      {
        code: 120,
        tabWidth: 2,
      },
    ],
    '@stylistic/space-infix-ops': ['error', { int32Hint: false }],
    '@stylistic/space-unary-ops': 'error',
    '@stylistic/space-before-blocks': 'error',
    '@stylistic/no-multi-spaces': 'error',
    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/object-property-newline': 'error',
    '@stylistic/quote-props': ['error', 'as-needed'],
    // curly: "error",

    // "@stylistic/array-bracket-newline": ["error", { "multiline": true }],
    '@stylistic/array-bracket-spacing': ['error', 'never'],
    // "@stylistic/array-element-newline": ["error", { "multiline": true }],
    '@stylistic/arrow-parens': ['error', 'as-needed'],
    '@stylistic/arrow-spacing': 'error',
    '@stylistic/comma-dangle': ['error', 'always-multiline'],
    '@stylistic/comma-spacing': ['error', {
      before: false,
      after: true,
    }],
    '@stylistic/computed-property-spacing': ['error', 'never'],
    '@stylistic/eol-last': ['error', 'always'],
    '@stylistic/function-call-argument-newline': ['error', 'consistent'],
    '@stylistic/function-call-spacing': ['error', 'never'],
    '@stylistic/function-paren-newline': ['error', 'multiline-arguments'],
    '@stylistic/semi-spacing': 'error',
    '@stylistic/indent': ['error', 2],
    '@stylistic/key-spacing': ['error', {
      mode: 'strict',
    }],
    '@stylistic/keyword-spacing': ['error', {
      before: true,
      after: true,
    }],
    '@stylistic/new-parens': 'error',
    '@stylistic/no-multiple-empty-lines': ['error', {
      max: 1,
    }],
    '@stylistic/ts/member-delimiter-style': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@stylistic/brace-style': 'error',
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/object-curly-newline': ['error', {
      minProperties: 4,
      multiline: true,
      consistent: true,
    }],
    'no-restricted-exports': ['error', {
      restrictDefaultExports: {
        direct: true,
      },
    }],
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
};
