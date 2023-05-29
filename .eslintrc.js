module.exports = {
  env: {
      browser: true,
      es2021: true,
  },
  extends: [
      'airbnb-base',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/typescript',
      'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      project: './tsconfig.json',
  },
  ignorePatterns: ['dist', 'node_modules', 'dump', '*config.js', '*.test.js', '.eslintrc.js'],
  plugins: ['@typescript-eslint'],
  rules: {
      "import/extensions": [
          "error",
          "ignorePackages",
          {
            "js": "never",
            "jsx": "never",
            "ts": "never",
            "tsx": "never"
          }
       ],
       'no-console': 'off',
       "@typescript-eslint/no-explicit-any": "off",
       "@typescript-eslint/no-var-requires": "off"
  },
}
