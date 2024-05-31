module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.js"],
  globals: {
    fetch: global.fetch,
  },
};
