const config = {
    displayName: "ilib-mono-webos root",
    coverageReporters: [
        "html",
        "lcov",
        "json-summary",
        ["text", {"file": "../coverage.txt"}],
    ],
    reporters: [
        "default",
        ['jest-junit', {outputName: 'junit.xml'}],
    ]
}


module.exports = config;
