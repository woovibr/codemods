
it('test', () => {
  const root = withProviders({
    test: 'test',
  });

  Environment.mock.resolveMostRecentOperation((operation) =>
    MockPayloadGenerator.generate(operation, customMockResolvers),
  );
})
