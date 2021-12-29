import { MockPayloadGenerator } from 'relay-test-utils';

it('test', async () => {
  const root = withProviders({
    test: 'test',
  });

  await waitFor(() => Environment.mock.getMostRecentOperation());
})
