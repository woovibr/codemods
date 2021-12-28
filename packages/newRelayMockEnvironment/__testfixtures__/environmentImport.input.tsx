import { MockPayloadGenerator } from 'relay-test-utils';
import { Environment } from '../../relay';

it('test', () => {
  const root = withProviders({
    test: 'test',
  });

  Environment.mock.resolveMostRecentOperation((operation) =>
    MockPayloadGenerator.generate(operation, customMockResolvers),
  );
})
