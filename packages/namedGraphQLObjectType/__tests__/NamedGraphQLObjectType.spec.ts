import { defineTest } from '../../../test/testUtils';

describe('NamedGraphQLObjectType', () => {
  defineTest({
    dirName: __dirname,
    transformName: 'NamedGraphQLObjectType',
    testFilePrefix: 'simple',
  });
  defineTest({
    dirName: __dirname,
    transformName: 'NamedGraphQLObjectType',
    testFilePrefix: 'type',
  });
});
