/** @format */

// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parserOptions:{
        // allow async-await
        ecmaVersion:8
    },
    extends: [
        'plugin:vue/essential',
        'plugin:prettier/recommended',
        'eslint:recommended'
    ],
    env: {
        node: true,
        es6: true,
        browser: true
    },
    rules: {
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'generator-star-spacing': 0,
        'no-label-var': 'off',
        'no-console': 0,
        'no-unused-vars': 0,
        'no-useless-escape': 0,
        'no-multiple-empty-lines': [
            2,
            {
                max: 3
            }
        ],
        'vue/no-parsing-error': [2, {
            "x-invalid-end-tag": false
        }],
        'prettier/prettier': [
            'error',
            {
                printWidth:120, //单行输出的最大长度
                singleQuote: true,
                semi: true,
                trailingComma: 'none',
                bracketSpacing: true,
                jsxBracketSameLine: false,
                insertPragma: true,
                requirePragma: false
            }
        ]
    }
};