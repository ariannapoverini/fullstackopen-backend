module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        eqeqeq: 'error',
        'no-trailing-spaces': 'error',
        'object-curly-spacing': ['error', 'always'],
        'arrow-spacing': ['error', { before: true, after: true }],
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'no-console': 0,
        'no-unused-vars': 0,
        'no-unreachable': 0,
        'no-undef': 0,
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
    },
}