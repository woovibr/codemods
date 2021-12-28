const field = {
  error: {
    type: GraphQLString,
    resolve: ({ error }, _, context) => error && context.t(error),
  },
};
