const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-webos-javascript",
        color: "red",
    },
}

module.exports = config;
