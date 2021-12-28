export default hot(
  createQueryRendererModern(OneOnOneScheduleAddFragmentContainer, OneOnOneScheduleAdd, {
    query: graphql`
      query OneOnOneScheduleAddQuery($filters: FeedbackTopicFilter, $id: ID) {
        ...OneOnOneScheduleAdd_query @arguments(filters: $filters, id: $id)
      }
    `,
    queriesParams: ({ match }) => ({
      filters: {
        isActive: true,
        modules: [TOPIC_MODULES.ONE_TO_ONE],
      },
      id: match.params.id,
    }),
  }),
);
