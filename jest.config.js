const config = {
    displayName: "ilib-mono-webos root",
	collectCoverage: true,
    coverageThreshold: {
        global: {
          branches: 30
        }
    },
    coverageReporters: [
        "html",
        "lcov",
        "text",
        "json"
    ],
}

module.exports = config;
