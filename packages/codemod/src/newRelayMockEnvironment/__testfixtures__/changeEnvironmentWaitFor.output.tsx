import { MockPayloadGenerator, createMockEnvironment } from 'relay-test-utils';

it('test', async () => {
  const environment = createMockEnvironment();
  const root = withProviders({
    test: 'test',
    environment
  });

  await waitFor(() => environment.mock.getMostRecentOperation());
})
