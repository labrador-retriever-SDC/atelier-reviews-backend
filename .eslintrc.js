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
      project: './tsconfig.eslint.json',
  },
  ignorePatterns: ['dist'],
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
       ]
  },
}
