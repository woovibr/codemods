import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { mockResolvers } from '@repo/test';

import { graphql } from 'react-relay';

import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';

import CompanyEditStatus from '../CompanyEditStatus';
import { withProviders } from '../../../../../../test/testUtils';
import { createQueryRendererModern } from '../../../../../relay';

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
