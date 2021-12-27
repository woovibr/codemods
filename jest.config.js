module.exports = {
  globals: {
    baseDir: '../',
  },
  testEnvironment: 'node',
  roots: ['transforms'],
  testResultsProcessor: './node_modules/jest-junit',
};
