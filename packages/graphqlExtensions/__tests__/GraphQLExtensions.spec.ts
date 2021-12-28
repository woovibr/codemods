import { defineTest } from '../../../test/testUtils';

describe('GraphQLExtensions', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'GraphQLExtensions',
    testFilePrefix: 'authenticatedOnly',
  });
  defineTest({
    dirName: __dirname,
    transformName: 'GraphQLExtensions',
    testFilePrefix: 'myself',
  });
});
