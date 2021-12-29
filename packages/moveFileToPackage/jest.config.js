const baseOptions = require('../../jest.config.base');

module.exports = {
  ...baseOptions,

  transformIgnorePatterns: ['node_modules/(?!tempy|unique-string|crypto-random-string|is-stream)'],
};
