module.exports = {
  settings: {
    react: {
      version: 'detect'
    }
  },
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    'plugin:react/recommended',
    'standard',
    'plugin:jsx-a11y/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'jsx-a11y',
    'simple-import-sort'
  ],
  rules: {
    'react/react-in-jsx-scope': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'no-unused-vars': 0,
    'simple-import-sort/sort': 'error'
  }
}
