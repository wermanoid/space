// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/node_modules/',
    '__test__',
    '__stories__',
    '/jest/',
  ],
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: {
    '\\.(scss|css)$': '<rootDir>/src/jest/stub.ts',
  },
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: [
    '@testing-library/react/cleanup-after-each',
    '<rootDir>/src/jest/setup.ts',
  ],
  testRegex: '(\\.(test|spec))\\.(ts|tsx|js)$',
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/jest/stub.ts',
  },
};
