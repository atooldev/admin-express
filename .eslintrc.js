module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021, // Change to the appropriate version
    sourceType: 'module', // Use 'module' for ES6 modules
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // Add your ESLint rules here
    "@typescript-eslint/no-explicit-any": "off"
  },
};
