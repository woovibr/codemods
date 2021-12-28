import { createMockEnvironment } from 'relay-test-utils';
const environment = createMockEnvironment();
const root = withProviders({
  test: 'test',
  environment
})
