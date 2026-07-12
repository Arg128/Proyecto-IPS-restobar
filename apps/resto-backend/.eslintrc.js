module.exports = {
    "env": {
        "amd": true,
        "node": true,
        "browser": true,
        "es6": true,
        "jest/globals": true
    },
    "extends": ["eslint:recommended", "plugin:jest/recommended"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": ["jest"],
    "rules": {
    }
};
