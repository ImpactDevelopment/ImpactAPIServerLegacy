module.exports = {
    'env': {
        'es6': true,
        'node': true,
        'mocha': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 2017,
        'sourceType': 'module'
    },
    'rules': {
        /* Possible Errors */
        'no-extra-boolean-cast': 'error',
        /* Best Practices */
        'eqeqeq': 'error',
        'no-empty-function': 'error',
        'no-eval': 'error',
        'no-useless-concat': 'error',
        'no-useless-return': 'error',
        'no-with': 'error',
        'prefer-promise-reject-errors': 'warn',
        'quote-props': ['error', 'always'],
        /* Strict Mode */
        'strict': ['error', 'never'],
        /* Variables */
        'no-unused-vars': 'error',
        'no-use-before-define': 'error',
        /* Node.js and CommonJS */
        'callback-return': 'error',
        'handle-callback-err': 'error',
        'no-path-concat': 'error',
        'no-process-exit': 'error',
        'no-console': 'off',
        /* Stylistic Issues */
        'array-bracket-spacing': 'error',
        'block-spacing': 'error',
        'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
        'camelcase': 'off',
        'comma-dangle': 'error',
        'comma-spacing': ['error', {
        'before': false,
            'after': true
        }],
        'comma-style': ['error', 'last'],
        'eol-last': 'error',
        'func-call-spacing': ['error', 'never'],
        'indent': ['error', 4, { 'MemberExpression': 0 }],
        'linebreak-style': ['error', 'unix'],
        'max-depth': ['warn', 3],
        'max-nested-callbacks': ['warn', 4],
        'new-parens': 'error',
        'newline-per-chained-call': 'warn',
        'no-mixed-spaces-and-tabs': 'error',
        'no-multiple-empty-lines': ['error', {
        'max': 1,
            'maxEOF': 1
        }],
        'no-tabs': 'error',
        'no-trailing-spaces': 'error',
        'no-whitespace-before-property': 'off',
        'object-curly-spacing': ['error', 'always'],
        'object-property-newline': 'warn',
        'padded-blocks': ['error', 'never'],
        'quotes': ['warn', 'single'],
        'semi': ['error', 'never'],
        'space-before-function-paren': 'error',
        'switch-colon-spacing': ['error', {
        'before': false,
            'after': true
        }],
        /* ECMAScript 6 */
        'arrow-body-style': ['error', 'as-needed'],
        'arrow-parens': ['error', 'always'],
        'arrow-spacing': ['error', {
        'before': true,
            'after': true
        }],
        'no-var': 'error',
        'prefer-const': 'warn'
    }
}
