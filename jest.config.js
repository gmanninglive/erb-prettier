/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["dist", "node_modules"],
  coverageProvider: "v8",
  coverageReporters: ["json-summary", "text", "lcov"],
};
