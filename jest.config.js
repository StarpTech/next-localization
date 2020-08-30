const path = require('path');

module.exports = {
    roots: [path.resolve(__dirname)],
    testEnvironment: 'jest-environment-jsdom-sixteen',
    displayName: 'local',
    testURL: 'http://localhost',
    setupFilesAfterEnv: [path.resolve(__dirname, './setupTests.js')]
};
