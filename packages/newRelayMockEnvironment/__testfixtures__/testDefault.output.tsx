import { createMockEnvironment } from 'relay-test-utils';
it('test', () => {
  const environment = createMockEnvironment();
  const root = withProviders({
    test: 'test',
    environment
  });

  environment.mock.resolveMostRecentOperation((operation) =>
    MockPayloadGenerator.generate(operation, customMockResolvers),
  );
})
