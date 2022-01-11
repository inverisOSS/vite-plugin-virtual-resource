module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended'
  ],
  root: true,
  env: {
    browser: true,
    es2021: true,
    es6: true,
    node: true,
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': [ 'error', {
      'extendDefaults': true,
      'types': {
        '{}': false
      }
    }],
    'no-template-curly-in-string': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-useless-constructor': ['error'],
    'array-bracket-spacing': 0,
    'comma-dangle': 'off',
    'computed-property-spacing': 0,
    'key-spacing': 0,
    'max-len': [2, 120, 2],
    'no-multiple-empty-lines': [ 'error', { max: 1, maxBOF: 2, maxEOF: 0 } ],
    'no-multi-spaces': [ 'error', {
      'ignoreEOLComments': true
    }],
    'no-new': 0,
    'no-prototype-builtins': 0,
    'no-unneeded-ternary': 'off',
    'no-useless-constructor': 'off',
    'object-curly-spacing': [ 2, 'always' ],
    'operator-linebreak': [ 2, 'before' ],
    quotes: 0,
    'space-before-function-paren': 'off',
    'space-in-parens': 'off',
    'space-unary-ops': 'off',
    strict: 2
  }
}
