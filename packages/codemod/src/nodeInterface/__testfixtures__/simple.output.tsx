import { nodeInterface } from '@repo/modules';

const AdminUserType = new GraphQLObjectType({
  name: 'AdminUser',
  description: 'Represents AdminUser',
  fields: () => ({}),
  interfaces: () => [nodeInterface],
});
