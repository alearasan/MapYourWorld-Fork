/**
 * Configuración de ESLint para MapYourWorld
 * Esta configuración se aplicará a todo el proyecto
 */

module.exports = {
  root: true,
  // Entorno de ejecución
  env: {
    node: true,
    browser: true,
    es2022: true,
    jest: true,
  },
  // Configuración de parser para TypeScript
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './*/tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  // Plugins y extensiones
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  // Ignorar archivos específicos
  ignorePatterns: ['node_modules/', 'dist/', 'build/', '*.js', '!.eslintrc.js'],
  // Reglas personalizadas
  rules: {
    // Errores y buenas prácticas
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-var': 'error',
    'prefer-const': 'warn',
    
    // TypeScript
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-inferrable-types': 'warn',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-misused-promises': 'warn',
    
    // Promesas y asincronía
    'require-await': 'off',
    '@typescript-eslint/require-await': 'warn',
    
    // Estilo de código
    'max-len': ['warn', { code: 100, ignoreComments: true, ignoreStrings: true }],
    'quotes': ['warn', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    
    // Importaciones
    'no-duplicate-imports': 'error'
  },
  // Configuraciones específicas para diferentes partes del proyecto
  overrides: [
    // Backend
    {
      files: ['backend/**/*.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'warn',
      },
    },
    // Frontend Web
    {
      files: ['frontend/web/**/*.{ts,tsx}'],
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
      ],
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
      },
    },
    // Frontend Mobile
    {
      files: ['frontend/mobile/**/*.{ts,tsx}'],
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react-native/all',
      ],
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react-native/no-unused-styles': 'warn',
        'react-native/no-inline-styles': 'warn',
      },
    },
    // Tests
    {
      files: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**/*.ts'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
      },
    },
  ],
  // Configuración para cada entorno
  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    },
    react: {
      version: 'detect'
    }
  }
}; 