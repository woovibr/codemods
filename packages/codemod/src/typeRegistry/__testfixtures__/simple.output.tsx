import { registerTypeLoader } from '@repo/modules';
import * as EngagementLoader from './EngagementLoader';
const EngagementType = new GraphQLObjectType<IEngagement, GraphQLContext>({
  name: 'Engagement',
  description: 'Represents a Engagement',
  fields: () => ({
    id: globalIdField('Engagement'),
    createdAt: {
      type: GraphQLString,
      resolve: (obj) => (obj.createdAt ? obj.createdAt.toISOString() : null),
    },
  }),
  interfaces: () => [NodeInterface],
});
registerTypeLoader(EngagementType, EngagementLoader.load);
