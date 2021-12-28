import { NodeInterface } from '../../interface/NodeInterface';

const AdminUserType = new GraphQLObjectType({
  name: 'AdminUser',
  description: 'Represents AdminUser',
  fields: () => ({}),
  interfaces: () => [NodeInterface],
});
