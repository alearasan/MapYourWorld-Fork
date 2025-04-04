/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "**/services/*.*,**/src/services/*.*",  
  ],
  coverageReporters: ['lcov', 'text', 'text-summary'],
  
};