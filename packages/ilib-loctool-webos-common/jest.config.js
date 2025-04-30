const config = {
    displayName: "ilib-mono-webos ilib-loctool-webos-common",
	collectCoverage: true,
    collectCoverageFrom: [
        "**/*.js",
        "!jest.config.js",
        "!test/**",
        "node_modules/**"
    ],
    coverageReporters: [
        "html",
        "lcov",
        "text",
        "json"
    ],
}

module.exports = config;
