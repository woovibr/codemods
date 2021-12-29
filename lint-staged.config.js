module.exports = {
  '*.{js,ts}': ['prettier --write', 'eslint --fix .', 'jest --passWithNoTests'],
};
