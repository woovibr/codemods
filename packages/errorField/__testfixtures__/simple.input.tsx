const field = {
  error: {
    type: GraphQLString,
    resolve: ({ error }) => error,
  },
};
