module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  roots: ['<rootDir>/test'],
  coveragePathIgnorePatterns: ['<rootDir>/test/', '<rootDir>/node_modules'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!**/node_modules/**'
  ],
  // A map from regular expressions to module names that allow to stub out resources with a single module
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
  verbose: true,
  coverageDirectory: './coverage',
  bail: 1,
  testTimeout: 10000,
  setupFiles: ['<rootDir>/test/setup.ts'],
  coverageReporters: ['json', 'html', 'text'],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(tsx?)$',
  testURL: 'http://localhost/' // https://github.com/facebook/jest/issues/6769
}
