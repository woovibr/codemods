export default createQueryRendererModern(TableSelectionActionModalFragmentContainer, TableSelectionActionModal, {
  query: graphql`
    query TableSelectionActionModalQuery($groupInterviewId: ID, $groupInterviewRoomId: ID) {
      ...TableSelectionActionModal_query
        @arguments(groupInterviewId: $groupInterviewId, groupInterviewRoomId: $groupInterviewRoomId)
    }
  `,
  queriesParams: ({ groupInterviewId, groupInterviewRoomId }) => ({
    groupInterviewId,
    groupInterviewRoomId,
  }),
  loadingView: null,
});