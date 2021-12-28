const pkg = require('./package.json');

module.exports = {
  name: pkg.name,
  displayName: pkg.name,
  coverageReporters: ['lcov', 'html'],
  moduleFileExtensions: ['ts', 'js', 'tsx'],
  reporters: ['default', 'jest-junit'],
  resetModules: false,
  testPathIgnorePatterns: ['/node_modules/', './dist'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts|tsx)?$',
  transform: {
    '^.+\\.(js|ts|tsx)?$': require.resolve('babel-jest'),
  },
  cacheDirectory: ".jest-cache",
};
