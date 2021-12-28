it('test', () => {
  const test = 'test';
  Environment.mock.resolveMostRecentOperation((operation) =>
    MockPayloadGenerator.generate(operation, customMockResolvers),
  );
})
