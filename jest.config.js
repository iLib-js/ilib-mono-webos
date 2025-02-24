const config = {
    displayName: "ilib-mono-webos root",
    coverageReporters: [
        "html",
        "json-summary",
        ["text", {"file": "../coverage.txt"}],
    ],
    reporters: [
        "default",
        ['jest-junit', {outputName: 'junit.xml'}],
    ]
}


module.exports = config;
