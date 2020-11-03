module.exports = {
  root: true,
  extends: ['@react-native-community', 'plugin:prettier/recommended'],
  plugins: ['prettier'],

  rules: {
    'prettier/prettier': 'error',
  },
  'eslint.autoFixOnSave': true,
  'eslint.validate': [
    {
      language: 'html',
      autoFix: true,
    },
    {
      language: 'vue',
      autoFix: true,
    },
    {
      language: 'javascript',
      autoFix: true,
    },
    {
      language: 'javascriptreact',
      autoFix: true,
    },
    {
      language: 'typescript',
      autoFix: true,
    },
    {
      language: 'typescriptreact',
      autoFix: true,
    },
  ],
  semi: ['error', 'never'],
}
